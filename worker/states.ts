import previews from "./data/state-previews.json";

type Right = { text: string; citation?: string };
type Program = { name: string; org?: string; who?: string; what?: string; category?: string };
type StateEntry = { name: string; rights?: Right[]; programs?: Program[] };

const STATES: Record<string, StateEntry> = (previews as { states: Record<string, StateEntry> }).states;

// Build a name -> code lookup so we accept either "CA" or "California".
const NAME_TO_CODE: Record<string, string> = {};
for (const [code, entry] of Object.entries(STATES)) {
  if (entry?.name) NAME_TO_CODE[entry.name.toLowerCase()] = code;
}

export function resolveStateCode(input?: string | null): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (STATES[trimmed.toUpperCase()]) return trimmed.toUpperCase();
  const byName = NAME_TO_CODE[trimmed.toLowerCase()];
  return byName ?? null;
}

export function getStateEntry(input?: string | null): StateEntry | null {
  const code = resolveStateCode(input);
  return code ? STATES[code] : null;
}

/**
 * Build the state-law context injected into the model prompt.
 * Every jurisdiction in the dataset (50 states + DC + territories) carries
 * statute-cited rights, so the model uses real citations instead of recalling them.
 */
export function buildStateContext(input?: string | null): string {
  const entry = getStateEntry(input);
  if (!entry) {
    return `STATE: ${input ?? "unknown"}. No state-specific data on file — use general, state-aware guidance and note the reader should verify with a local tenant resource.`;
  }
  const rights = (entry.rights ?? [])
    .map((r) => `- ${r.text}${r.citation ? ` (${r.citation})` : ""}`)
    .join("\n");
  return `STATE LAW FOR ${entry.name} — use these rules and cite these statutes EXACTLY; never invent a citation:\n${rights}`;
}
