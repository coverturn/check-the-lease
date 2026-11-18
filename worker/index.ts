import { Hono } from "hono";
import { extractText, getDocumentProxy } from "unpdf";
import { type Env, complete, streamChat } from "./llm";
import { IntakeSchema, ChatRequestSchema, AnalysisResultSchema } from "./schema";
import { buildAnalysisMessages, buildChatSystem } from "./prompts";
import { groundAnalysis } from "./citations";

const app = new Hono<{ Bindings: Env }>();

app.get("/api/health", (c) => c.json({ ok: true }));

// Vulnerability scanners probe every site for secrets files and other platforms'
// admin pages. Without this they fall through to the single-page-app fallback
// and get a 200 with the homepage, which invites more probing. Answer 404.
const PROBE_PATH = /^\/(\.env|\.git|\.aws|\.ssh|wp-admin|wp-login\.php|wp-content|wp-includes|xmlrpc\.php|phpmyadmin|vendor\/phpunit)|\.(php|asp|aspx|jsp|cgi)$/i;

export function isProbePath(path: string): boolean {
  return PROBE_PATH.test(path);
}

app.use("*", async (c, next) => {
  if (isProbePath(c.req.path)) return c.text("Not found", 404);
  await next();
});

/** The uploaded file could not be read. The message is safe to show to the user. */
class LeaseReadError extends Error {}

function looksLikePdf(bytes: Uint8Array): boolean {
  // "%PDF" magic number
  return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
}

function decodeText(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes).replace(/\s+/g, " ").trim();
}

async function extractLeaseText(bytes: Uint8Array): Promise<string> {
  // Real PDF: parse with unpdf.
  if (looksLikePdf(bytes)) {
    try {
      const pdf = await getDocumentProxy(bytes);
      const { text } = await extractText(pdf, { mergePages: true });
      const merged = (Array.isArray(text) ? text.join(" ") : text).replace(/\s+/g, " ").trim();
      if (merged.length > 50) return merged;
    } catch {
      // fall through to text decode
    }
  }
  // Plain-text lease (or non-PDF upload): decode directly.
  const decoded = decodeText(bytes);
  if (decoded.length > 50) return decoded;
  throw new LeaseReadError("Could not read this file. If it's a scanned PDF, run OCR first (e.g. ilovepdf.com), then re-upload.");
}

app.post("/api/analyze", async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body["lease"];
    if (!(file instanceof File)) {
      return c.json({ error: "No lease file uploaded." }, 400);
    }
    if (file.size > 25 * 1024 * 1024) {
      return c.json({ error: "File too large (max 25MB)." }, 400);
    }

    let intake;
    try {
      intake = IntakeSchema.parse(JSON.parse((body["intake"] as string) || "{}"));
    } catch {
      return c.json({ error: "Invalid intake parameters." }, 400);
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const leaseText = await extractLeaseText(bytes);
    if (leaseText.length < 100) {
      return c.json({ error: "Lease text too short — likely a scanned PDF without OCR, or a corrupt file." }, 400);
    }

    const { system, user } = buildAnalysisMessages(leaseText, intake);
    const raw = await complete(
      c.env,
      [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      { json: true, maxTokens: 4096 },
    );

    const cleaned = raw.replace(/^```json\s*/i, "").replace(/\s*```\s*$/, "").trim();
    const parsed = AnalysisResultSchema.parse(JSON.parse(cleaned));

    // Check the model's citations and quotes against the statute dataset and
    // the lease itself before anything is returned to the reader.
    const { analysis, report } = groundAnalysis(parsed, intake.state, leaseText);
    if (report.citationsRemoved || report.quotesRemoved) {
      console.warn("grounding: removed unverified model output", { state: intake.state, ...report });
    }

    return c.json({ ok: true, analysis, grounding: report, leaseText: leaseText.slice(0, 3000) });
  } catch (err) {
    // Reading errors are written for the user. Anything else (the model
    // provider failing, or returning something that is not the schema) is
    // logged in full and reported in plain words, so provider details never
    // reach the browser.
    if (err instanceof LeaseReadError) return c.json({ error: err.message }, 400);
    console.error("analyze failed", err);
    return c.json({ error: "The analysis could not be completed. Please try again in a moment." }, 500);
  }
});

app.post("/api/chat", async (c) => {
  let parsed;
  try {
    parsed = ChatRequestSchema.parse(await c.req.json());
  } catch {
    return c.json({ error: "Invalid chat request." }, 400);
  }

  const system = buildChatSystem(parsed.context);
  const messages = [
    { role: "system" as const, content: system },
    ...parsed.messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  try {
    const stream = await streamChat(c.env, messages);
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("chat failed", err);
    return c.json({ error: "The assistant is unavailable right now. Please try again in a moment." }, 500);
  }
});

// Everything else → static frontend assets (SPA fallback handled by the assets binding).
app.all("*", (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
