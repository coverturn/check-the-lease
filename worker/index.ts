import { Hono } from "hono";
import { extractText, getDocumentProxy } from "unpdf";
import { type Env, complete, streamChat } from "./llm";
import { IntakeSchema, ChatRequestSchema, AnalysisResultSchema } from "./schema";
import { buildAnalysisMessages, buildChatSystem } from "./prompts";

const app = new Hono<{ Bindings: Env }>();

app.get("/api/health", (c) => c.json({ ok: true }));

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
  throw new Error("Could not read this file. If it's a scanned PDF, run OCR first (e.g. ilovepdf.com), then re-upload.");
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

// ── Stripe: create a Checkout Session for the $9.99 one-time full report ──
app.post("/api/checkout", async (c) => {
  const key = c.env.STRIPE_SECRET_KEY;
  if (!key) return c.json({ error: "Payments aren't set up yet. Please try again shortly." }, 503);
  const origin = new URL(c.req.url).origin;
  let returnPath = "/results";
  try {
    const b = await c.req.json();
    if (b && typeof b.returnPath === "string" && b.returnPath.startsWith("/")) returnPath = b.returnPath;
  } catch { /* no body is fine */ }
  const sep = returnPath.includes("?") ? "&" : "?";
  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("line_items[0][price_data][currency]", "usd");
  params.set("line_items[0][price_data][product_data][name]", "Check the Lease — Full lease report");
  params.set("line_items[0][price_data][unit_amount]", "999");
  params.set("line_items[0][quantity]", "1");
  params.set("success_url", `${origin}${returnPath}${sep}paid=1&session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", `${origin}${returnPath}`);
  try {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const data = await res.json() as { url?: string; error?: { message?: string } };
    if (!res.ok || !data.url) return c.json({ error: data?.error?.message || "Could not start checkout." }, 502);
    return c.json({ url: data.url });
  } catch {
    return c.json({ error: "Could not reach the payment processor." }, 502);
  }
});

// ── Stripe: verify a Checkout Session was actually paid (server-authoritative) ──
app.get("/api/verify", async (c) => {
  const key = c.env.STRIPE_SECRET_KEY;
  if (!key) return c.json({ paid: false }, 503);
  const id = c.req.query("session_id");
  if (!id) return c.json({ paid: false }, 400);
  try {
    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    const data = await res.json() as { payment_status?: string };
    if (!res.ok) return c.json({ paid: false }, 502);
    return c.json({ paid: data.payment_status === "paid" });
  } catch {
    return c.json({ paid: false }, 502);
  }
});

// Everything else → static frontend assets (SPA fallback handled by the assets binding).
app.all("*", (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
