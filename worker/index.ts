import { Hono } from "hono";
import { extractText, getDocumentProxy } from "unpdf";
import { type Env, complete, streamChat } from "./llm";
import { IntakeSchema, ChatRequestSchema, AnalysisResultSchema } from "./schema";
import { buildAnalysisMessages, buildChatSystem } from "./prompts";

const app = new Hono<{ Bindings: Env }>();

app.get("/api/health", (c) => c.json({ ok: true }));

async function extractPdfText(bytes: Uint8Array): Promise<string> {
  try {
    const pdf = await getDocumentProxy(bytes);
    const { text } = await extractText(pdf, { mergePages: true });
    const merged = (Array.isArray(text) ? text.join(" ") : text).replace(/\s+/g, " ").trim();
    if (merged.length > 100) return merged;
  } catch {
    // fall through to plain-text decode
  }
  const fallback = new TextDecoder().decode(bytes).replace(/\s+/g, " ").trim();
  if (fallback.length > 100) return fallback;
  throw new Error("Could not extract text from file. For scanned PDFs, run OCR first (e.g. ilovepdf.com), then re-upload.");
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
    const leaseText = await extractPdfText(bytes);
    if (leaseText.length < 200) {
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
    const analysis = AnalysisResultSchema.parse(JSON.parse(cleaned));

    return c.json({ ok: true, analysis, leaseText: leaseText.slice(0, 3000) });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Analysis failed.";
    return c.json({ error: msg }, 500);
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
    const msg = err instanceof Error ? err.message : "Chat error.";
    return c.json({ error: msg }, 500);
  }
});

// Everything else → static frontend assets (SPA fallback handled by the assets binding).
app.all("*", (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
