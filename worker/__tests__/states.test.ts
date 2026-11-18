import { describe, expect, it } from "vitest";
import previews from "../data/state-previews.json";
import { buildStateContext, getStateEntry, resolveStateCode } from "../states";

type Right = { text: string; citation?: string };
const states = (previews as { states: Record<string, { name: string; rights?: Right[] }> }).states;

describe("resolveStateCode", () => {
  it("accepts a two-letter code in any case", () => {
    expect(resolveStateCode("CA")).toBe("CA");
    expect(resolveStateCode("ca")).toBe("CA");
    expect(resolveStateCode("  tx ")).toBe("TX");
  });

  it("accepts a full state name in any case", () => {
    expect(resolveStateCode("California")).toBe("CA");
    expect(resolveStateCode("new york")).toBe("NY");
  });

  it("returns null for unknown or empty input", () => {
    expect(resolveStateCode("Narnia")).toBeNull();
    expect(resolveStateCode("")).toBeNull();
    expect(resolveStateCode(null)).toBeNull();
    expect(resolveStateCode(undefined)).toBeNull();
  });
});

describe("buildStateContext", () => {
  it("injects every statute on file for a known state", () => {
    const context = buildStateContext("CA");
    const entry = getStateEntry("CA");
    expect(context).toContain("STATE LAW FOR California");
    for (const right of entry?.rights ?? []) {
      if (right.citation) expect(context).toContain(right.citation);
    }
  });

  it("tells the model there is no data instead of inventing a state", () => {
    const context = buildStateContext("Narnia");
    expect(context).toContain("No state-specific data on file");
    expect(context).not.toContain("§");
  });
});

describe("state-law dataset", () => {
  const entries = Object.entries(states);

  it("covers 50 states, DC and five territories", () => {
    expect(entries).toHaveLength(56);
  });

  it("uses a two-letter upper-case code and a name for every jurisdiction", () => {
    for (const [code, entry] of entries) {
      expect(code).toMatch(/^[A-Z]{2}$/);
      expect(entry.name.trim().length).toBeGreaterThan(0);
    }
  });

  it("gives every jurisdiction at least one right, and every right some text", () => {
    for (const [code, entry] of entries) {
      expect(entry.rights?.length ?? 0, code).toBeGreaterThan(0);
      for (const right of entry.rights ?? []) {
        expect(right.text.trim().length, code).toBeGreaterThan(0);
      }
    }
  });

  it("has no blank citations", () => {
    for (const [code, entry] of entries) {
      for (const right of entry.rights ?? []) {
        if (right.citation !== undefined) expect(right.citation.trim().length, code).toBeGreaterThan(0);
      }
    }
  });
});
