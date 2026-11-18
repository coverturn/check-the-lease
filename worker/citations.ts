import { getStateEntry } from "./states";
import type { AnalysisResult } from "./schema";

/**
 * Grounding checks for model output.
 *
 * The analysis prompt tells the model to cite only statutes from the state-law
 * context and to quote the lease verbatim. A prompt is a request, not a
 * guarantee, so nothing leaves the API until it has been checked against the
 * two sources of truth we hold: the statute dataset and the lease text itself.
 *
 * - A citation that is not in the dataset for the selected state is removed.
 *   The plain-English point stays, uncited, which is what the prompt asks the
 *   model to do when it has no citation.
 * - An `original_quote` that does not appear in the uploaded lease is removed.
 */

export type GroundingReport = {
  citationsKept: number;
  citationsRemoved: number;
  quotesKept: number;
  quotesRemoved: number;
};

/** Collapse the formatting differences a model introduces when repeating a citation. */
export function normaliseCitation(citation: string): string {
  return citation
    .toLowerCase()
    .replace(/[‐-―]/g, "-") // typographic dashes
    .replace(/§\s*/g, "§ ") // one space after the section sign
    .replace(/[()\[\]]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[.,;:]+$/g, "")
    .trim();
}

/** Every statute citation on file for a state, normalised. Empty when the state is unknown. */
export function knownCitations(state?: string | null): Set<string> {
  const entry = getStateEntry(state);
  const known = new Set<string>();
  for (const right of entry?.rights ?? []) {
    if (right.citation) known.add(normaliseCitation(right.citation));
  }
  return known;
}

/**
 * True when every statute the model cited is on file for the state.
 * The model sometimes joins two statutes in one string ("A; B" or "A and B"),
 * so each part is checked on its own.
 */
export function isKnownCitation(citation: string, known: Set<string>): boolean {
  const whole = normaliseCitation(citation);
  if (!whole) return false;
  if (known.has(whole)) return true;
  const parts = whole
    .split(/\s*;\s*|\s+and\s+/)
    .map((part) => normaliseCitation(part))
    .filter(Boolean);
  return parts.length > 1 && parts.every((part) => known.has(part));
}

function normaliseText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[‐-―]/g, "-")
    .replace(/…|\.\.\./g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Shortest quote worth checking. Anything shorter matches almost any document. */
const MIN_QUOTE_LENGTH = 12;

/** True when the quote appears in the lease, ignoring case, whitespace and smart punctuation. */
export function quoteAppearsInLease(quote: string, leaseText: string): boolean {
  const needle = normaliseText(quote).replace(/^["']+|["']+$/g, "").trim();
  if (needle.length < MIN_QUOTE_LENGTH) return false;
  return normaliseText(leaseText).includes(needle);
}

/**
 * Return a copy of the analysis with unverifiable citations and quotes removed,
 * plus a count of what was kept and what was dropped.
 */
export function groundAnalysis(
  analysis: AnalysisResult,
  state: string | null | undefined,
  leaseText: string,
): { analysis: AnalysisResult; report: GroundingReport } {
  const known = knownCitations(state);
  const report: GroundingReport = { citationsKept: 0, citationsRemoved: 0, quotesKept: 0, quotesRemoved: 0 };

  const checkQuote = <T extends { original_quote?: string }>(item: T): T => {
    if (item.original_quote === undefined) return item;
    if (quoteAppearsInLease(item.original_quote, leaseText)) {
      report.quotesKept += 1;
      return item;
    }
    report.quotesRemoved += 1;
    const { original_quote: _dropped, ...rest } = item;
    return rest as T;
  };

  const potential_issues = analysis.potential_issues.map((issue) => {
    let checked = checkQuote(issue);
    if (checked.citation !== undefined) {
      if (isKnownCitation(checked.citation, known)) {
        report.citationsKept += 1;
      } else {
        report.citationsRemoved += 1;
        const { citation: _dropped, ...rest } = checked;
        checked = rest as typeof checked;
      }
    }
    return checked;
  });

  const key_terms = analysis.key_terms.map((term) => checkQuote(term));

  return { analysis: { ...analysis, key_terms, potential_issues }, report };
}
