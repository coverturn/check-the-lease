import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { STATE_GUIDES } from "@/lib/guide-data";
import { SkipLink } from "@/components/SkipLink";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { StatePreviews } from "@/components/StatePreviews";
import { IconBox, IconChevronRight, IconDocumentSmall, IconFlag, IconHouseSmall, IconKey, IconMapPin, IconPlus, IconSearchSmall, IconSparkle, IconUpload, IconUser } from "@/components/icons/Icon";
import PhotoMovingSteps from "@assets/DTS_Chicago_to_LA_Alex_Tan_Photos_ID2720_1777779569750.jpg";
import PhotoMomBaby from "@assets/DTS_AWAY_Daniel_Faro_ID7514.jpg";

function useScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".ctl-reveal"));
    const reveal = (el: Element) => el.classList.add("is-visible");
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) { els.forEach(reveal); return; }
    // Fire as soon as any part enters (threshold 0), with a generous margin so
    // sections reveal slightly before they're scrolled into view. Reveal once.
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { reveal(e.target); obs.unobserve(e.target); }
      }),
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => obs.observe(el));
    // Safety net: never leave content hidden (e.g. anchor jumps, off-screen
    // sections that the observer never re-checks, or any missed intersection).
    const safety = window.setTimeout(() => els.forEach(reveal), 1200);
    return () => { obs.disconnect(); window.clearTimeout(safety); };
  }, []);
}

const EASE = "cubic-bezier(0.16,1,0.3,1)";

type Step = { n: string; title: string; body: string; bg: string; ticks?: string[] };
const STEPS: Step[] = [
  { n: "01", title: "Upload your lease", body: "Drop the PDF. Any length, any state, any template.", bg: "#1E3A5F" },
  { n: "02", title: "Pick your state", body: "We check it against your state's actual tenant protection rules.", bg: "#C97A4A" },
  { n: "03", title: "Read what it actually says", body: "Plain English, in 15 seconds:", bg: "#5A8B7A", ticks: ["Key terms, pulled out and explained", "Risk flags, rated by severity", "Every flag cited to the actual law", "Questions to raise before signing"] },
];

/* Numbered section eyebrow - sage, uppercase, magazine chapter style */
function SectionEyebrow({ num, label }: { num: string; label: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <span style={{
        fontFamily: "var(--app-font-sans)",
        fontSize: 11,
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "var(--color-sage)",
      }}>
        {num}. {label}
      </span>
    </div>
  );
}

export default function Home() {
  useScrollReveal();
  const [, navigate] = useLocation();

  const [ctaHover, setCtaHover] = useState(false);
  const [sampleHover, setSampleHover] = useState(false);
  const [mobileCTAHover, setMobileCTAHover] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [heroState, setHeroState] = useState("");

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="ctl-page"
      style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", backgroundColor: "var(--color-bone)", color: "var(--color-ink)" }}
    >
      <SkipLink />
      <Nav />

      {/* Scroll progress */}
      <div aria-hidden={true} style={{ position: "fixed", top: 62, left: 0, right: 0, height: 2, zIndex: 100, background: "rgba(23,23,23,0.05)" }}>
        <div style={{ height: "100%", width: `${scrollPct}%`, background: "#1E3A5F", transition: "width 0.1s linear" }} />
      </div>

      <main id="main" style={{ flex: 1, width: "100%" }} role="main">

        {/* ═══════════════ HERO ═══════════════ */}
        <section
          id="hero-section"
          aria-labelledby="hero-heading"
          style={{
            position: "relative",
            overflow: "hidden",
            backgroundImage: "radial-gradient(circle, rgba(23,23,23,0.048) 1.5px, transparent 1.5px)",
            backgroundSize: "26px 26px",
          }}
        >
          {/* ── Hero video background ── */}
          <video
            autoPlay
            muted
            loop
            playsInline
            aria-hidden={true}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, opacity: 0.18, mixBlendMode: "multiply" }}
          >
            <source src={`${import.meta.env.BASE_URL}hero-video.mp4`} type="video/mp4" />
          </video>

          {/* ── Floating illustrations (hidden on mobile via .ctl-float-decor) ── */}
          <div aria-hidden={true} className="ctl-float-decor" style={{ position: "absolute", left: "-18px", top: "18%", opacity: 0.55, pointerEvents: "none", animation: "ctl-illus-float-a 8.5s ease-in-out infinite", zIndex: 0, color: "#5A8B7A" }}><IconKey size={120} /></div>
          <div aria-hidden={true} className="ctl-float-decor" style={{ position: "absolute", left: "-28px", bottom: "10%", opacity: 0.45, pointerEvents: "none", animation: "ctl-illus-float-b 11s ease-in-out infinite 1.8s", zIndex: 0, color: "#C97A4A" }}><IconHouseSmall size={155} /></div>
          <div aria-hidden={true} className="ctl-float-decor" style={{ position: "absolute", right: "-12px", top: "12%", opacity: 0.40, pointerEvents: "none", animation: "ctl-illus-float-c 9.5s ease-in-out infinite 3.2s", zIndex: 0, color: "#F4A480" }}><IconBox size={88} /></div>
          <div aria-hidden={true} className="ctl-float-decor" style={{ position: "absolute", right: "-18px", bottom: "18%", opacity: 0.35, pointerEvents: "none", animation: "ctl-illus-float-d 13s ease-in-out infinite 5s", zIndex: 0, color: "#5A8B7A" }}><IconDocumentSmall size={108} /></div>

          {/* ── Decorative shapes (hidden on mobile via .ctl-float-decor) ── */}
          <div aria-hidden={true} className="ctl-float-decor" style={{ position: "absolute", top: "9%", left: "44%", animation: "star-twinkle 4s ease-in-out infinite", pointerEvents: "none", zIndex: 0, color: "#F5C547" }}>
            <IconSparkle size={26} />
          </div>
          <div aria-hidden={true} className="ctl-float-decor" style={{ position: "absolute", bottom: "22%", left: "40%", animation: "blob-bob 7s ease-in-out infinite 2.5s", pointerEvents: "none", zIndex: 0, color: "#5A8B7A" }}>
            <IconPlus size={20} />
          </div>
          <div aria-hidden={true} className="ctl-float-decor" style={{ position: "absolute", top: "38%", right: "46%", animation: "blob-bob 9s ease-in-out infinite 1s", pointerEvents: "none", zIndex: 0, color: "#C97A4A" }}>
            <IconFlag size={22} />
          </div>
          <div aria-hidden={true} className="ctl-float-decor" style={{ position: "absolute", top: "14%", right: "43%", animation: "blob-bob 6.5s ease-in-out infinite 4s", pointerEvents: "none", zIndex: 0, color: "#D4B8E5" }}>
            <IconPlus size={20} />
          </div>

          <div
            className="hero-grid"
            style={{
              maxWidth: 1160,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr",
              alignItems: "center",
              gap: "clamp(32px, 5vw, 80px)",
              padding: "clamp(40px, 6vw, 120px) clamp(16px, 3vw, 48px)",
              position: "relative",
            }}
          >
            <style>{`
              @media (min-width: 768px) {
                .hero-grid { grid-template-columns: 1fr 1fr !important; }
              }
              @media (max-width: 767px) {
                .ctl-float-decor { display: none !important; }
              }
            `}</style>

            {/* ── Left: Text ── */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "7px 14px",
                  background: "#F5C547",
                  border: "2px solid #171717",
                  boxShadow: "3px 3px 0 0 #171717",
                  borderRadius: 999,
                  fontFamily: "var(--app-font-sans)",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#171717",
                  marginBottom: "clamp(18px, 2.5vw, 26px)",
                  animation: `ctl-fade-up 0.7s 0s ${EASE} both`,
                }}
              >
                For renters · For landlords · All 50 states
              </div>

              <h1
                id="hero-heading"
                className="hero-h1"
                style={{
                  fontFamily: "var(--app-font-serif)",
                  fontWeight: 500,
                  fontSize: "clamp(48px, 8vw, 96px)",
                  lineHeight: 0.96,
                  letterSpacing: "-0.04em",
                  color: "var(--color-ink)",
                  margin: 0,
                  animation: `ctl-fade-up 0.7s 0.08s ${EASE} both`,
                }}
              >
                Your lease,
                <br />
                <em style={{ fontStyle: "italic", color: "var(--color-ink-blue)", backgroundImage: "linear-gradient(to top, rgba(245,197,71,0.5) 0%, rgba(245,197,71,0.5) 34%, transparent 34%)", WebkitBoxDecorationBreak: "clone", boxDecorationBreak: "clone" }}>in plain<br />English.</em>
              </h1>

              <p
                className="hero-sub"
                style={{
                  fontFamily: "var(--app-font-sans)",
                  fontSize: "clamp(15px, 1.8vw, 18px)",
                  lineHeight: 1.55,
                  marginTop: "clamp(20px, 3vw, 28px)",
                  color: "var(--color-ink-muted)",
                  maxWidth: 480,
                  animation: `ctl-fade-up 0.7s 0.22s ${EASE} both`,
                }}
              >
                Signing one or issuing one — a free scan shows you what won't hold up in court, in 15 seconds. Full report $9.99. No subscription.
              </p>

              {/* Hero action: pick your state → start free scan (the first step, surfaced) */}
              <div style={{ marginTop: "clamp(24px, 3.5vw, 36px)", animation: `ctl-fade-up 0.7s 0.36s ${EASE} both` }}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "stretch", maxWidth: 480 }}>
                  <select
                    aria-label="Your state or territory"
                    value={heroState}
                    onChange={(e) => { setHeroState(e.target.value); if (e.target.value) { try { localStorage.setItem("ctl-state", e.target.value); } catch { /* noop */ } } }}
                    style={{ flex: "1 1 190px", minWidth: 168, padding: "15px 16px", borderRadius: 12, border: "2.5px solid #171717", backgroundColor: "var(--color-bone)", color: heroState ? "var(--color-ink)" : "var(--color-ink-muted)", fontFamily: "var(--app-font-sans)", fontSize: 15, fontWeight: 600, appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23171717' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 15px center", paddingRight: 42, cursor: "pointer", outline: "none", minHeight: 54, boxShadow: "3px 3px 0 0 #5A8B7A" }}
                  >
                    <option value="">Choose your state</option>
                    {STATE_GUIDES.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}
                  </select>
                  <button
                    onClick={() => navigate(heroState ? `/upload?state=${heroState}` : "/upload")}
                    className="mn-btn"
                    onMouseEnter={() => setCtaHover(true)}
                    onMouseLeave={() => setCtaHover(false)}
                    style={{ flex: "0 0 auto", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 999, padding: "15px 28px", fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em", background: ctaHover ? "#3D5F50" : "#5A8B7A", color: "#FBF8F1", border: "2.5px solid #171717", boxShadow: ctaHover ? "2px 2px 0 0 #171717" : "5px 5px 0 0 #171717", transform: ctaHover ? "translate(2px, 2px)" : "translate(0, 0)", transition: "background 0.2s, transform 0.12s ease, box-shadow 0.12s ease", cursor: "pointer", minHeight: 54 }}
                  >
                    Start free scan
                    <IconChevronRight size={16} style={{ transform: ctaHover ? "translateX(4px)" : "translateX(0)", transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)" }} aria-hidden={true} />
                  </button>
                </div>
                <Link
                  href="/example"
                  className="mn-btn-ghost"
                  onMouseEnter={() => setSampleHover(true)}
                  onMouseLeave={() => setSampleHover(false)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 14, borderRadius: 999, padding: "11px 22px", fontFamily: "var(--app-font-sans)", fontSize: 14, fontWeight: 600, color: sampleHover ? "#3D5F50" : "var(--color-ink)", backgroundColor: "transparent", textDecoration: "none" }}
                >
                  See example report
                  <IconChevronRight size={13} aria-hidden={true} />
                </Link>
              </div>

              {/* Trust row */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px", marginTop: 18, animation: `ctl-fade-up 0.7s 0.44s ${EASE} both` }}>
                {["Free scan", "No account", "No subscription", "Never stored", "15-second scan"].map((t) => (
                  <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--app-font-sans)", fontSize: 13, color: "var(--color-ink-muted)" }}>
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden={true}><path d="M2 7.2L5.5 10.5L12 3" stroke="#5A8B7A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {t}
                  </span>
                ))}
              </div>

            </div>

            {/* ── Right: mini report card — the product at a glance ── */}
            <div
              className="hero-aside"
              aria-label="Example free scan result: lease health score with flagged clauses"
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: 440,
                width: "100%",
                justifySelf: "center",
                animation: `ctl-float-card 7s ease-in-out infinite, ctl-fade-up 0.9s 0.28s ${EASE} both`,
              }}
            >
              <div style={{ background: "var(--color-bone)", borderRadius: 16, border: "2.5px solid #171717", boxShadow: "8px 8px 0 0 #171717", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "12px 18px", borderBottom: "2px solid #171717", background: "#F5C547" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", border: "1.5px solid #171717", background: "var(--color-bone)" }} />
                  <div style={{ width: 7, height: 7, borderRadius: "50%", border: "1.5px solid #171717", background: "var(--color-bone)" }} />
                  <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#171717", marginLeft: 8 }}>
                    Your free scan · 15 seconds
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "20px 22px", borderBottom: "1.5px solid rgba(23,23,23,0.1)" }}>
                  <div style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(44px,5vw,56px)", letterSpacing: "-0.04em", lineHeight: 1, color: "#7A2C3D" }}>
                    41<span style={{ fontSize: "0.45em", color: "var(--color-ink-muted)" }}>/100</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-ink)" }}>Lease health score</div>
                    <div style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: 13, color: "var(--color-ink-muted)", marginTop: 3 }}>4 issues found — 1 high-risk</div>
                  </div>
                </div>
                {[
                  { sev: "#7A2C3D", tag: "High risk", text: "Landlord can enter without notice" },
                  { sev: "#C97A4A", tag: "Medium", text: "“Non-refundable” deposit — not a legal category" },
                  { sev: "#5A8B7A", tag: "What to say", text: "The exact lines to get both fixed" },
                ].map((f) => (
                  <div key={f.text} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 22px", borderBottom: "1.5px solid rgba(23,23,23,0.08)" }}>
                    <span style={{ width: 9, height: 9, borderRadius: "50%", background: f.sev, border: "1.5px solid #171717", flexShrink: 0 }} />
                    <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: f.sev, flexShrink: 0, width: 84 }}>{f.tag}</span>
                    <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "var(--color-ink)", lineHeight: 1.4 }}>{f.text}</span>
                  </div>
                ))}
                <div style={{ padding: "12px 22px", background: "#1E3A5F" }}>
                  <span style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: 13, color: "rgba(251,248,241,0.85)" }}>…every clause checked against your state's law.</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ═══════════════ STATE COVERAGE — the product, interactive, straight after the hero ═══════════════ */}
        <div id="state-coverage" style={{ background: "#EAF2EE", borderTop: "2.5px solid #171717", borderBottom: "2.5px solid #171717" }}>
          <StatePreviews />
        </div>

        {/* ═══════════════ 01 · THE PROBLEM — stat-led, merged ═══════════════ */}
        <section
          id="problem"
          data-reveal
          className="ctl-reveal"
          aria-labelledby="problem-heading"
          style={{ background: "#1E3A5F", padding: "clamp(56px,8vw,96px) clamp(24px,4vw,48px)", position: "relative", overflow: "hidden" }}
        >
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(90,139,122,0.85)" }}>
              01. THE PROBLEM
            </span>
            <h2
              id="problem-heading"
              style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(28px,4.5vw,52px)", letterSpacing: "-0.03em", lineHeight: 1.06, color: "var(--color-bone)", margin: "16px 0 clamp(36px,5vw,56px)", transform: "rotate(-1deg)", transformOrigin: "left center", maxWidth: 720 }}
            >
              Most leases aren't written{" "}
              <em style={{ fontStyle: "italic", color: "rgba(251,248,241,0.38)" }}>for the people signing them.</em>
            </h2>

            {/* The two stats that matter — huge */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(24px,4vw,56px)", alignItems: "end", marginBottom: "clamp(40px,6vw,64px)" }}>
              <div>
                <div style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(96px,14vw,180px)", letterSpacing: "-0.05em", lineHeight: 0.9, color: "#F5C547" }}>40%</div>
                <div style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(15px,1.8vw,18px)", color: "var(--color-bone)", marginTop: 12, maxWidth: 340, lineHeight: 1.5 }}>of leases contain clauses that are illegal in their own state.</div>
                <div style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: 11, color: "rgba(251,248,241,0.66)", marginTop: 6 }}>Source: Penn Law / Massachusetts study</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(64px,9vw,120px)", letterSpacing: "-0.05em", lineHeight: 0.9, color: "var(--color-bone)" }}>41%</div>
                <div style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(14px,1.6vw,16px)", color: "rgba(251,248,241,0.8)", marginTop: 12, maxWidth: 320, lineHeight: 1.5 }}>of renters end up disputing their deposit.</div>
                <div style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: 11, color: "rgba(251,248,241,0.66)", marginTop: 6 }}>Source: Zillow Renter Survey, 2024</div>
              </div>
            </div>

            {/* Three clauses you'll recognise — one line each */}
            <div style={{ borderTop: "1.5px solid rgba(251,248,241,0.15)", marginBottom: "clamp(32px,5vw,48px)" }}>
              {[
                { q: "“Landlord may enter at any time, without notice.”", a: "Illegal in 48 states." },
                { q: "“Tenant waives all right to repair or remedy.”", a: "Can't be waived in any US state." },
                { q: "“The security deposit is non-refundable.”", a: "Not a legal category — every state limits deductions." },
              ].map(({ q, a }) => (
                <div key={q} style={{ display: "flex", alignItems: "baseline", gap: 14, padding: "16px 0", borderBottom: "1.5px solid rgba(251,248,241,0.12)", flexWrap: "wrap" }}>
                  <span aria-hidden="true" style={{ width: 9, height: 9, borderRadius: "50%", background: "#7A2C3D", border: "1.5px solid rgba(251,248,241,0.5)", flexShrink: 0, alignSelf: "center" }} />
                  <span style={{ fontFamily: "var(--app-font-mono)", fontStyle: "italic", fontSize: "clamp(13px,1.5vw,15px)", color: "rgba(251,248,241,0.92)", flex: "1 1 300px" }}>{q}</span>
                  <span style={{ fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: "clamp(12px,1.4vw,14px)", color: "#F5C547" }}>{a}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <Link
                href="/upload"
                className="mn-btn"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999, padding: "13px 26px", fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 14, textDecoration: "none", backgroundColor: "#F5C547", color: "#171717", border: "2px solid #171717", boxShadow: "4px 4px 0 0 #171717" }}
              >
                Scan yours free →
              </Link>
              <span style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: 13, color: "rgba(251,248,241,0.62)" }}>15 seconds · no account</span>
            </div>
          </div>
        </section>

        {/* ═══════════════ EDITORIAL PHOTO - Moving Day ═══════════════ */}
        <div style={{ position: "relative", overflow: "hidden", height: "clamp(260px, 38vw, 480px)", borderTop: "2px solid #171717", borderBottom: "2px solid #171717" }}>
          <img
            src={PhotoMovingSteps}
            alt="A person carries a moving box marked FRAGILE up the front steps of a brownstone building"
            loading="lazy"
            decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", display: "block" }}
          />
          <div aria-hidden={true} style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(23,23,23,0.55) 0%, rgba(23,23,23,0.15) 60%, transparent 100%)" }} />
          <div style={{ position: "absolute", bottom: "clamp(20px,4vw,36px)", left: "clamp(24px,4vw,56px)", maxWidth: 420 }}>
            <p style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: "clamp(18px,2.8vw,28px)", color: "rgba(251,248,241,0.95)", lineHeight: 1.3, margin: "0 0 8px", textShadow: "0 2px 16px rgba(0,0,0,0.5)", letterSpacing: "-0.02em" }}>
              Every move starts with a lease.
            </p>
            <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(12px,1.3vw,14px)", color: "rgba(251,248,241,0.65)", margin: 0, textShadow: "0 1px 8px rgba(0,0,0,0.5)", letterSpacing: "0.02em" }}>
              Make sure you know what you signed.
            </p>
          </div>
        </div>

        {/* ── Wavy section divider ── */}
        <div aria-hidden={true} style={{ padding: "0 clamp(24px,4vw,48px)" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <svg viewBox="0 0 1200 28" width="100%" height="28" style={{ display: "block" }}>
              <path d="M 0 14 Q 60 4 120 14 T 240 14 T 360 14 T 480 14 T 600 14 T 720 14 T 840 14 T 960 14 T 1080 14 T 1200 14" fill="none" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" opacity="0.1"/>
            </svg>
          </div>
        </div>

        {/* ═══════════════ HOW IT WORKS ═══════════════ */}
        <section
          id="how-it-works"
          data-reveal
          className="ctl-reveal"
          aria-labelledby="how-heading"
          style={{ padding: "0 clamp(24px, 4vw, 48px) clamp(48px, 6vw, 80px)", position: "relative", overflow: "hidden" }}
        >
          <div aria-hidden={true} className="ctl-float-decor" style={{ position: "absolute", right: -60, top: "32%", opacity: 0.22, pointerEvents: "none", animation: "ctl-illus-float-b 12s ease-in-out infinite 2s", zIndex: 0, color: "#F4A480" }}><IconBox size={195} /></div>
          <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative", zIndex: 1 }}>

            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-sage)", display: "block", marginBottom: 8 }}>
                  02. HOW IT WORKS
                </span>
                <h2
                  id="how-heading"
                  style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(24px, 3.5vw, 36px)", letterSpacing: "-0.025em", color: "var(--color-ink)", margin: 0 }}
                >
                  Three steps. <em style={{ fontStyle: "italic", color: "var(--color-ink-blue)" }}>Under a minute.</em>
                </h2>
              </div>
              <Link
                href="/upload"
                style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, fontWeight: 600, color: "var(--color-sage)", textDecoration: "underline", textUnderlineOffset: 3, flexShrink: 0 }}
              >
                Read my lease →
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 14,
                marginTop: 28,
              }}
              className="steps-grid"
            >
              {STEPS.map((step, idx) => {
                const stepIcons = [IconUpload, IconMapPin, IconDocumentSmall];
                const StepIcon = stepIcons[idx];
                return (
                  <div
                    key={step.n}
                    style={{ background: step.bg, border: "2.5px solid #171717", borderRadius: 16, boxShadow: "5px 5px 0 0 #171717", padding: "clamp(24px,3vw,32px)", color: "var(--color-bone)" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                      <StepIcon size={30} aria-hidden={true} />
                      <span aria-hidden={true} style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: "clamp(40px,5vw,56px)", lineHeight: 1, letterSpacing: "-0.05em", color: "rgba(251,248,241,0.3)" }}>{step.n}</span>
                    </div>
                    <h3 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(19px,2.2vw,24px)", letterSpacing: "-0.02em", color: "var(--color-bone)", marginBottom: 8 }}>{step.title}</h3>
                    <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "rgba(251,248,241,0.78)", lineHeight: 1.6, margin: 0 }}>{step.body}</p>
                    {step.ticks && (
                      <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0", display: "flex", flexDirection: "column", gap: 7 }}>
                        {step.ticks.map((tk) => (
                          <li key={tk} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontFamily: "var(--app-font-sans)", fontSize: 13, color: "rgba(251,248,241,0.92)", lineHeight: 1.45 }}>
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 4 }}><path d="M2 7.2L5.5 10.5L12 3" stroke="#F5C547" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            {tk}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* ═══════════════ WHO IT'S FOR ═══════════════ */}
        <section
          id="who-its-for"
          data-reveal
          className="ctl-reveal"
          aria-labelledby="who-heading"
          style={{ padding: "0 clamp(24px, 4vw, 48px) clamp(56px, 7vw, 88px)", position: "relative", overflow: "hidden" }}
        >
          {/* ── Background icon graphic ── */}
          <div aria-hidden={true} className="ctl-float-decor" style={{ position: "absolute", left: "clamp(20px, 4vw, 80px)", bottom: "clamp(30px, 10vh, 100px)", opacity: 0.08, pointerEvents: "none", zIndex: 0, color: "rgba(23,23,23,0.18)" }}><IconHouseSmall size={250} /></div>

          {/* ── Shapes ── */}
          <div className="ctl-float-decor" style={{ position: "absolute", top: "8%", right: "1%", animation: "star-twinkle 4.5s ease-in-out infinite 2s", pointerEvents: "none", zIndex: 1, color: "#F5C547" }}>
            <IconSparkle size={28} aria-hidden={true} />
          </div>
          <div className="ctl-float-decor" style={{ position: "absolute", bottom: "6%", left: "0.5%", animation: "blob-bob 7.5s ease-in-out infinite 1s", pointerEvents: "none", zIndex: 1, color: "#C97A4A" }}>
            <IconFlag size={22} aria-hidden={true} />
          </div>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <SectionEyebrow num="03" label="WHO IT'S FOR" />
            <h2
              id="who-heading"
              style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(24px,3.5vw,40px)", letterSpacing: "-0.025em", lineHeight: 1.1, color: "var(--color-ink)", margin: "0 0 clamp(28px,4vw,48px)" }}
            >
              Works for anyone with a lease.{" "}
              <em style={{ fontStyle: "italic", color: "var(--color-ink-muted)" }}>From either side of the door.</em>
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", gap: 16 }} className="who-its-for-grid">

              {/* Renters panel */}
              <div id="renter-card" className="mn-shadow-clay" style={{ background: "#1E3A5F", border: "2.5px solid #171717", borderRadius: 16, padding: "clamp(32px,5vw,52px)", position: "relative", overflow: "hidden" }}>
                <img src={PhotoMomBaby} aria-hidden={true} alt="" loading="lazy" decoding="async" style={{ position: "absolute", bottom: 0, right: 0, width: 220, height: 280, objectFit: "cover", objectPosition: "center 20%", opacity: 0.12, pointerEvents: "none", maskImage: "linear-gradient(to top left, rgba(0,0,0,0.6), transparent 65%)", WebkitMaskImage: "linear-gradient(to top left, rgba(0,0,0,0.6), transparent 65%)" }} />
                <div style={{ marginBottom: 24 }}>
                  <IconUser size={52} aria-hidden={true} />
                </div>
                <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(251,248,241,0.62)", marginBottom: 12 }}>FOR RENTERS</div>
                <h3 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(20px,2.5vw,28px)", letterSpacing: "-0.02em", lineHeight: 1.15, color: "var(--color-bone)", margin: "0 0 16px" }}>
                  Know your rights.<br />Sign with confidence.
                </h3>
                <ul style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(13px,1.5vw,14px)", color: "rgba(251,248,241,0.8)", lineHeight: 2, margin: "0 0 28px", paddingLeft: 0, listStyle: "none" }}>
                  {["Clauses that violate your state's law - and what to do about them", "Rights the law gives you that no lease can take away", "What to ask before you put pen to paper"].map(item => (
                    <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{ color: "rgba(90,139,122,0.9)", marginTop: 1, flexShrink: 0 }}>→</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/upload" className="mn-btn" style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999, padding: "14px 28px", fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 14, textDecoration: "none", backgroundColor: "#5A8B7A", color: "#FBF8F1", border: "2px solid #171717", boxShadow: "4px 4px 0 0 #171717" }}>
                  Read my lease →
                </Link>
              </div>

              {/* Landlords panel */}
              <div id="landlord-card" className="mn-shadow-sage" style={{ background: "#C97A4A", border: "2.5px solid #171717", borderRadius: 16, padding: "clamp(32px,5vw,52px)" }}>
                <div style={{ marginBottom: 24 }}>
                  <IconHouseSmall size={52} aria-hidden={true} />
                </div>
                <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(23,23,23,0.6)", marginBottom: 12 }}>FOR LANDLORDS</div>
                <h3 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(20px,2.5vw,28px)", letterSpacing: "-0.02em", lineHeight: 1.15, color: "#171717", margin: "0 0 16px" }}>
                  Stay compliant.<br />Stay rock solid in court.
                </h3>
                <ul style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(13px,1.5vw,14px)", color: "rgba(23,23,23,0.8)", lineHeight: 2, margin: "0 0 28px", paddingLeft: 0, listStyle: "none" }}>
                  {["Language courts have already ruled unenforceable", "State-specific compliance gaps that expose you to liability", "What to fix before you issue - not after a dispute starts"].map(item => (
                    <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{ color: "#171717", marginTop: 1, flexShrink: 0 }}>→</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/upload" className="mn-btn" style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999, padding: "14px 28px", fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 14, textDecoration: "none", backgroundColor: "var(--color-bone)", color: "#171717", border: "2px solid #171717", boxShadow: "4px 4px 0 0 #171717" }}>
                  Read my lease →
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* ═══════════════ FINAL CTA ═══════════════ */}
        <section
          data-reveal
          className="ctl-reveal"
          aria-labelledby="cta-heading"
          style={{ padding: "0 clamp(24px, 4vw, 48px) clamp(64px, 8vw, 100px)" }}
        >
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div
              style={{
                background: "#1E3A5F",
                borderRadius: 16,
                padding: "clamp(56px, 8vw, 96px) clamp(32px, 5vw, 72px)",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div aria-hidden={true} style={{ position: "absolute", left: -24, bottom: -16, opacity: 0.18, pointerEvents: "none", animation: "ctl-illus-float-a 10s ease-in-out infinite 1s", zIndex: 0, color: "#5A8B7A" }}><IconSearchSmall size={160} /></div>
              <div aria-hidden={true} style={{ position: "absolute", right: -20, top: -10, opacity: 0.16, pointerEvents: "none", animation: "ctl-illus-float-d 9s ease-in-out infinite 3.5s", zIndex: 0, color: "#C97A4A" }}><IconKey size={115} /></div>

              {/* Corner stamp */}
              <svg aria-hidden={true} viewBox="0 0 44 44" width="52" height="52" style={{ position: "absolute", top: 18, right: 22, zIndex: 1 }}>
                <circle cx="22" cy="22" r="17" fill="none" stroke="rgba(251,248,241,0.28)" strokeWidth="2" strokeDasharray="3 2.5"/>
                <text x="22" y="26" textAnchor="middle" style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: "9px", fill: "rgba(251,248,241,0.45)" }}>SCAN</text>
              </svg>

              {/* Sunshine star */}
              <svg aria-hidden={true} width="24" height="24" viewBox="0 0 24 24" style={{ position: "absolute", bottom: 24, left: 28, animation: "star-twinkle 5s ease-in-out infinite 1.5s", pointerEvents: "none", zIndex: 1 }}>
                <path d="M12 2 L14 9 L21 12 L14 15 L12 22 L10 15 L3 12 L10 9 Z" fill="#F5C547" stroke="#171717" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>

              <h2
                id="cta-heading"
                style={{
                  fontFamily: "var(--app-font-serif)",
                  fontWeight: 500,
                  fontSize: "clamp(30px, 5vw, 56px)",
                  letterSpacing: "-0.035em",
                  lineHeight: 1.0,
                  color: "var(--color-bone)",
                  margin: "0 0 18px",
                  position: "relative",
                }}
              >
                Know what you're signing.
                <br />
                <em style={{ fontStyle: "italic", color: "rgba(251,248,241,0.55)" }}>Before you agree.</em>
              </h2>

              <p
                style={{
                  fontFamily: "var(--app-font-sans)",
                  fontSize: "clamp(14px, 1.8vw, 17px)",
                  color: "rgba(251,248,241,0.6)",
                  lineHeight: 1.6,
                  margin: "0 auto 40px",
                  maxWidth: 440,
                  position: "relative",
                }}
              >
                Free scan, no account required. Unlock the full report for $9.99 — one-time, no subscription. Renters and landlords, all 50 states.
              </p>

              <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", position: "relative" }}>
                <Link
                  href="/upload"
                  className="mn-btn"
                  style={{
                    display: "inline-block",
                    borderRadius: 999,
                    padding: "16px 40px",
                    fontFamily: "var(--app-font-sans)",
                    fontWeight: 700,
                    fontSize: 16,
                    textDecoration: "none",
                    backgroundColor: "#5A8B7A",
                    color: "#FBF8F1",
                    border: "2.5px solid #171717",
                    boxShadow: "5px 5px 0 0 #171717",
                    minHeight: 44,
                  }}
                >
                  Start free scan →
                </Link>
                <Link
                  href="/example"
                  className="mn-btn-ghost"
                  style={{
                    display: "inline-block",
                    borderRadius: 999,
                    padding: "16px 36px",
                    fontFamily: "var(--app-font-sans)",
                    fontWeight: 500,
                    fontSize: 15,
                    textDecoration: "none",
                    backgroundColor: "transparent",
                    color: "rgba(251,248,241,0.85)",
                    border: "2.5px solid rgba(251,248,241,0.35)",
                    boxShadow: "4px 4px 0 0 #5A8B7A",
                    minHeight: 44,
                  }}
                >
                  See example report →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ FOUNDER NOTE ═══════════════ */}
        <section
          data-reveal
          className="ctl-reveal"
          aria-labelledby="founder-heading"
          style={{ padding: "0 clamp(24px, 4vw, 48px) clamp(64px, 7vw, 96px)" }}
        >
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ flexShrink: 0 }}>
                <IconUser size={48} aria-hidden={true} />
              </div>
              <div>
                <blockquote
                  id="founder-heading"
                  style={{ margin: 0, fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: "clamp(14px, 1.8vw, 16px)", color: "var(--color-ink)", lineHeight: 1.75 }}
                >
                  "No one should have to sign 35 pages of legal language without help. The scan is free; the full report costs less than lunch."
                </blockquote>
                <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 12, color: "var(--color-ink-muted)", marginTop: 12 }}>- Ishmael</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />

      {/* Mobile sticky CTA - sage primary, full-width */}
      <div className="mobile-sticky-cta" role="complementary" aria-label="Quick access">
        <Link
          href="/upload"
          onMouseEnter={() => setMobileCTAHover(true)}
          onMouseLeave={() => setMobileCTAHover(false)}
          style={{
            display: "inline-block",
            borderRadius: 999,
            padding: "13px 32px",
            fontFamily: "var(--app-font-sans)",
            fontWeight: 600,
            fontSize: 15,
            textDecoration: "none",
            backgroundColor: mobileCTAHover ? "#3D5F50" : "#5A8B7A",
            color: "#FBF8F1",
            border: "2.5px solid #171717",
            boxShadow: mobileCTAHover ? "2px 2px 0 0 #171717" : "4px 4px 0 0 #171717",
            minHeight: 44,
            minWidth: 200,
            textAlign: "center",
            transition: "all 0.15s ease",
          }}
        >
          Read my lease →
        </Link>
      </div>

    </div>
  );
}
