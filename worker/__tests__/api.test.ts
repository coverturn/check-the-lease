import { afterEach, describe, expect, it, vi } from "vitest";
import app, { isProbePath } from "../index";
import fixture from "./fixtures/california-analysis.json";

const env = {
  GROQ_API_KEY: "test-key",
  ASSETS: { fetch: async () => new Response("<!doctype html><title>app</title>", { status: 200 }) },
};

function modelReplies(analysis: unknown) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(analysis) } }] }), { status: 200 })),
  );
}

function analyseRequest(leaseText: string, intake: Record<string, unknown>) {
  const form = new FormData();
  form.set("lease", new File([leaseText], "lease.txt", { type: "text/plain" }));
  form.set("intake", JSON.stringify(intake));
  return new Request("http://localhost/api/analyze", { method: "POST", body: form });
}

const intake = { state: "CA", stage: "before", perspective: "renter" };

afterEach(() => vi.unstubAllGlobals());

describe("GET /api/health", () => {
  it("responds ok", async () => {
    const res = await app.request("/api/health", {}, env);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });
});

describe("scanner probe paths", () => {
  it("recognises secrets files and other platforms' admin pages", () => {
    for (const path of ["/.env", "/.env.production", "/.git/config", "/wp-login.php", "/wp-admin/setup.php", "/xmlrpc.php", "/index.php", "/admin/login.asp"]) {
      expect(isProbePath(path), path).toBe(true);
    }
  });

  it("leaves the app's own routes alone", () => {
    for (const path of ["/", "/upload", "/results/demo", "/how-it-works", "/api/health", "/api/analyze", "/assets/index-abc123.js", "/environment"]) {
      expect(isProbePath(path), path).toBe(false);
    }
  });

  it("answers probes with 404 instead of the homepage", async () => {
    const probe = await app.request("/.env", {}, env);
    expect(probe.status).toBe(404);
    const page = await app.request("/upload", {}, env);
    expect(page.status).toBe(200);
  });
});

describe("POST /api/analyze", () => {
  it("rejects a request with no file", async () => {
    const res = await app.request(new Request("http://localhost/api/analyze", { method: "POST", body: new FormData() }), {}, env);
    expect(res.status).toBe(400);
  });

  it("rejects invalid intake parameters before calling the model", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const res = await app.request(analyseRequest(fixture.leaseText, { state: "CA", stage: "someday", perspective: "renter" }), {}, env);
    expect(res.status).toBe(400);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("returns a real model response untouched when every citation and quote checks out", async () => {
    modelReplies(fixture.analysis);
    const res = await app.request(analyseRequest(fixture.leaseText, intake), {}, env);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; grounding: Record<string, number>; analysis: typeof fixture.analysis };
    expect(body.ok).toBe(true);
    expect(body.grounding.citationsRemoved).toBe(0);
    expect(body.grounding.quotesRemoved).toBe(0);
    expect(body.grounding.citationsKept).toBeGreaterThan(0);
    expect(body.grounding.quotesKept).toBeGreaterThan(0);
    expect(body.analysis.potential_issues).toHaveLength(fixture.analysis.potential_issues.length);
  });

  it("strips an invented statute and an invented quote from the response", async () => {
    const tampered = structuredClone(fixture.analysis) as typeof fixture.analysis;
    tampered.potential_issues[0].citation = "Cal. Civ. Code § 9999.99";
    tampered.potential_issues[1].original_quote = "Tenant agrees to forfeit the deposit on demand";
    modelReplies(tampered);
    const res = await app.request(analyseRequest(fixture.leaseText, intake), {}, env);
    const body = (await res.json()) as { grounding: Record<string, number>; analysis: { potential_issues: Array<Record<string, string>> } };
    expect(body.grounding.citationsRemoved).toBe(1);
    expect(body.grounding.quotesRemoved).toBe(1);
    expect(body.analysis.potential_issues[0].citation).toBeUndefined();
    expect(body.analysis.potential_issues[0].title).toBe(fixture.analysis.potential_issues[0].title);
    expect(body.analysis.potential_issues[1].original_quote).toBeUndefined();
  });

  it("returns a plain 500 when the model replies with something that is not the schema", async () => {
    modelReplies({ nonsense: true });
    const res = await app.request(analyseRequest(fixture.leaseText, intake), {}, env);
    expect(res.status).toBe(500);
    const body = (await res.json()) as { error: string };
    expect(body.error).not.toMatch(/zod|invalid_type|Required/i);
  });

  it("does not pass the model provider's error text on to the browser", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response('{"error":{"message":"Invalid API Key sk-secret"}}', { status: 401 })));
    const res = await app.request(analyseRequest(fixture.leaseText, intake), {}, env);
    expect(res.status).toBe(500);
    const body = (await res.json()) as { error: string };
    expect(body.error).not.toMatch(/api key|sk-secret|401|LLM/i);
  });

  it("tells the user plainly when the file cannot be read", async () => {
    const res = await app.request(analyseRequest("too short", intake), {}, env);
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toMatch(/could not read this file/i);
  });
});
