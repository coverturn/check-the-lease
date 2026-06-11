import statePreviews from "@/data/state-previews.json";

export type GuideRight = { text: string; citation?: string };
export type GuideProgram = { name: string; org?: string; who?: string; what?: string; category?: string };
export type StateGuide = {
  code: string;
  name: string;
  slug: string;
  rights: GuideRight[];
  programs: GuideProgram[];
};

export function slugify(name: string): string {
  return name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const raw = (statePreviews as { states: Record<string, { name: string; rights: GuideRight[]; programs: GuideProgram[] }> }).states;

export const STATE_GUIDES: StateGuide[] = Object.entries(raw)
  .map(([code, v]) => ({ code, name: v.name, slug: slugify(v.name), rights: v.rights ?? [], programs: v.programs ?? [] }))
  .sort((a, b) => a.name.localeCompare(b.name));

const BY_SLUG = new Map(STATE_GUIDES.map((s) => [s.slug, s]));
const BY_CODE = new Map(STATE_GUIDES.map((s) => [s.code.toLowerCase(), s]));

export function getGuide(slugOrCode: string): StateGuide | undefined {
  const key = slugOrCode.toLowerCase();
  return BY_SLUG.get(key) ?? BY_CODE.get(key);
}

// A few "nearby" states to cross-link for internal linking (simple regional buckets).
export function relatedGuides(code: string, n = 6): StateGuide[] {
  const idx = STATE_GUIDES.findIndex((s) => s.code === code);
  const out: StateGuide[] = [];
  for (let i = 1; out.length < n && i < STATE_GUIDES.length; i++) {
    const a = STATE_GUIDES[(idx + i) % STATE_GUIDES.length];
    if (a.code !== code) out.push(a);
  }
  return out;
}
