import { useState, useEffect } from "react";
import { track } from "@/lib/track";
import { Link } from "wouter";
import { SkipLink } from "@/components/SkipLink";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const INK = "#171717";
const BONE = "var(--color-bone)";
const NAVY = "#1E3A5F";
const SAGE = "#5A8B7A";

const INCLUDED = [
  "Every flagged clause, no cap",
  "Severity score for every issue",
  "Missing protections analysis",
  "Financial impact estimate",
  "Negotiation email + clause-by-clause scripts",
  "PDF export + email to yourself",
];

export default function Checkout() {
  const [status, setStatus] = useState<"idle" | "processing">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { track("checkout_view"); }, []);

  const pay = async () => {
    setError(null);
    setStatus("processing");
    track("checkout_started");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnPath: "/results" }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Could not start checkout.");
      window.location.href = data.url as string;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <div className="ctl-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: BONE, color: "var(--color-ink)" }}>
      <SkipLink />
      <Nav />
      <main id="main" style={{ flex: 1, width: "100%", padding: "clamp(32px,5vw,64px) clamp(20px,4vw,40px)" }} role="main">
        <div style={{ maxWidth: 540, margin: "0 auto" }}>
          <div style={{ background: NAVY, border: `2.5px solid ${INK}`, borderRadius: 22, padding: "clamp(28px,4vw,40px)", boxShadow: `8px 8px 0 0 ${INK}`, position: "relative", overflow: "hidden" }}>
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(251,248,241,0.06) 1.5px, transparent 1.5px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "rgba(251,248,241,0.6)", marginBottom: 12 }}>Your full lease report</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 9, marginBottom: 22, paddingBottom: 22, borderBottom: "1.5px solid rgba(251,248,241,0.15)" }}>
                <span style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(44px,7vw,56px)", letterSpacing: "-0.04em", color: "#FBF8F1", lineHeight: 1 }}>Free</span>
                <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "rgba(251,248,241,0.6)" }}>no account, no card</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 26 }}>
                {INCLUDED.map((f) => (
                  <div key={f} style={{ display: "flex", gap: 10 }}>
                    <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 3 }}><path d="M2 7.2L5.5 10.5L12 3" stroke="#9DBEB0" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "rgba(251,248,241,0.92)", lineHeight: 1.45 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={pay} disabled={status !== "idle"} style={{ width: "100%", display: "inline-flex", justifyContent: "center", alignItems: "center", gap: 10, fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 16, color: NAVY, backgroundColor: "#FBF8F1", border: `2.5px solid ${INK}`, borderRadius: 999, padding: "16px 24px", cursor: status === "idle" ? "pointer" : "default", boxShadow: "5px 5px 0 0 rgba(0,0,0,0.35)", opacity: status === "processing" ? 0.85 : 1 }}>
                {status === "processing" ? (<><span className="ctl-spin" style={{ width: 16, height: 16, border: "2.5px solid rgba(30,58,95,0.3)", borderTopColor: NAVY, borderRadius: "50%", display: "inline-block" }} /> Redirecting…</>) : "Continue →"}
              </button>
              {error && <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "#F5C547", margin: "12px 0 0", textAlign: "center" }}>{error}</p>}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 16 }}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3.5 6V4.2a3.5 3.5 0 117 0V6M2.5 6h9v6h-9z" stroke="rgba(251,248,241,0.6)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 11.5, color: "rgba(251,248,241,0.6)" }}>Secure checkout by Stripe · your card is entered on Stripe, never here</span>
              </div>
              <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 12, color: "rgba(251,248,241,0.5)", lineHeight: 1.55, margin: "18px 0 0", textAlign: "center" }}>
                48-hour money-back guarantee if the report fails technically. Your lease is never stored.
              </p>
            </div>
          </div>
          <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, margin: "20px 0 0", textAlign: "center" }}>
            <Link href="/example" style={{ color: SAGE, fontWeight: 600 }}>See an example report →</Link>
          </p>
        </div>
      </main>
      <Footer />
      <style>{`@keyframes ctl-spin-kf { to { transform: rotate(360deg); } } .ctl-spin { animation: ctl-spin-kf 0.7s linear infinite; }`}</style>
    </div>
  );
}
