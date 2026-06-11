import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { SkipLink } from "@/components/SkipLink";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { StatePreviews } from "@/components/StatePreviews";
import { STATE_GUIDES } from "@/lib/guide-data";
import { IconChevronRight, IconMapPin, IconClock, IconShield, IconUpload, IconSearchSmall, IconDocumentSmall, IconWarning } from "@/components/icons/Icon";

const EASE = "cubic-bezier(0.16,1,0.3,1)";
const INK = "#171717";
const BONE = "var(--color-bone)";
const NAVY = "#1E3A5F";
const SAGE = "#5A8B7A";
const WINE = "#7A2C3D";
const SAND = "#C97A4A";

function useScrollReveal() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) { document.querySelectorAll(".ctl-reveal").forEach((el) => el.classList.add("is-visible")); return; }
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-visible"); }),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".ctl-reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ── The single hero action: pick state → start free scan ───────────────── */
function HeroAction() {
  const [, navigate] = useLocation();
  const [state, setState] = useState("");
  const [hover, setHover] = useState(false);
  const go = () => navigate(state ? `/upload?state=${state}` : "/upload");

  return (
    <div style={{ width: "100%", maxWidth: 440 }}>
      <div style={{ background: BONE, border: `2.5px solid ${INK}`, borderRadius: 18, padding: "clamp(18px,2.5vw,24px)", boxShadow: `6px 6px 0 0 ${INK}` }}>
        <label htmlFor="hero-state" style={{ display: "block", fontFamily: "var(--app-font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--color-ink-muted)", marginBottom: 8 }}>
          1 · Your state
        </label>
        <select
          id="hero-state"
          value={state}
          onChange={(e) => setState(e.target.value)}
          style={{ width: "100%", padding: "13px 15px", borderRadius: 11, border: "2px solid rgba(23,23,23,0.18)", backgroundColor: BONE, color: state ? "var(--color-ink)" : "var(--color-ink-muted)", fontFamily: "var(--app-font-sans)", fontSize: 15, appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B6B6B' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 15px center", paddingRight: 42, cursor: "pointer", outline: "none", minHeight: 50, marginBottom: 14 }}
        >
          <option value="">Choose your state or territory</option>
          {STATE_GUIDES.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}
        </select>
        <button
          onClick={go}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 16, color: "#FBF8F1", background: hover ? "#3D5F50" : SAGE, border: `2.5px solid ${INK}`, borderRadius: 999, padding: "15px 24px", cursor: "pointer", boxShadow: hover ? `2px 2px 0 0 ${INK}` : `5px 5px 0 0 ${INK}`, transform: hover ? "translate(2px,2px)" : "none", transition: "all 0.12s ease", minHeight: 54 }}
        >
          <IconUpload size={17} aria-hidden={true} /> Start free scan
        </button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", marginTop: 14 }}>
        {["Free scan", "No account", "Never stored"].map((t) => (
          <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--app-font-sans)", fontSize: 12.5, color: "var(--color-ink-muted)" }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden={true}><path d="M2 7.2L5.5 10.5L12 3" stroke={SAGE} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>{t}
          </span>
        ))}
        <Link href="/example" style={{ fontFamily: "var(--app-font-sans)", fontSize: 12.5, fontWeight: 600, color: SAGE, textDecoration: "underline", textUnderlineOffset: 2 }}>See example report</Link>
      </div>
    </div>
  );
}

const STEPS = [
  { icon: IconUpload, n: "01", title: "Pick your state & upload", body: "Choose your state, drop in the PDF. No account, never stored." },
  { icon: IconSearchSmall, n: "02", title: "We read every clause", body: "Checked against your state's actual tenant law in about 15 seconds." },
  { icon: IconDocumentSmall, n: "03", title: "See what it really says", body: "Plain-English flags, the law behind each one, and what to say." },
];

const PREVIEW = [
  { color: WINE, bg: "#FDF0F2", label: "High risk", items: ["Deposit over the legal cap", "Entry with no notice", "Waiving your right to repairs"] },
  { color: SAND, bg: "#FDF6F0", label: "Worth questioning", items: ["Vague or open-ended fees", "Long auto-renewal windows", "One-sided attorney-fee clauses"] },
  { color: SAGE, bg: "#F0F6F4", label: "Rights they can't override", items: ["Habitability guarantees", "Deposit return timelines", "Required disclosures"] },
];

export default function Home() {
  useScrollReveal();

  return (
    <div className="ctl-page" style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", backgroundColor: BONE, color: "var(--color-ink)" }}>
      <SkipLink />
      <Nav />

      <main id="main" style={{ flex: 1, width: "100%" }} role="main">

        {/* ═══ HERO — action first ═══ */}
        <section aria-labelledby="hero-heading" style={{ position: "relative", overflow: "hidden", backgroundImage: "radial-gradient(circle, rgba(23,23,23,0.045) 1.5px, transparent 1.5px)", backgroundSize: "26px 26px" }}>
          <div className="hero-grid" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr", alignItems: "center", gap: "clamp(32px,5vw,72px)", padding: "clamp(40px,6vw,96px) clamp(20px,4vw,48px)" }}>
            <style>{`@media (min-width: 880px){ .hero-grid { grid-template-columns: 1.05fr 0.95fr !important; } }`}</style>

            {/* Left: message + action */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(90,139,122,0.1)", border: "1.5px solid rgba(90,139,122,0.3)", borderRadius: 999, fontFamily: "var(--app-font-mono)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#3D5F50", marginBottom: 22, animation: `ctl-fade-up 0.6s 0.05s ${EASE} both` }}>
                Free scan · all 50 states
              </div>
              <h1 id="hero-heading" style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(40px,6.5vw,76px)", lineHeight: 0.98, letterSpacing: "-0.04em", color: "var(--color-ink)", margin: 0, animation: `ctl-fade-up 0.7s 0.1s ${EASE} both` }}>
                Know what your lease<br /><em style={{ fontStyle: "italic", color: NAVY }}>really says.</em>
              </h1>
              <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(15px,1.8vw,18px)", lineHeight: 1.55, marginTop: "clamp(18px,2.5vw,24px)", marginBottom: "clamp(24px,3.5vw,32px)", color: "var(--color-ink-muted)", maxWidth: 440, animation: `ctl-fade-up 0.7s 0.2s ${EASE} both` }}>
                Upload your lease and get a free scan that names the red flags in seconds — cited to your state's law. Full report $9.99, no subscription.
              </p>
              <div style={{ animation: `ctl-fade-up 0.7s 0.3s ${EASE} both` }}>
                <HeroAction />
              </div>
            </div>

            {/* Right: before → after proof (compact, not text-dense) */}
            <div className="hero-aside" style={{ animation: `ctl-fade-up 0.9s 0.3s ${EASE} both` }}>
              <div style={{ background: "#141414", borderRadius: 18, padding: "clamp(18px,2.4vw,26px)", border: `2px solid ${INK}`, boxShadow: `6px 6px 0 0 ${INK}`, marginBottom: 12 }}>
                <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(251,248,241,0.55)", marginBottom: 12 }}>From your lease</div>
                <p style={{ fontFamily: "var(--app-font-mono)", fontSize: "clamp(12px,1.4vw,14px)", color: "rgba(251,248,241,0.95)", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
                  "Tenant waives the right to notice of entry. Landlord may enter at any time for any purpose."
                </p>
              </div>
              <div aria-hidden={true} style={{ textAlign: "center", fontSize: 20, color: "rgba(122,44,61,0.5)", padding: "2px 0", lineHeight: 1 }}>↓</div>
              <div style={{ background: WINE, borderRadius: 18, padding: "clamp(18px,2.4vw,26px)", marginTop: 12, border: `2px solid ${INK}`, boxShadow: `8px 8px 0 0 ${INK}` }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 6, padding: "5px 12px", marginBottom: 14 }}>
                  <IconWarning size={14} aria-hidden={true} />
                  <span style={{ fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.13em", color: "rgba(255,255,255,0.95)" }}>High risk</span>
                </div>
                <h3 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(17px,2vw,21px)", color: "#FBF8F1", letterSpacing: "-0.02em", margin: "0 0 8px", lineHeight: 1.25 }}>
                  Your landlord can't enter without notice.
                </h3>
                <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(12px,1.4vw,14px)", color: "rgba(251,248,241,0.9)", lineHeight: 1.6, margin: 0 }}>
                  Most states require written notice before entry. This clause tries to waive that — and usually can't.
                </p>
              </div>
            </div>
          </div>

          {/* Trust strip */}
          <div style={{ borderTop: "1.5px solid rgba(23,23,23,0.08)", borderBottom: "1.5px solid rgba(23,23,23,0.08)", background: "rgba(23,23,23,0.015)" }}>
            <div style={{ maxWidth: 1120, margin: "0 auto", padding: "14px clamp(20px,4vw,48px)", display: "flex", flexWrap: "wrap", gap: "10px 28px", justifyContent: "center" }}>
              {[{ i: IconMapPin, t: "All 50 states + territories" }, { i: IconClock, t: "~15 seconds" }, { i: IconShield, t: "Never stored, no account" }, { i: IconDocumentSmall, t: "Cited to your state's law" }].map(({ i: Ic, t }) => (
                <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--app-font-sans)", fontSize: 13, color: "var(--color-ink-muted)" }}>
                  <Ic size={14} aria-hidden={true} /> {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ HOW IT WORKS — 3 steps ═══ */}
        <section data-reveal className="ctl-reveal" aria-labelledby="how-h" style={{ padding: "clamp(56px,8vw,96px) clamp(20px,4vw,48px)" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "clamp(36px,5vw,56px)" }}>
              <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: SAGE }}>How it works</span>
              <h2 id="how-h" style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(26px,4vw,42px)", letterSpacing: "-0.03em", color: "var(--color-ink)", margin: "10px 0 0" }}>
                Three steps. <em style={{ fontStyle: "italic", color: NAVY }}>Under a minute.</em>
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 16 }}>
              {STEPS.map((s) => {
                const Ic = s.icon;
                return (
                  <div key={s.n} style={{ background: BONE, border: `2px solid ${INK}`, borderRadius: 16, padding: "clamp(24px,3vw,32px)", boxShadow: `4px 4px 0 0 ${INK}` }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                      <Ic size={28} aria-hidden={true} />
                      <span style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: 36, color: "rgba(30,58,95,0.18)", lineHeight: 1 }}>{s.n}</span>
                    </div>
                    <h3 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(18px,2.2vw,22px)", letterSpacing: "-0.02em", color: "var(--color-ink)", margin: "0 0 8px" }}>{s.title}</h3>
                    <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "var(--color-ink-muted)", lineHeight: 1.6, margin: 0 }}>{s.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ WHAT WE CATCH — calm severity preview ═══ */}
        <section data-reveal className="ctl-reveal" aria-labelledby="catch-h" style={{ padding: "0 clamp(20px,4vw,48px) clamp(56px,8vw,96px)" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "clamp(36px,5vw,56px)" }}>
              <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: SAGE }}>What we catch</span>
              <h2 id="catch-h" style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(26px,4vw,42px)", letterSpacing: "-0.03em", color: "var(--color-ink)", margin: "10px 0 8px" }}>
                Know where you stand.
              </h2>
              <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(14px,1.6vw,16px)", color: "var(--color-ink-muted)", maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
                We split your lease into what won't hold up, what's worth pushing back on, and the rights your state gives you no matter what the lease says.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: 16 }}>
              {PREVIEW.map((c) => (
                <div key={c.label} style={{ background: c.bg, border: `2px solid ${INK}`, borderTop: `6px solid ${c.color}`, borderRadius: 16, padding: "24px 24px 26px", boxShadow: `4px 4px 0 0 ${INK}` }}>
                  <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: c.color, marginBottom: 16 }}>{c.label}</div>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 11 }}>
                    {c.items.map((it) => (
                      <li key={it} style={{ display: "flex", gap: 10, fontFamily: "var(--app-font-sans)", fontSize: 14, color: "var(--color-ink)", lineHeight: 1.45 }}>
                        <span aria-hidden={true} style={{ color: c.color, flexShrink: 0 }}>→</span>{it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PRICING TEASER ═══ */}
        <section data-reveal className="ctl-reveal" aria-labelledby="price-h" style={{ padding: "0 clamp(20px,4vw,48px) clamp(56px,8vw,96px)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <div style={{ background: NAVY, border: `2.5px solid ${INK}`, borderRadius: 22, padding: "clamp(28px,4vw,44px)", boxShadow: `8px 8px 0 0 ${INK}`, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: "clamp(20px,3vw,40px)", alignItems: "center" }}>
              <div>
                <h2 id="price-h" style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(24px,3.2vw,34px)", letterSpacing: "-0.03em", color: "#FBF8F1", margin: "0 0 10px", lineHeight: 1.1 }}>
                  Free to scan.<br /><em style={{ fontStyle: "italic", color: "rgba(251,248,241,0.55)" }}>$9.99 for the full report.</em>
                </h2>
                <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "rgba(251,248,241,0.65)", lineHeight: 1.6, margin: 0 }}>
                  A lawyer charges $200–500 to read a lease. See the red flags free, unlock every clause, the financial impact and negotiation scripts for less than lunch. No subscription.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Link href="/upload" style={{ display: "inline-flex", justifyContent: "center", alignItems: "center", gap: 8, fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 15, color: NAVY, backgroundColor: "#FBF8F1", border: "2.5px solid #FBF8F1", borderRadius: 999, padding: "15px 24px", textDecoration: "none" }}>
                  Start free scan →
                </Link>
                <Link href="/pricing" style={{ textAlign: "center", fontFamily: "var(--app-font-sans)", fontSize: 13.5, fontWeight: 600, color: "rgba(251,248,241,0.8)", textDecoration: "underline", textUnderlineOffset: 3 }}>
                  See full pricing
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ STATE COVERAGE (interactive) ═══ */}
        <StatePreviews />

        {/* ═══ FINAL CTA ═══ */}
        <section data-reveal className="ctl-reveal" aria-labelledby="cta-h" style={{ padding: "clamp(40px,6vw,80px) clamp(20px,4vw,48px) clamp(64px,9vw,110px)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", position: "relative" }}>
            <div aria-hidden={true} style={{ position: "absolute", left: "8%", top: -10, opacity: 0.12, pointerEvents: "none", color: SAGE }}><IconSearchSmall size={90} /></div>
            <h2 id="cta-h" style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(30px,5vw,52px)", letterSpacing: "-0.035em", lineHeight: 1.02, color: "var(--color-ink)", margin: "0 0 16px" }}>
              Know what you're signing. <em style={{ fontStyle: "italic", color: "var(--color-ink-muted)" }}>Before you agree.</em>
            </h2>
            <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(14px,1.7vw,17px)", color: "var(--color-ink-muted)", lineHeight: 1.6, margin: "0 auto 32px", maxWidth: 420 }}>
              Free scan, no account, never stored. Renters and landlords, all 50 states.
            </p>
            <Link href="/upload" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 16, color: "#FBF8F1", backgroundColor: SAGE, border: `2.5px solid ${INK}`, borderRadius: 999, padding: "16px 38px", textDecoration: "none", boxShadow: `5px 5px 0 0 ${INK}` }}>
              Start free scan <IconChevronRight size={16} aria-hidden={true} />
            </Link>
          </div>
        </section>

      </main>
      <Footer />

      {/* Mobile sticky CTA */}
      <div className="mobile-sticky-cta" role="complementary" aria-label="Quick access">
        <Link href="/upload" style={{ display: "inline-block", borderRadius: 999, padding: "13px 32px", fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 15, textDecoration: "none", backgroundColor: SAGE, color: "#FBF8F1", border: `2.5px solid ${INK}`, boxShadow: `4px 4px 0 0 ${INK}`, minHeight: 44, minWidth: 200, textAlign: "center" }}>
          Start free scan →
        </Link>
      </div>
    </div>
  );
}
