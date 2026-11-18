import { describe, expect, it } from "vitest";
import { citationForms, groundAnalysis, isKnownCitation, knownCitations, normaliseCitation, quoteAppearsInLease } from "../citations";
import { getStateEntry } from "../states";
import type { AnalysisResult } from "../schema";

const california = getStateEntry("CA");
const realCitations = (california?.rights ?? []).map((r) => r.citation).filter((c): c is string => Boolean(c));
const real = realCitations[0];
const lease =
  "The Tenant shall pay a late fee of $250 if rent is received after the 3rd day of the month. " +
  "Landlord may enter the premises at any time without notice.";

function analysisWith(issues: AnalysisResult["potential_issues"], keyTerms: AnalysisResult["key_terms"] = []): AnalysisResult {
  return {
    key_terms: keyTerms,
    potential_issues: issues,
    missing_protections: { renter: [], landlord: [] },
    questions: [],
    stats: { potential_issues: issues.length, missing_protections: 0, questions: 0 },
  };
}

describe("normaliseCitation", () => {
  it("ignores case, spacing after the section sign, brackets and trailing punctuation", () => {
    expect(normaliseCitation("Cal. Civ. Code §1950.5")).toBe(normaliseCitation("cal. civ. code §  1950.5."));
    expect(normaliseCitation("(Cal. Civ. Code § 1950.5)")).toBe(normaliseCitation("Cal. Civ. Code § 1950.5"));
  });
});

describe("citationForms", () => {
  it("indexes each statute of a joined citation on its own", () => {
    const forms = citationForms("Cal. Civ. Code \u00a7 1942; Cal. Civ. Proc. Code \u00a7 1174.2");
    expect(forms).toContain(normaliseCitation("Cal. Civ. Code \u00a7 1942"));
    expect(forms).toContain(normaliseCitation("Cal. Civ. Proc. Code \u00a7 1174.2"));
  });

  it("expands a section list into single sections", () => {
    const forms = citationForms("Cal. Civ. Code \u00a7\u00a7 827, 1946, 1946.2");
    expect(forms).toContain(normaliseCitation("Cal. Civ. Code \u00a7 827"));
    expect(forms).toContain(normaliseCitation("Cal. Civ. Code \u00a7 1946.2"));
    expect(forms).toContain(normaliseCitation("Cal. Civ. Code \u00a7\u00a7 827, 1946, 1946.2"));
  });
});

describe("knownCitations", () => {
  it("returns the statutes on file for a state", () => {
    expect(knownCitations("CA").size).toBeGreaterThan(0);
    expect(knownCitations("California")).toEqual(knownCitations("CA"));
  });

  it("returns nothing for a state that is not on file", () => {
    expect(knownCitations("Narnia").size).toBe(0);
    expect(knownCitations(null).size).toBe(0);
  });
});

describe("isKnownCitation", () => {
  const known = knownCitations("CA");

  it("accepts a statute from the dataset however the model formats it", () => {
    expect(isKnownCitation(real, known)).toBe(true);
    expect(isKnownCitation(`(${real.toUpperCase()}).`, known)).toBe(true);
  });

  it("accepts two real statutes joined in one string", () => {
    const two = realCitations.find((c) => c !== real);
    if (!two) return;
    expect(isKnownCitation(`${real}; ${two}`, known)).toBe(true);
    expect(isKnownCitation(`${real} and ${two}`, known)).toBe(true);
  });

  it("accepts a real statute cited down to a subsection", () => {
    expect(isKnownCitation(`${real}(g)(1)`, known)).toBe(true);
    expect(isKnownCitation(`${real} (b)`, known)).toBe(true);
  });

  it("does not treat a longer section number as a subsection of a real one", () => {
    expect(isKnownCitation(`${real}99`, known)).toBe(false);
    expect(isKnownCitation(`${real} of the Imaginary Tenant Act`, known)).toBe(false);
  });

  it("rejects an invented statute, an empty string, and a real statute joined to a fake one", () => {
    expect(isKnownCitation("Cal. Civ. Code § 9999.99", known)).toBe(false);
    expect(isKnownCitation("", known)).toBe(false);
    expect(isKnownCitation(`${real}; Cal. Civ. Code § 9999.99`, known)).toBe(false);
  });

  it("rejects a real statute from a different state", () => {
    const texas = knownCitations("TX");
    expect(isKnownCitation(real, texas)).toBe(false);
  });
});

describe("quoteAppearsInLease", () => {
  it("finds a quote despite case, whitespace and smart quotes", () => {
    expect(quoteAppearsInLease("late fee of $250 if rent is received", lease)).toBe(true);
    expect(quoteAppearsInLease("“LANDLORD may enter   the premises at any time”", lease)).toBe(true);
  });

  it("rejects a quote the lease does not contain", () => {
    expect(quoteAppearsInLease("Tenant waives all rights to a jury trial", lease)).toBe(false);
  });

  it("rejects fragments too short to prove anything", () => {
    expect(quoteAppearsInLease("the", lease)).toBe(false);
  });
});

describe("groundAnalysis", () => {
  it("keeps verified citations and quotes untouched", () => {
    const input = analysisWith([
      { severity: "high", title: "Late fee", explanation: "This clause may be high.", citation: real, original_quote: "late fee of $250 if rent is received" },
    ]);
    const { analysis, report } = groundAnalysis(input, "CA", lease);
    expect(analysis.potential_issues[0].citation).toBe(real);
    expect(analysis.potential_issues[0].original_quote).toBeDefined();
    expect(report).toEqual({ citationsKept: 1, citationsRemoved: 0, quotesKept: 1, quotesRemoved: 0 });
  });

  it("removes an invented citation but keeps the plain-English point", () => {
    const input = analysisWith([
      { severity: "medium", title: "Entry", explanation: "State law generally requires notice.", citation: "Cal. Civ. Code § 9999.99" },
    ]);
    const { analysis, report } = groundAnalysis(input, "CA", lease);
    expect(analysis.potential_issues[0].citation).toBeUndefined();
    expect(analysis.potential_issues[0].title).toBe("Entry");
    expect(analysis.potential_issues[0].explanation).toBe("State law generally requires notice.");
    expect(report.citationsRemoved).toBe(1);
  });

  it("removes every citation when the state is not on file", () => {
    const input = analysisWith([{ severity: "low", title: "Deposit", explanation: "May apply.", citation: real }]);
    const { analysis, report } = groundAnalysis(input, "Narnia", lease);
    expect(analysis.potential_issues[0].citation).toBeUndefined();
    expect(report.citationsRemoved).toBe(1);
  });

  it("removes a quote that is not in the lease, on issues and key terms alike", () => {
    const input = analysisWith(
      [{ severity: "high", title: "Jury waiver", explanation: "May be unenforceable.", original_quote: "Tenant waives all rights to a jury trial" }],
      [{ label: "Rent", value: "$900/month", original_quote: "Rent shall be nine hundred dollars" }],
    );
    const { analysis, report } = groundAnalysis(input, "CA", lease);
    expect(analysis.potential_issues[0].original_quote).toBeUndefined();
    expect(analysis.key_terms[0].original_quote).toBeUndefined();
    expect(analysis.key_terms[0].value).toBe("$900/month");
    expect(report.quotesRemoved).toBe(2);
  });

  it("drops empty citation and quote strings without counting them as removals", () => {
    const input = analysisWith([{ severity: "low", title: "Pets", explanation: "May apply.", citation: "", original_quote: "  " }]);
    const { analysis, report } = groundAnalysis(input, "CA", lease);
    expect(analysis.potential_issues[0].citation).toBeUndefined();
    expect(analysis.potential_issues[0].original_quote).toBeUndefined();
    expect(report).toEqual({ citationsKept: 0, citationsRemoved: 0, quotesKept: 0, quotesRemoved: 0 });
  });

  it("does not mutate the analysis it was given", () => {
    const input = analysisWith([{ severity: "low", title: "Deposit", explanation: "May apply.", citation: "Fake § 1" }]);
    groundAnalysis(input, "CA", lease);
    expect(input.potential_issues[0].citation).toBe("Fake § 1");
  });
});
