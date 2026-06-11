import { useState } from "react";
import { Link } from "wouter";
import { SkipLink } from "@/components/SkipLink";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const INK = "#171717";
const BONE = "var(--color-bone)";
const NAVY = "#1E3A5F";

const INCLUDED = [
  "Every flagged clause, no cap",
  "Severity score for every issue",
  "Missing protections analysis",
  "Financial impact estimate",
  "Negotiation email + clause-by-clause scripts",
  "PDF export + email to yourself",
];

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = (() => { try { return sessionStorage.getItem("ctl-token") || ""; } catch { return ""; } })();
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) throw new Error("not-ready");
      const data = (await res.json()) as { url?: string };
      if (data.url) { window.location.href = data.url; return; }
      throw new Error("no-url");
    } catch {
      setError("Card payment is being connected. Check back shortly — your free scan is still available.");
      setLoading(false);
    }
  };

  return (
    <div className="ctl-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: BONE, color: "var(--color-ink)" }}>
      <SkipLink />
      <Nav />

      <main id="main" style={{ flex: 1, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(40px,6vw,80px) clamp(20px,4vw,40px)" }} role="main">
        <div style={{ width: "100%", maxWidth: 460 }}>
          <div style={{ background: BONE, border: `2.5px solid ${INK}`, borderRadius: 20, overflow: "hidden", boxShadow: `8px 8px 0 0 ${INK}` }}>
            <div style={{ background: NAVY, padding: "clamp(24px,3.5vw,32px)" }}>
              <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "rgba(251,248,241,0.6)", marginBottom: 14 }}>Unlock your full report</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(40px,7vw,56px)", letterSpacing: "-0.04em", color: "#FBF8F1", lineHeight: 1 }}>$9.99</span>
                <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "rgba(251,248,241,0.6)" }}>one-time</span>
              </div>
            </div>

            <div style={{ padding: "clamp(24px,3.5vw,32px)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 24 }}>
                {INCLUDED.map((f) => (
                  <div key={f} style={{ display: "flex", gap: 10 }}>
                    <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 3 }}><path d="M2 7.2L5.5 10.5L12 3" stroke="#5A8B7A" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "var(--color-ink)", lineHeight: 1.45 }}>{f}</span>
                  </div>
                ))}
              </div>

              <button onClick={startCheckout} disabled={loading} style={{ width: "100%", display: "inline-flex", justifyContent: "center", alignItems: "center", gap: 10, fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 16, color: "#FBF8F1", backgroundColor: NAVY, border: `2.5px solid ${INK}`, borderRadius: 999, padding: "16px 24px", cursor: loading ? "default" : "pointer", boxShadow: `5px 5px 0 0 ${INK}`, opacity: loading ? 0.7 : 1 }}>
                {loading ? "Connecting…" : "Pay $9.99 →"}
              </button>

              {error && (
                <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "#7A2C3D", lineHeight: 1.5, margin: "14px 0 0", textAlign: "center" }}>{error}</p>
              )}

              <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 12, color: "var(--color-ink-muted)", lineHeight: 1.55, margin: "16px 0 0", textAlign: "center" }}>
                One-time payment · No subscription · Your lease is never stored · 48-hr money-back if it fails technically
              </p>
            </div>
          </div>

          <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "var(--color-ink-muted)", textAlign: "center", marginTop: 20 }}>
            <Link href="/example" style={{ color: "#5A8B7A", fontWeight: 600 }}>See an example report</Link> before you pay.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
