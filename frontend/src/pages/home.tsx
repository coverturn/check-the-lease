import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { STATE_GUIDES } from "@/lib/guide-data";
import { SkipLink } from "@/components/SkipLink";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { StatePreviews } from "@/components/StatePreviews";
import { IconChevronRight, IconMapPin, IconSparkle, IconClock, IconWarning, IconUpload, IconKey, IconDocumentSmall, IconShield, IconHelp, IconUser, IconHouseSmall, IconPlus, IconFlag, IconBox, IconSearchSmall } from "@/components/icons/Icon";
import PhotoMovingSteps from "@assets/DTS_Chicago_to_LA_Alex_Tan_Photos_ID2720_1777779569750.jpg";
import PhotoMomBaby from "@assets/DTS_AWAY_Daniel_Faro_ID7514.jpg";

function useScrollReveal() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      document.querySelectorAll(".ctl-reveal").forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-visible"); }),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".ctl-reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

const EASE = "cubic-bezier(0.16,1,0.3,1)";

const STEPS = [
  { n: "01", title: "Upload your lease", body: "Drop the PDF. Any length, any state, any template.", borderRight: true },
  { n: "02", title: "Pick your state", body: "We check it against your state's actual tenant protection rules.", borderRight: true },
  { n: "03", title: "Read what it actually says", body: "Plain English. Every risky clause named. Every legal citation sourced. In under 15 seconds.", borderRight: false },
];

/* The four parts of every read — folded into How It Works as a compact strip */
const FEATURES = [
  { label: "Key terms", desc: "Rent, deposit, late fees, entry rights — pulled out and explained.", color: "#5A8B7A", right: true },
  { label: "Risk flags", desc: "Clauses that conflict with your state's law, each named and rated.", color: "#7A2C3D", right: true },
  { label: "Cited to the law", desc: "Every flag links to the actual statute — not “this might be illegal.”", color: "#C97A4A", right: true },
  { label: "Questions to raise", desc: "What to ask before signing. Or fix before issuing.", color: "#1E3A5F", right: false },
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
                A free scan names every red flag in 15 seconds. The full report — the law behind each one, and what to say — is $9.99. No subscription.
              </p>

              {/* Coverage badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 16px",
                  background: "rgba(90,139,122,0.08)",
                  border: "1.5px solid rgba(90,139,122,0.25)",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#3D5F50",
                  marginTop: "clamp(20px, 3vw, 28px)",
                  marginBottom: "clamp(24px, 3.5vw, 36px)",
                  animation: `ctl-fade-up 0.7s 0.28s ${EASE} both`,
                }}
              >
                <span style={{ fontWeight: 700 }}>50</span>
                <span style={{ opacity: 0.6 }}>·</span>
                <span>DC</span>
                <span style={{ opacity: 0.6 }}>·</span>
                <span>6 territories</span>
                <span style={{ marginLeft: 4, fontFamily: "var(--app-font-serif)", fontStyle: "italic", opacity: 0.7 }}>covered</span>
              </div>

              {/* Hero action: pick your state → start free scan (the first step, surfaced) */}
              <div style={{ animation: `ctl-fade-up 0.7s 0.36s ${EASE} both` }}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "stretch", maxWidth: 480 }}>
                  <select
                    aria-label="Your state or territory"
                    value={heroState}
                    onChange={(e) => setHeroState(e.target.value)}
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
                  onMouseEnter={() => setSampleHover(true)}
                  onMouseLeave={() => setSampleHover(false)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14, fontFamily: "var(--app-font-sans)", fontSize: 14, fontWeight: 600, color: sampleHover ? "#3D5F50" : "var(--color-ink)", textDecoration: "underline", textUnderlineOffset: 3 }}
                >
                  See example report
                  <IconChevronRight size={13} aria-hidden={true} />
                </Link>
              </div>

              {/* Trust row */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px", marginTop: 18, animation: `ctl-fade-up 0.7s 0.44s ${EASE} both` }}>
                {["Free scan", "No account", "Never stored", "No subscription"].map((t) => (
                  <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--app-font-sans)", fontSize: 13, color: "var(--color-ink-muted)" }}>
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden={true}><path d="M2 7.2L5.5 10.5L12 3" stroke="#5A8B7A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {t}
                  </span>
                ))}
              </div>

              {/* Stats - Fraunces 28px numbers */}
              <div
                style={{
                  display: "flex",
                  gap: "clamp(16px, 3vw, 28px)",
                  marginTop: "clamp(32px, 4vw, 48px)",
                  paddingTop: "clamp(20px, 3vw, 32px)",
                  borderTop: "1px solid var(--border-subtle)",
                  animation: `ctl-fade-up 0.7s 0.5s ${EASE} both`,
                }}
              >
                {[{ n: "All 50", l: "states", icon: IconMapPin }, { n: "$9.99", l: "full report", icon: IconSparkle }, { n: "15s", l: "per scan", icon: IconClock }].map(({ n, l, icon: Icon }) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Icon size={14} aria-hidden={true} />
                    <div>
                      <div style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: 28, color: "var(--color-ink)", letterSpacing: "-0.03em", lineHeight: 1 }}>{n}</div>
                      <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 12, color: "var(--color-ink-muted)", marginTop: 4, letterSpacing: "0.02em" }}>{l}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Animated Before → After demo ── */}
            <div
              className="hero-aside"
              aria-label="Example: a scary lease clause, decoded"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 0,
                animation: `ctl-float-card 7s ease-in-out infinite, ctl-fade-up 0.9s 0.28s ${EASE} both`,
              }}
            >
              {/* BEFORE: the scary clause - always visible */}
              <div
                style={{
                  background: "#141414",
                  borderRadius: 20,
                  padding: "clamp(20px, 2.5vw, 28px)",
                  border: "2px solid #171717",
                  boxShadow: "6px 6px 0 0 #171717",
                  marginBottom: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "rgba(255,100,100,0.7)" }} />
                  <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "rgba(255,200,50,0.5)" }} />
                  <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "rgba(80,200,80,0.4)" }} />
                  <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(251,248,241,0.65)", marginLeft: 8 }}>
                    FROM YOUR LEASE
                  </span>
                </div>
                <p style={{ fontFamily: "var(--app-font-mono)", fontSize: "clamp(12px, 1.5vw, 14px)", color: "rgba(251,248,241,0.95)", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
                  "Tenant waives the right to notice of entry. Landlord may enter the premises at any time for any purpose."
                </p>
              </div>

              {/* Animated arrow - cycles via CSS class */}
              <div
                aria-hidden={true}
                className="hero-cycle-arrow"
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  color: "rgba(122,44,61,0.5)",
                  padding: "6px 0",
                  lineHeight: 1,
                }}
              >
                ↓
              </div>

              {/* AFTER: wine - HIGH RISK result card - springs up via CSS class */}
              <div
                className="hero-cycle-result"
                style={{
                  background: "#7A2C3D",
                  borderRadius: 20,
                  padding: "clamp(20px, 2.5vw, 28px)",
                  marginTop: 10,
                  border: "2px solid #171717",
                  boxShadow: "8px 8px 0 0 #171717",
                }}
              >
                <div className="mn-badge"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    backgroundColor: "rgba(255,255,255,0.18)",
                    borderRadius: 6,
                    padding: "5px 12px",
                    marginBottom: 16,
                  }}
                >
                  <IconWarning size={14} aria-hidden={true} />
                  <span style={{ fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.13em", color: "rgba(255,255,255,0.95)" }}>High Risk</span>
                </div>

                <h3 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(16px, 2vw, 20px)", color: "#FBF8F1", letterSpacing: "-0.02em", margin: "0 0 10px", lineHeight: 1.25 }}>
                  Your landlord can enter without any notice.
                </h3>
                <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(12px, 1.4vw, 14px)", color: "rgba(251,248,241,0.92)", lineHeight: 1.65, margin: 0 }}>
                  In most states, landlords must give written notice before entering. This clause tries to waive that right entirely.
                </p>
              </div>

              <p style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: 12, color: "var(--color-ink-muted)", textAlign: "center", marginTop: 14 }}>
                This is what you get for every clause worth flagging.
              </p>
            </div>

          </div>
        </section>

        {/* ═══════════════ STATE COVERAGE — the product, interactive, straight after the hero ═══════════════ */}
        <div id="state-coverage">
          <StatePreviews />
        </div>

        {/* ═══════════════ MARQUEE ═══════════════ */}
        <div aria-hidden={true} style={{ overflow: "hidden", lineHeight: 0, borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
          <svg viewBox="0 0 1200 72" width="100%" height="72" preserveAspectRatio="xMidYMid meet">
            <path id="ctl-marquee-path" d="M 0,36 Q 300,8 600,32 T 1200,30" fill="none" />
            <text style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: "18px", fill: "#1E3A5F", opacity: 0.55, letterSpacing: "-0.01em" }}>
              <textPath href="#ctl-marquee-path" startOffset="0%">
                we read your lease · so everyone gets a fair deal · free scan for renters · free scan for landlords · we read your lease · so everyone gets a fair deal · free scan ·
              </textPath>
            </text>
          </svg>
        </div>

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

        {/* ═══════════════ WHAT'S ACTUALLY IN THERE ═══════════════ */}
        <section
          data-reveal
          className="ctl-reveal"
          aria-labelledby="clauses-heading"
          style={{ padding: "clamp(64px,9vw,100px) clamp(24px,4vw,48px)", background: "var(--color-bone)", position: "relative", overflow: "hidden" }}
        >
          {/* ── Background icon graphic ── */}
          <div aria-hidden={true} className="ctl-float-decor" style={{ position: "absolute", left: "clamp(30px, 5vw, 100px)", top: "clamp(40px, 12vh, 120px)", opacity: 0.08, pointerEvents: "none", zIndex: 0, color: "rgba(23,23,23,0.2)" }}><IconDocumentSmall size={260} /></div>

          {/* ── Shapes ── */}
          <div className="ctl-float-decor" style={{ position: "absolute", top: "5%", right: "2%", animation: "star-twinkle 5s ease-in-out infinite 1s", pointerEvents: "none", zIndex: 1, color: "#F5C547" }}>
            <IconSparkle size={30} aria-hidden={true} />
          </div>
          <div className="ctl-float-decor" style={{ position: "absolute", bottom: "12%", left: "0.5%", animation: "blob-bob 9s ease-in-out infinite 3s", pointerEvents: "none", zIndex: 1, color: "#F4A480" }}>
            <IconPlus size={24} aria-hidden={true} />
          </div>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <SectionEyebrow num="01" label="WHAT'S ACTUALLY IN THERE" />
            <h2
              id="clauses-heading"
              style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(24px,3.5vw,42px)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--color-ink)", margin: "0 0 10px", maxWidth: 700 }}
            >
              Clauses that appear in millions of US leases.
            </h2>
            <p style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: "clamp(16px,2vw,22px)", color: "var(--color-ink-muted)", margin: "0 0 clamp(32px,5vw,52px)", letterSpacing: "-0.01em" }}>
              Most are unenforceable. Few people push back.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px,1fr))", gap: 14 }}>
              {[
                {
                  tag: "Entering Without Warning",
                  clause: '"Landlord may enter the premises at any time, for any reason, without prior notice."',
                  cost: "Illegal in 48 states — most require 24–48 hours written notice. You can refuse, if you know you have the right.",
                  law: "e.g. Cal. Civ. Code § 1954 · NY RPL § 235-b",
                },
                {
                  tag: "Living Conditions",
                  clause: '"Tenant waives all right to repair, to withhold rent, or to seek any remedy for any defect."',
                  cost: "The warranty of habitability can't be waived in any US state. Courts void this — for tenants who challenge it.",
                  law: "Implied Warranty of Habitability — all 50 states",
                },
                {
                  tag: "Security Deposit",
                  clause: '"Security deposit is non-refundable under all circumstances."',
                  cost: '"Non-refundable deposit" is not a legal category. Every state limits deductions — most tenants walk away from money they were owed.',
                  law: "Security deposit laws vary by state",
                },
              ].map(({ tag, clause, cost, law }) => (
                <div
                  key={tag}
                  className="mn-shadow-clay"
                  style={{ background: "#141414", border: "2px solid #171717", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column" }}
                >
                  <div style={{ padding: "13px 20px", borderBottom: "1px solid rgba(255,255,255,0.12)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(251,248,241,0.82)" }}>{tag}</span>
                    <div style={{ display: "flex", gap: 4 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,100,100,0.65)" }} />
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,200,50,0.4)" }} />
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(80,200,80,0.3)" }} />
                    </div>
                  </div>
                  <div style={{ padding: "20px 20px 16px", flex: 1 }}>
                    <p style={{ fontFamily: "var(--app-font-mono)", fontSize: "clamp(11px,1.1vw,13px)", color: "rgba(251,248,241,0.95)", lineHeight: 1.75, margin: 0, fontStyle: "italic" }}>
                      {clause}
                    </p>
                  </div>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", padding: "16px 20px 18px" }}>
                    <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#F4A480", marginBottom: 8 }}>What this costs</div>
                    <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "rgba(251,248,241,0.9)", lineHeight: 1.65, margin: "0 0 10px" }}>{cost}</p>
                    <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 10, color: "#F5C547", letterSpacing: "0.04em" }}>{law}</div>
                  </div>
                </div>
              ))}
            </div>

            <p style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: "clamp(14px,1.5vw,16px)", color: "var(--color-ink-muted)", textAlign: "center", marginTop: "clamp(28px,4vw,48px)" }}>
              Check the Lease finds these and shows you the law that breaks them.
            </p>
          </div>
        </section>

        {/* ══════════════════ THE PROBLEM ═══════════════════════════ */}
        <section
          id="problem"
          data-reveal
          className="ctl-reveal"
          aria-labelledby="problem-heading"
          style={{ background: "#1E3A5F", padding: "clamp(64px,9vw,100px) clamp(24px,4vw,48px)", position: "relative", overflow: "hidden" }}
        >
          {/* ── Background icon graphic ── */}
          <div aria-hidden={true} className="ctl-float-decor" style={{ position: "absolute", right: "clamp(40px, 8vw, 120px)", bottom: "clamp(20px, 8vh, 80px)", opacity: 0.18, pointerEvents: "none", zIndex: 0, color: "rgba(251,248,241,0.3)" }}><IconWarning size={240} /></div>

          {/* ── Shapes ── */}
          <div className="ctl-float-decor" style={{ position: "absolute", top: "10%", right: "6%", animation: "star-twinkle 3.5s ease-in-out infinite", pointerEvents: "none", zIndex: 1, color: "#F5C547" }}>
            <IconSparkle size={30} aria-hidden={true} />
          </div>
          <div className="ctl-float-decor" style={{ position: "absolute", bottom: "14%", left: "4%", animation: "blob-bob 8s ease-in-out infinite 1.5s", pointerEvents: "none", zIndex: 1, color: "#F4A480" }}>
            <IconPlus size={22} aria-hidden={true} />
          </div>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px,1fr))", gap: "clamp(40px,7vw,80px)", alignItems: "center" }} className="problem-section-grid">

              {/* Left: the case */}
              <div>
                {/* 02 eyebrow - on dark background, sage still reads */}
                <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(90,139,122,0.85)" }}>
                  02. THE PROBLEM
                </span>
                <h2
                  id="problem-heading"
                  style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(28px,4.5vw,52px)", letterSpacing: "-0.03em", lineHeight: 1.06, color: "var(--color-bone)", margin: "16px 0 24px", transform: "rotate(-1deg)", transformOrigin: "left center" }}
                >
                  Most leases aren't written{" "}
                  <em style={{ fontStyle: "italic", color: "rgba(251,248,241,0.38)" }}>for the people signing them.</em>
                </h2>
                <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(14px,1.6vw,16px)", color: "rgba(251,248,241,0.52)", lineHeight: 1.8, margin: 0, maxWidth: 460 }}>
                  35 pages of legal writing, signed without a lawyer. A fair lease protects everyone. Most don't.
                </p>
                <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <Link
                    href="/upload"
                    className="mn-btn"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999, padding: "13px 26px", fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 14, textDecoration: "none", backgroundColor: "#F5C547", color: "#171717", border: "2px solid #171717", boxShadow: "4px 4px 0 0 #171717" }}
                  >
                    Scan yours free →
                  </Link>
                  <span style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: 13, color: "rgba(251,248,241,0.45)" }}>15 seconds · no account</span>
                </div>
              </div>

              {/* Right: stat grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, minHeight: "auto" }} className="problem-stats-grid">
                {[
                  { n: "45M", l: "renter households in the US", src: "Harvard JCHS, 2024" },
                  { n: "40%", l: "of leases contain illegal clauses", src: "Penn Law / Massachusetts study" },
                  { n: "41%", l: "of renters dispute their deposit", src: "Zillow Renter Survey, 2024" },
                  { n: "1 in 13", l: "households faced eviction in 2023", src: "Eviction Lab, Princeton" },
                ].map(({ n, l, src }) => (
                  <div key={n} style={{ background: "var(--color-bone)", border: "2px solid #171717", padding: "clamp(16px,2.5vw,26px)", boxShadow: "4px 4px 0 0 #F5C547" }}>
                    <div style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(28px,4vw,48px)", color: "var(--color-ink)", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 8 }}>{n}</div>
                    <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "var(--color-ink)", lineHeight: 1.5, marginBottom: 6 }}>{l}</div>
                    <div style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: 10, color: "#6B6B6B", lineHeight: 1.4 }}>Source: {src}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

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
                  03. HOW IT WORKS
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
                borderTop: "1px solid var(--border-subtle)",
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
                    style={{
                      padding: "clamp(28px, 4vw, 48px) clamp(16px, 2.5vw, 36px)",
                      borderRight: step.borderRight ? "1px solid var(--border-subtle)" : "none",
                    }}
                  >
                    <div style={{ marginBottom: 20 }}>
                      <StepIcon size={32} aria-hidden={true} />
                    </div>
                    <div
                      aria-hidden={true}
                      style={{
                        fontFamily: "var(--app-font-serif)",
                        fontStyle: "italic",
                        fontWeight: 400,
                        fontSize: "clamp(56px, 8vw, 80px)",
                        lineHeight: 1,
                        letterSpacing: "-0.05em",
                        color: "var(--color-ink-blue)",
                        opacity: 0.25,
                        marginBottom: 20,
                        userSelect: "none",
                      }}
                    >
                      {step.n}
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--app-font-serif)",
                        fontWeight: 500,
                        fontSize: "clamp(18px, 2.2vw, 24px)",
                        letterSpacing: "-0.02em",
                        color: "var(--color-ink)",
                        marginBottom: 10,
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--app-font-sans)",
                        fontSize: 14,
                        color: "var(--color-ink-muted)",
                        lineHeight: 1.65,
                        margin: 0,
                      }}
                    >
                      {step.body}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* ── The four parts of every read (folded from the old Features section) ── */}
            <div style={{ marginTop: "clamp(28px, 4vw, 44px)" }}>
              <p style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: "clamp(15px, 1.8vw, 18px)", color: "var(--color-ink-muted)", margin: "0 0 16px", letterSpacing: "-0.01em" }}>
                Every read comes back in four parts:
              </p>
              <div
                className="features-grid"
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}
              >
                {FEATURES.map((f, i) => {
                  const featureIcons = [IconKey, IconWarning, IconShield, IconHelp];
                  const FeatureIcon = featureIcons[i];
                  return (
                    <div
                      key={f.label}
                      style={{ background: "var(--color-bone-dark)", border: "1.5px solid rgba(23,23,23,0.12)", borderTop: `4px solid ${f.color}`, borderRadius: 12, padding: "16px 18px" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <FeatureIcon size={18} aria-hidden={true} />
                        <span style={{ fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: f.color }}>
                          {f.label}
                        </span>
                      </div>
                      <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "var(--color-ink-muted)", lineHeight: 1.55, margin: 0 }}>
                        {f.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
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
            <SectionEyebrow num="04" label="WHO IT'S FOR" />
            <h2
              id="who-heading"
              style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(24px,3.5vw,40px)", letterSpacing: "-0.025em", lineHeight: 1.1, color: "var(--color-ink)", margin: "0 0 clamp(28px,4vw,48px)" }}
            >
              Works for anyone with a lease.{" "}
              <em style={{ fontStyle: "italic", color: "var(--color-ink-muted)" }}>From either side of the door.</em>
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", gap: 16 }} className="who-its-for-grid">

              {/* Renters panel */}
              <div id="renter-card" className="mn-shadow-clay" style={{ background: "#1E3A5F", border: "2px solid #171717", borderRadius: 24, padding: "clamp(32px,5vw,52px)", position: "relative", overflow: "hidden" }}>
                <img src={PhotoMomBaby} aria-hidden={true} alt="" loading="lazy" decoding="async" style={{ position: "absolute", bottom: 0, right: 0, width: 220, height: 280, objectFit: "cover", objectPosition: "center 20%", opacity: 0.12, pointerEvents: "none", maskImage: "linear-gradient(to top left, rgba(0,0,0,0.6), transparent 65%)", WebkitMaskImage: "linear-gradient(to top left, rgba(0,0,0,0.6), transparent 65%)" }} />
                <div style={{ marginBottom: 24 }}>
                  <IconUser size={52} aria-hidden={true} />
                </div>
                <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(251,248,241,0.45)", marginBottom: 12 }}>FOR RENTERS</div>
                <h3 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(20px,2.5vw,28px)", letterSpacing: "-0.02em", lineHeight: 1.15, color: "var(--color-bone)", margin: "0 0 16px" }}>
                  Know your rights.<br />Sign with confidence.
                </h3>
                <ul style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(13px,1.5vw,14px)", color: "rgba(251,248,241,0.6)", lineHeight: 2, margin: "0 0 28px", paddingLeft: 0, listStyle: "none" }}>
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
              <div id="landlord-card" className="mn-shadow-sage" style={{ background: "#2a1f14", border: "2px solid #171717", borderRadius: 24, padding: "clamp(32px,5vw,52px)" }}>
                <div style={{ marginBottom: 24 }}>
                  <IconHouseSmall size={52} aria-hidden={true} />
                </div>
                <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(251,248,241,0.45)", marginBottom: 12 }}>FOR LANDLORDS</div>
                <h3 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(20px,2.5vw,28px)", letterSpacing: "-0.02em", lineHeight: 1.15, color: "var(--color-bone)", margin: "0 0 16px" }}>
                  Stay compliant.<br />Stay rock solid in court.
                </h3>
                <ul style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(13px,1.5vw,14px)", color: "rgba(251,248,241,0.6)", lineHeight: 2, margin: "0 0 28px", paddingLeft: 0, listStyle: "none" }}>
                  {["Language courts have already ruled unenforceable", "State-specific compliance gaps that expose you to liability", "What to fix before you issue - not after a dispute starts"].map(item => (
                    <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{ color: "rgba(201,122,74,0.9)", marginTop: 1, flexShrink: 0 }}>→</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/upload" className="mn-btn" style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999, padding: "14px 28px", fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 14, textDecoration: "none", backgroundColor: "var(--color-bone)", color: "#3a2a18", border: "2px solid #171717", boxShadow: "4px 4px 0 0 #171717" }}>
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
                borderRadius: 28,
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
