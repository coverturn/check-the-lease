import { useState } from "react";
import { Link, useLocation } from "wouter";
import { SkipLink } from "@/components/SkipLink";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const INK = "#171717";
const BONE = "var(--color-bone)";
const NAVY = "#1E3A5F";
const SAGE = "#5A8B7A";

// ── TEST MODE ────────────────────────────────────────────────────────────────
// This is a mock checkout for UX testing. It does NOT take payment.
// When real Stripe is wired, replace `mockPay()` with a call that creates a
// Stripe Checkout session and redirects to it; the success URL returns to
// /results?paid=1 exactly as this mock does.
const TEST_MODE = true;

const INCLUDED = [
  "Every flagged clause, no cap",
  "Severity score for every issue",
  "Missing protections analysis",
  "Financial impact estimate",
  "Negotiation email + clause-by-clause scripts",
  "PDF export + email to yourself",
];

function formatCardNumber(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function Checkout() {
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const valid = name.trim().length > 1 && card.replace(/\s/g, "").length >= 15 && exp.length === 5 && cvc.length >= 3;

  const pay = async () => {
    setError(null);
    if (!valid) { setError("Please complete your card details to continue."); return; }
    setStatus("processing");

    // ── Mock payment. Replace with Stripe Checkout redirect when wiring real payments.
    await new Promise((r) => setTimeout(r, 1600));
    try {
      sessionStorage.setItem("ctl-paid", "1");
      if (email.trim()) sessionStorage.setItem("ctl-email", email.trim());
    } catch { /* noop */ }
    setStatus("done");
    await new Promise((r) => setTimeout(r, 500));
    navigate("/results?paid=1");
  };

  const field: React.CSSProperties = {
    width: "100%", fontFamily: "var(--app-font-sans)", fontSize: 15, color: "var(--color-ink)",
    background: BONE, border: "2px solid rgba(23,23,23,0.18)", borderRadius: 10, padding: "13px 14px", outline: "none",
  };
  const label: React.CSSProperties = {
    display: "block", fontFamily: "var(--app-font-sans)", fontSize: 12, fontWeight: 600, color: "var(--color-ink-muted)", margin: "0 0 6px", letterSpacing: "0.01em",
  };

  return (
    <div className="ctl-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: BONE, color: "var(--color-ink)" }}>
      <SkipLink />
      <Nav />

      <main id="main" style={{ flex: 1, width: "100%", padding: "clamp(32px,5vw,64px) clamp(20px,4vw,40px)" }} role="main">
        <div style={{ maxWidth: 880, margin: "0 auto" }}>

          {TEST_MODE && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FDF6F0", border: "1.5px solid #C97A4A", borderRadius: 999, padding: "6px 14px", fontFamily: "var(--app-font-mono)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9A5A2E" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#C97A4A" }} />
                Test mode — no real payment
              </span>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, alignItems: "start" }}>

            {/* ── Card form ── */}
            <div style={{ background: BONE, border: `2.5px solid ${INK}`, borderRadius: 20, padding: "clamp(24px,3.5vw,36px)", boxShadow: `6px 6px 0 0 ${INK}`, order: 1 }}>
              <h1 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(22px,3vw,28px)", letterSpacing: "-0.02em", color: "var(--color-ink)", margin: "0 0 4px" }}>Pay with card</h1>
              <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "var(--color-ink-muted)", margin: "0 0 22px" }}>Secure one-time payment. No subscription.</p>

              <div style={{ marginBottom: 16 }}>
                <label style={label} htmlFor="ck-email">Email (for your receipt)</label>
                <input id="ck-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" style={field} autoComplete="email" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={label} htmlFor="ck-name">Name on card</label>
                <input id="ck-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jordan Rivera" style={field} autoComplete="cc-name" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={label} htmlFor="ck-card">Card number</label>
                <input id="ck-card" value={card} onChange={(e) => setCard(formatCardNumber(e.target.value))} placeholder="4242 4242 4242 4242" inputMode="numeric" style={field} autoComplete="cc-number" />
              </div>
              <div style={{ display: "flex", gap: 12, marginBottom: 22 }}>
                <div style={{ flex: 1 }}>
                  <label style={label} htmlFor="ck-exp">Expiry</label>
                  <input id="ck-exp" value={exp} onChange={(e) => setExp(formatExpiry(e.target.value))} placeholder="MM/YY" inputMode="numeric" style={field} autoComplete="cc-exp" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={label} htmlFor="ck-cvc">CVC</label>
                  <input id="ck-cvc" value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="123" inputMode="numeric" style={field} autoComplete="cc-csc" />
                </div>
              </div>

              <button onClick={pay} disabled={status !== "idle"} style={{ width: "100%", display: "inline-flex", justifyContent: "center", alignItems: "center", gap: 10, fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 16, color: "#FBF8F1", backgroundColor: status === "done" ? SAGE : NAVY, border: `2.5px solid ${INK}`, borderRadius: 999, padding: "16px 24px", cursor: status === "idle" ? "pointer" : "default", boxShadow: `5px 5px 0 0 ${INK}`, opacity: status === "processing" ? 0.85 : 1, transition: "background-color 0.2s" }}>
                {status === "processing" && (<><span className="ctl-spin" style={{ width: 16, height: 16, border: "2.5px solid rgba(251,248,241,0.4)", borderTopColor: "#FBF8F1", borderRadius: "50%", display: "inline-block" }} /> Processing…</>)}
                {status === "idle" && "Pay $9.99"}
                {status === "done" && "Unlocked ✓"}
              </button>

              {error && <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "#7A2C3D", margin: "12px 0 0", textAlign: "center" }}>{error}</p>}

              {TEST_MODE && (
                <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 11.5, color: "var(--color-ink-muted)", margin: "14px 0 0", textAlign: "center", lineHeight: 1.5 }}>
                  Test mode: enter any details (e.g. 4242 4242 4242 4242, any future expiry, any CVC). No card is charged.
                </p>
              )}

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 16 }}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3.5 6V4.2a3.5 3.5 0 117 0V6M2.5 6h9v6h-9z" stroke="var(--color-ink-muted)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 11.5, color: "var(--color-ink-muted)" }}>Encrypted payment · Your lease is never stored</span>
              </div>
            </div>

            {/* ── Order summary ── */}
            <div style={{ background: NAVY, border: `2.5px solid ${INK}`, borderRadius: 20, padding: "clamp(24px,3.5vw,36px)", boxShadow: `8px 8px 0 0 ${INK}`, order: 2 }}>
              <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "rgba(251,248,241,0.6)", marginBottom: 14 }}>Your full lease report</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 22, paddingBottom: 22, borderBottom: "1.5px solid rgba(251,248,241,0.15)" }}>
                <span style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(40px,7vw,52px)", letterSpacing: "-0.04em", color: "#FBF8F1", lineHeight: 1 }}>$9.99</span>
                <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "rgba(251,248,241,0.6)" }}>one-time</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 22 }}>
                {INCLUDED.map((f) => (
                  <div key={f} style={{ display: "flex", gap: 10 }}>
                    <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 3 }}><path d="M2 7.2L5.5 10.5L12 3" stroke="#9DBEB0" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "rgba(251,248,241,0.9)", lineHeight: 1.45 }}>{f}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 12, color: "rgba(251,248,241,0.55)", lineHeight: 1.55, margin: 0 }}>
                One-time payment · No subscription · 48-hour money-back guarantee if the report fails technically.
              </p>
              <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, margin: "18px 0 0" }}>
                <Link href="/example" style={{ color: "#9DBEB0", fontWeight: 600 }}>See an example report →</Link>
              </p>
            </div>

          </div>
        </div>
      </main>
      <Footer />

      <style>{`@keyframes ctl-spin-kf { to { transform: rotate(360deg); } } .ctl-spin { animation: ctl-spin-kf 0.7s linear infinite; }`}</style>
    </div>
  );
}
