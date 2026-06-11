// Provider-agnostic LLM layer. Default: Groq (Llama 3.3 70B), OpenAI-compatible.
// Swap providers by changing the endpoint/model below — Anthropic fallback can drop in here.

export interface Env {
  ASSETS: Fetcher;
  GROQ_API_KEY: string;
  ANTHROPIC_API_KEY?: string;
  LLM_PROVIDER?: string;
}

type Msg = { role: "system" | "user" | "assistant"; content: string };

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

/** Non-streaming completion that returns raw text (used for JSON analysis). */
export async function complete(
  env: Env,
  messages: Msg[],
  opts: { json?: boolean; maxTokens?: number } = {},
): Promise<string> {
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0,
      max_tokens: opts.maxTokens ?? 4096,
      ...(opts.json ? { response_format: { type: "json_object" } } : {}),
      messages,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`LLM error ${res.status}: ${text.slice(0, 300)}`);
  }
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty LLM response");
  return content;
}

/**
 * Streaming chat. Returns a ReadableStream formatted as the frontend's SSE protocol:
 * `data: {\"content\": \"...\"}` deltas, then `data: {\"done\": true}`.
 */
export async function streamChat(env: Env, messages: Msg[]): Promise<ReadableStream<Uint8Array>> {
  const upstream = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.3,
      max_tokens: 2048,
      stream: true,
      messages,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    throw new Error(`LLM stream error ${upstream.status}: ${text.slice(0, 300)}`);
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const upstreamBody = upstream.body;

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstreamBody.getReader();
      let buffer = "";
      const send = (obj: unknown) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let nl: number;
          while ((nl = buffer.indexOf("\n")) >= 0) {
            const line = buffer.slice(0, nl).trim();
            buffer = buffer.slice(nl + 1);
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (payload === "[DONE]") continue;
            try {
              const json = JSON.parse(payload) as { choices?: Array<{ delta?: { content?: string } }> };
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) send({ content: delta });
            } catch {
              // ignore keepalive / partial frames
            }
          }
        }
        send({ done: true });
      } catch (e) {
        send({ error: e instanceof Error ? e.message : "stream error" });
      } finally {
        controller.close();
        reader.releaseLock();
      }
    },
  });
}
