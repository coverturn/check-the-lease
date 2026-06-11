import { useState, useRef, useEffect, useCallback } from "react";
import { useChatContext } from "@/contexts/ChatContext";

type Role = "user" | "assistant";

type Message = {
  id: string;
  role: Role;
  content: string;
  streaming?: boolean;
};

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const DEFAULT_PROMPTS = [
  "What should I look for in a lease?",
  "What is a normal security deposit amount?",
  "What are my rights if my landlord doesn't make repairs?",
  "What is a warranty of habitability?",
];

const LEASE_PROMPTS = [
  "What's the biggest risk in my lease?",
  "Can you explain the security deposit issue?",
  "What questions should I ask my landlord?",
  "What protections are missing from my lease?",
];

function TypingDots() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 0" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "#5A8B7A",
            display: "inline-block",
            animation: "ctl-dot-bounce 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </span>
  );
}

function ChatBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 10,
        padding: "0 4px",
      }}
    >
      {!isUser && (
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            backgroundColor: "#F5C547",
            border: "2px solid #171717",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginRight: 8,
            marginTop: 2,
            fontSize: 12,
          }}
        >
          ⚖
        </div>
      )}
      <div
        style={{
          maxWidth: "78%",
          padding: "10px 14px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          backgroundColor: isUser ? "#1E3A5F" : "#FFFFFF",
          color: isUser ? "#FBF8F1" : "#171717",
          border: "1.5px solid",
          borderColor: isUser ? "#1E3A5F" : "rgba(23,23,23,0.12)",
          boxShadow: isUser ? "3px 3px 0 0 #171717" : "2px 2px 0 0 rgba(23,23,23,0.08)",
          fontFamily: "var(--app-font-sans)",
          fontSize: 14,
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {msg.streaming && msg.content === "" ? <TypingDots /> : msg.content}
        {msg.streaming && msg.content !== "" && (
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: "1em",
              backgroundColor: "#5A8B7A",
              marginLeft: 2,
              verticalAlign: "text-bottom",
              animation: "ctl-cursor-blink 0.8s step-end infinite",
            }}
          />
        )}
      </div>
    </div>
  );
}

export function ChatBot() {
  const { chatCtx } = useChatContext();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const hasLeaseCtx = !!(chatCtx?.analysisResult);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(scrollToBottom, 60);
      setTimeout(() => textareaRef.current?.focus(), 80);
    }
  }, [open, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setError(null);
      const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: trimmed };
      const assistantId = crypto.randomUUID();
      const assistantMsg: Message = { id: assistantId, role: "assistant", content: "", streaming: true };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInput("");
      setLoading(true);

      const historyForApi = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      abortRef.current = new AbortController();

      try {
        const res = await fetch(`${BASE}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: abortRef.current.signal,
          body: JSON.stringify({
            messages: historyForApi,
            context: chatCtx ?? undefined,
          }),
        });

        if (!res.ok || !res.body) {
          throw new Error(`Server error ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const raw = line.slice(6);
            try {
              const event = JSON.parse(raw) as { content?: string; done?: boolean; error?: string };
              if (event.error) {
                setError(event.error);
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: "Sorry, something went wrong. Please try again.", streaming: false }
                      : m,
                  ),
                );
                break;
              }
              if (event.content) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: m.content + event.content } : m,
                  ),
                );
              }
              if (event.done) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, streaming: false } : m,
                  ),
                );
              }
            } catch {
              /* ignore parse errors */
            }
          }
        }

        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, streaming: false } : m)),
        );
      } catch (err: unknown) {
        if ((err as Error)?.name === "AbortError") return;
        const msg = err instanceof Error ? err.message : "Connection error";
        setError(msg);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: "Something went wrong. Please try again.", streaming: false }
              : m,
          ),
        );
      } finally {
        setLoading(false);
      }
    },
    [loading, messages, chatCtx],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handlePrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const prompts = hasLeaseCtx ? LEASE_PROMPTS : DEFAULT_PROMPTS;
  const showPrompts = messages.length === 0 && !loading;

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  return (
    <>
      <style>{`
        @keyframes ctl-dot-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes ctl-cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes ctl-panel-slide-up {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .ctl-chat-scroll::-webkit-scrollbar { width: 4px; }
        .ctl-chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .ctl-chat-scroll::-webkit-scrollbar-thumb { background: rgba(23,23,23,0.15); border-radius: 2px; }
        .ctl-chat-textarea:focus { outline: none; }
        .ctl-prompt-btn:hover { background-color: rgba(90,139,122,0.08) !important; border-color: #5A8B7A !important; }
      `}</style>

      {/* ── Floating bubble ── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open lease assistant chat"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9998,
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundColor: "#F5C547",
            border: "2.5px solid #171717",
            boxShadow: "4px 4px 0 0 #171717",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.12s ease, box-shadow 0.12s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translate(-2px,-2px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "6px 6px 0 0 #171717";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translate(0,0)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "4px 4px 0 0 #171717";
          }}
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <path
              d="M13 3C7.477 3 3 7.03 3 12c0 2.16.8 4.14 2.13 5.68L3.5 21.5l4.2-1.44A10.4 10.4 0 0 0 13 21c5.523 0 10-4.03 10-9s-4.477-9-10-9Z"
              fill="#171717"
            />
            <circle cx="9" cy="12" r="1.4" fill="#F5C547" />
            <circle cx="13" cy="12" r="1.4" fill="#F5C547" />
            <circle cx="17" cy="12" r="1.4" fill="#F5C547" />
          </svg>
          {hasLeaseCtx && (
            <span
              style={{
                position: "absolute",
                top: -2,
                right: -2,
                width: 14,
                height: 14,
                borderRadius: "50%",
                backgroundColor: "#5A8B7A",
                border: "2px solid #FBF8F1",
              }}
            />
          )}
        </button>
      )}

      {/* ── Chat panel ── */}
      {open && (
        <div
          role="dialog"
          aria-label="Lease assistant chat"
          aria-modal="true"
          style={{
            position: "fixed",
            bottom: isMobile ? 0 : 28,
            right: isMobile ? 0 : 24,
            left: isMobile ? 0 : "auto",
            top: isMobile ? 0 : "auto",
            width: isMobile ? "100%" : 400,
            height: isMobile ? "100%" : 580,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#FBF8F1",
            border: "2.5px solid #171717",
            borderRadius: isMobile ? 0 : 20,
            boxShadow: "6px 6px 0 0 #171717",
            animation: "ctl-panel-slide-up 0.22s ease",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#171717",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "#F5C547",
                border: "2px solid rgba(251,248,241,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                flexShrink: 0,
              }}
            >
              ⚖
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--app-font-serif)",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#FBF8F1",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                Ask the Lease
              </div>
              {hasLeaseCtx && (
                <div
                  style={{
                    fontFamily: "var(--app-font-sans)",
                    fontSize: 11,
                    color: "#5A8B7A",
                    marginTop: 1,
                  }}
                >
                  Knows your lease · Legal info only
                </div>
              )}
              {!hasLeaseCtx && (
                <div
                  style={{
                    fontFamily: "var(--app-font-sans)",
                    fontSize: 11,
                    color: "rgba(251,248,241,0.45)",
                    marginTop: 1,
                  }}
                >
                  General housing Q&A · Legal info only
                </div>
              )}
            </div>
            <button
              onClick={() => {
                abortRef.current?.abort();
                setOpen(false);
              }}
              aria-label="Close chat"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(251,248,241,0.6)",
                fontSize: 22,
                lineHeight: 1,
                padding: "4px 6px",
                borderRadius: 6,
                transition: "color 0.15s",
                minHeight: 36,
                minWidth: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#FBF8F1";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "rgba(251,248,241,0.6)";
              }}
            >
              ×
            </button>
          </div>

          {/* Messages area */}
          <div
            className="ctl-chat-scroll"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 12px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Welcome message */}
            {messages.length === 0 && (
              <div
                style={{
                  marginBottom: 16,
                  padding: "12px 16px",
                  backgroundColor: "#FFFFFF",
                  border: "1.5px solid rgba(23,23,23,0.1)",
                  borderRadius: 14,
                  boxShadow: "2px 2px 0 0 rgba(23,23,23,0.06)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--app-font-serif)",
                    fontSize: 15,
                    fontWeight: 500,
                    color: "#171717",
                    marginBottom: 6,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {hasLeaseCtx
                    ? "I've read your lease. Ask me anything."
                    : "Hi! I can help you understand leases."}
                </div>
                <div
                  style={{
                    fontFamily: "var(--app-font-sans)",
                    fontSize: 13,
                    color: "rgba(23,23,23,0.55)",
                    lineHeight: 1.5,
                  }}
                >
                  {hasLeaseCtx
                    ? "Ask follow-up questions about the issues, terms, or what to do next."
                    : "I can explain clauses, tenant rights, and what's normal in a lease. I provide legal information, not legal advice."}
                </div>
              </div>
            )}

            {/* Suggested prompts */}
            {showPrompts && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 8 }}>
                {prompts.map((p) => (
                  <button
                    key={p}
                    className="ctl-prompt-btn"
                    onClick={() => handlePrompt(p)}
                    style={{
                      textAlign: "left",
                      background: "none",
                      backgroundColor: "rgba(23,23,23,0.03)",
                      border: "1.5px solid rgba(23,23,23,0.1)",
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontFamily: "var(--app-font-sans)",
                      fontSize: 13,
                      color: "#171717",
                      cursor: "pointer",
                      lineHeight: 1.45,
                      transition: "background-color 0.15s, border-color 0.15s",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Chat messages */}
            {messages.map((msg) => (
              <ChatBubble key={msg.id} msg={msg} />
            ))}

            {error && (
              <div
                style={{
                  padding: "8px 12px",
                  backgroundColor: "rgba(122,44,61,0.07)",
                  border: "1.5px solid rgba(122,44,61,0.2)",
                  borderRadius: 8,
                  fontFamily: "var(--app-font-sans)",
                  fontSize: 12,
                  color: "#7A2C3D",
                  marginTop: 4,
                }}
              >
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div
            style={{
              borderTop: "1.5px solid rgba(23,23,23,0.1)",
              padding: "12px 14px",
              flexShrink: 0,
              backgroundColor: "#FBF8F1",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-end",
                backgroundColor: "#FFFFFF",
                border: "2px solid rgba(23,23,23,0.15)",
                borderRadius: 14,
                padding: "8px 10px 8px 14px",
                transition: "border-color 0.15s",
              }}
              onFocusCapture={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "#5A8B7A";
              }}
              onBlurCapture={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(23,23,23,0.15)";
              }}
            >
              <textarea
                ref={textareaRef}
                className="ctl-chat-textarea"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your lease…"
                disabled={loading}
                rows={1}
                style={{
                  flex: 1,
                  border: "none",
                  background: "none",
                  resize: "none",
                  fontFamily: "var(--app-font-sans)",
                  fontSize: 14,
                  color: "#171717",
                  lineHeight: 1.5,
                  minHeight: 24,
                  maxHeight: 120,
                  overflowY: "auto",
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                aria-label="Send message"
                style={{
                  flexShrink: 0,
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor: !input.trim() || loading ? "rgba(23,23,23,0.1)" : "#5A8B7A",
                  border: "2px solid",
                  borderColor: !input.trim() || loading ? "rgba(23,23,23,0.1)" : "#171717",
                  cursor: !input.trim() || loading ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background-color 0.15s, border-color 0.15s",
                  boxShadow: !input.trim() || loading ? "none" : "2px 2px 0 0 #171717",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                  <path
                    d="M7.5 1.5v12M7.5 1.5L3 6M7.5 1.5L12 6"
                    stroke={!input.trim() || loading ? "rgba(23,23,23,0.3)" : "#FBF8F1"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div
              style={{
                fontFamily: "var(--app-font-sans)",
                fontSize: 10,
                color: "rgba(23,23,23,0.35)",
                textAlign: "center",
                marginTop: 8,
                letterSpacing: "0.01em",
              }}
            >
              Legal information only; not legal advice. Enter to send · Shift+Enter for new line.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
