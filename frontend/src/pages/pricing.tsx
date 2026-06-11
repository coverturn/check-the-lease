import { Link } from "wouter";
import { SkipLink } from "@/components/SkipLink";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const INK = "#171717";
const BONE = "var(--color-bone)";
const NAVY = "#1E3A5F";
const SAGE = "#5A8B7A";

function Check({ color = SAGE }: { color?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 3 }}>
      <path d="M2 7.2L5.5 10.5L12 3" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const FREE_FEATURES = [
  "Lease health score (0–100)",
  "Up to 5 flagged clauses",
  "Key terms summary — rent, deposit, term, notice",
  "Your state's renter resources",
];

const PAID_FEATURES = [
  "Everything in the free scan",
  "Every flagged clause, no cap",
  "Severity score for every issue",
  "Missing protections analysis",
  "Financial impact estimate",
  "Negotiation email + clause-by-clause scripts",
  "Action plan + when to escalate",
  "PDF export + email to yourself",
];

const FAQ = [
  {
    q: "Is the scan really free?",
    a: "Yes. The lease health score, top red flags, key terms and your state's resources are free, with no account and no card. You only pay if you want the full report.",
  },
  {
    q: "What does the $9.99 get me?",
    a: "A complete clause-by-clause report: every flagged issue with a severity score, the protections your lease is missing, the financial impact, and negotiation scripts you can send your landlord today — plus a PDF you can keep.",
  },
  {
    q: "Is it a subscription?",
    a: "No. It's a one-time $9.99 payment per report. No recurring charge, nothing to cancel.",
  },
  {
    q: "Is my lease stored anywhere?",
    a: "Your lease is analyzed in seconds and never stored. Your report is held securely for 24 hours so you can open it after payment, then deleted. No account, no data kept.",
  },
];

export default function Pricing() {
  return (
    <div className="ctl-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: BONE, color: "var(--color-ink)" }}>
      <SkipLink />
      <Nav />

      <main id="main" style={{ flex: 1, width: "100%" }} role="main">

        {/* Hero */}
        <section style={{ background: NAVY, padding: "clamp(48px,7vw,88px) clamp(24px,4vw,48px) clamp(40px,6vw,64px)" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(251,248,241,0.5)", marginBottom: 18 }}>Pricing</div>
            <h1 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(34px,5.5vw,60px)", letterSpacing: "-0.035em", lineHeight: 1.02, color: "#FBF8F1", margin: "0 0 16px" }}>
              One lease. <em style={{ fontStyle: "italic", color: "rgba(251,248,241,0.5)" }}>One small price.</em>
            </h1>
            <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(15px,1.8vw,18px)", color: "rgba(251,248,241,0.65)", lineHeight: 1.6, maxWidth: 520, margin: "0 auto" }}>
              A lawyer to review a lease runs $200–500. Check the Lease gives you a free scan, and a full report for less than lunch — no subscription.
            </p>
          </div>
        </section>

        {/* Plans */}
        <section style={{ padding: "clamp(40px,6vw,72px) clamp(24px,4vw,48px)" }}>
          <div style={{ maxWidth: 880, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 20 }}>

            {/* Free */}
            <div style={{ background: BONE, border: `2.5px solid ${INK}`, borderRadius: 20, padding: "clamp(28px,3.5vw,40px)", boxShadow: `6px 6px 0 0 ${INK}`, display: "flex", flexDirection: "column" }}>
              <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: SAGE, marginBottom: 14 }}>Free Scan</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
                <span style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(44px,6vw,60px)", letterSpacing: "-0.04em", color: "var(--color-ink)", lineHeight: 1 }}>$0</span>
              </div>
              <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "var(--color-ink-muted)", margin: "0 0 24px", lineHeight: 1.5 }}>A quick read of the biggest risks. No account, no card.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 28, flex: 1 }}>
                {FREE_FEATURES.map((f) => (
                  <div key={f} style={{ display: "flex", gap: 10 }}><Check /><span style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "var(--color-ink)", lineHeight: 1.45 }}>{f}</span></div>
                ))}
              </div>
              <Link href="/upload" style={{ display: "inline-flex", justifyContent: "center", alignItems: "center", gap: 8, fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 15, color: "var(--color-ink)", backgroundColor: "transparent", border: `2.5px solid ${INK}`, borderRadius: 999, padding: "14px 24px", textDecoration: "none", boxShadow: `4px 4px 0 0 ${SAGE}` }}>
                Start free scan →
              </Link>
            </div>

            {/* Paid */}
            <div style={{ background: NAVY, border: `2.5px solid ${INK}`, borderRadius: 20, padding: "clamp(28px,3.5vw,40px)", boxShadow: `8px 8px 0 0 ${INK}`, display: "flex", flexDirection: "column", position: "relative" }}>
              <div style={{ position: "absolute", top: -14, right: 24, backgroundColor: "#C97A4A", color: "#FBF8F1", border: `2px solid ${INK}`, borderRadius: 999, padding: "4px 14px", fontFamily: "var(--app-font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Most popular</div>
              <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "rgba(251,248,241,0.65)", marginBottom: 14 }}>Full Report</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
                <span style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(44px,6vw,60px)", letterSpacing: "-0.04em", color: "#FBF8F1", lineHeight: 1 }}>$9.99</span>
                <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "rgba(251,248,241,0.6)" }}>one-time</span>
              </div>
              <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "rgba(251,248,241,0.7)", margin: "0 0 24px", lineHeight: 1.5 }}>The complete review before you sign — diagnosis and what to do about it.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 28, flex: 1 }}>
                {PAID_FEATURES.map((f) => (
                  <div key={f} style={{ display: "flex", gap: 10 }}><Check color="#9DBEB0" /><span style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "rgba(251,248,241,0.9)", lineHeight: 1.45 }}>{f}</span></div>
                ))}
              </div>
              <Link href="/upload" style={{ display: "inline-flex", justifyContent: "center", alignItems: "center", gap: 8, fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 15, color: NAVY, backgroundColor: "#FBF8F1", border: "2.5px solid #FBF8F1", borderRadius: 999, padding: "14px 24px", textDecoration: "none", boxShadow: "4px 4px 0 0 rgba(251,248,241,0.25)" }}>
                Scan, then unlock →
              </Link>
              <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 12, color: "rgba(251,248,241,0.55)", margin: "14px 0 0", textAlign: "center" }}>One-time payment · No subscription · 48-hr money-back if it fails technically</p>
            </div>
          </div>

          <p style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: "clamp(14px,1.6vw,17px)", color: "var(--color-ink-muted)", textAlign: "center", maxWidth: 560, margin: "clamp(32px,4vw,48px) auto 0" }}>
            See the full report before you pay — open the <Link href="/example" style={{ color: SAGE, fontStyle: "normal", fontWeight: 600 }}>example report</Link>.
          </p>
        </section>

        {/* FAQ */}
        <section style={{ padding: "0 clamp(24px,4vw,48px) clamp(56px,7vw,88px)" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(24px,3.5vw,34px)", letterSpacing: "-0.025em", color: "var(--color-ink)", margin: "0 0 clamp(24px,3vw,36px)", textAlign: "center" }}>
              Questions, answered.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {FAQ.map(({ q, a }) => (
                <div key={q} style={{ background: BONE, border: `2px solid ${INK}`, borderRadius: 14, padding: "20px 24px", boxShadow: `4px 4px 0 0 ${INK}` }}>
                  <h3 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(16px,2vw,19px)", color: "var(--color-ink)", margin: "0 0 8px", letterSpacing: "-0.01em" }}>{q}</h3>
                  <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "var(--color-ink-muted)", lineHeight: 1.6, margin: 0 }}>{a}</p>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 12, color: "var(--color-ink-muted)", textAlign: "center", marginTop: 28, fontStyle: "italic" }}>
              Check the Lease provides legal information only, not legal advice. We are not a law firm.
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
