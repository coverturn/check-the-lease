import { useEffect } from "react";
import { Link } from "wouter";
import { SkipLink } from "@/components/SkipLink";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { IconHeart, IconCalendar, IconLightbulb, IconShield, IconScale, IconCheck, IconUser, IconMail, IconPhone, IconSparkle, IconPlus, IconDocumentSmall } from "@/components/icons/Icon";
import PhotoPackingChaos from "@assets/DTS_Chicago_to_LA_Alex_Tan_Photos_ID2721_1777779569757.jpg";
import PhotoMotionBlur from "@assets/DTS_Chicago_to_LA_Alex_Tan_Photos_ID2723_1777779569759.jpg";
import PhotoParents from "@assets/DTS_Parenthood_Daniel_Faro_ID6899.jpg";
import PhotoMomBaby from "@assets/DTS_AWAY_Daniel_Faro_ID7514.jpg";
import ProfilePhoto from "/profile.jpg";

function useScrollReveal() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      document.querySelectorAll(".ctl-reveal").forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-visible"); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".ctl-reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

const VALUES = [
  {
    n: "01",
    color: "#5A8B7A",
    title: "Be right.",
    body: "Every flag comes from real law. We'd rather say less and be correct than say more and be wrong.",
  },
  {
    n: "02",
    color: "#1E3A5F",
    title: "Your lease is yours.",
    body: "We read it in your browser. We don't store it. We don't keep it. When you close the page, it's gone.",
  },
  {
    n: "03",
    color: "#C97A4A",
    title: "Both people matter.",
    body: "Lease fights are expensive. A lease both people understand is better for everyone.",
  },
  {
    n: "04",
    color: "#7A2C3D",
    title: "Plain English works.",
    body: "Legal words and plain words are different tools. We switch between them without losing what matters.",
  },
];

export default function About() {
  useScrollReveal();

  return (
    <div className="ctl-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--color-bone)", color: "var(--color-ink)" }}>
      <SkipLink />
      <Nav />

      <main id="main" style={{ flex: 1, width: "100%" }} role="main">

        {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
        <div style={{ background: "#1E3A5F", padding: "clamp(64px,9vw,108px) clamp(24px,4vw,48px) clamp(56px,8vw,88px)", position: "relative", overflow: "hidden" }}>
          {/* ── Background icon graphic ── */}
          <div aria-hidden={true} style={{ position: "absolute", right: "clamp(30px, 8vw, 100px)", bottom: "clamp(20px, 8vh, 80px)", opacity: 0.16, pointerEvents: "none", zIndex: 0, color: "rgba(251,248,241,0.25)" }}><IconShield size={220} /></div>
          
          <div style={{ position: "absolute", top: "10%", right: "8%", animation: "star-twinkle 4s ease-in-out infinite", pointerEvents: "none", zIndex: 1, color: "#F5C547" }}>
            <IconSparkle size={32} aria-hidden={true} />
          </div>
          <div style={{ position: "absolute", bottom: "15%", left: "6%", animation: "blob-bob 9s ease-in-out infinite 3s", pointerEvents: "none", zIndex: 1, color: "#F4A480" }}>
            <IconPlus size={22} aria-hidden={true} />
          </div>

          <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(251,248,241,0.35)", marginBottom: 24 }}>About</div>
            <h1 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(40px,6.5vw,76px)", letterSpacing: "-0.04em", lineHeight: 1.0, color: "var(--color-bone)", margin: "0 0 24px" }}>
              A free lease reader<br />
              <em style={{ fontStyle: "italic", color: "rgba(251,248,241,0.38)" }}>for everyone who signs.</em>
            </h1>
            <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(251,248,241,0.55)", lineHeight: 1.7, maxWidth: 540, margin: 0 }}>
              A lease that both people understand is the best protection both get. Every clause explained. Every risk named. Every law shown.
            </p>
          </div>
        </div>

        {/* ═══ EDITORIAL PHOTO - Packing ════════════════════════════════════ */}
        <div style={{ position: "relative", overflow: "hidden", height: "clamp(220px,32vw,400px)", borderBottom: "2px solid #171717" }}>
          <img
            src={PhotoPackingChaos}
            alt="A person packing belongings into moving boxes before a move"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%", display: "block" }}
          />
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(23,23,23,0.5) 100%)" }} />
          <div style={{ position: "absolute", bottom: "clamp(16px,3vw,28px)", right: "clamp(24px,4vw,48px)", textAlign: "right" }}>
            <p style={{ fontFamily: "var(--app-font-mono)", fontSize: "clamp(9px,1vw,11px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "rgba(251,248,241,0.55)", margin: 0 }}>
              Photo: Death to Stock
            </p>
          </div>
        </div>

        {/* ═══ OPENING ════════════════════════════════════════════════════════ */}
        <section
          data-reveal className="ctl-reveal"
          style={{ padding: "clamp(56px,8vw,96px) clamp(24px,4vw,48px)", borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px,5vw,80px)", alignItems: "start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <IconHeart size={32} aria-hidden={true} />
                  <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.16em", color: "var(--color-sage)" }}>The problem</span>
                </div>
                <h2 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(26px,4vw,44px)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--color-ink)", marginBottom: 24 }}>
                  Most leases are hard<br />
                  <em style={{ fontStyle: "italic", color: "var(--color-ink-muted)" }}>to understand.</em>
                </h2>
                <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 15, color: "var(--color-ink)", lineHeight: 1.75, marginBottom: 16 }}>
                  The average lease is 35 pages of legal writing. Renters sign without a lawyer. Landlords use old templates. Both sides end up confused.
                </p>
                <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 15, color: "var(--color-ink)", lineHeight: 1.75 }}>
                  Renters don't know their rights. Landlords don't know which clauses work. Check the Lease helps both sides understand.
                </p>
              </div>
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    { n: "68%", label: "of US renters have signed a lease they didn't fully understand", color: "#7A2C3D" },
                    { n: "50", label: "states, each with different tenant protection laws", color: "#1E3A5F" },
                    { n: "$0", label: "is what Check the Lease costs to use", color: "#5A8B7A" },
                  ].map(({ n, label, color }) => (
                    <div key={n} style={{ border: "2px solid #171717", borderRadius: 18, padding: "clamp(20px,3vw,28px)", boxShadow: `5px 5px 0 0 ${color}`, backgroundColor: "var(--color-bone)" }}>
                      <div style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(40px,6vw,60px)", color, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 10 }}>{n}</div>
                      <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "var(--color-ink)", lineHeight: 1.5 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ THE APPROACH ═══════════════════════════════════════════════════ */}
        <section
          data-reveal className="ctl-reveal"
          style={{ padding: "clamp(56px,8vw,96px) clamp(24px,4vw,48px)", backgroundColor: "var(--color-bone-dark)", borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <IconLightbulb size={32} aria-hidden={true} />
              <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.16em", color: "var(--color-clay)" }}>Our approach</span>
            </div>
            <h2 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(26px,4vw,44px)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--color-ink)", marginBottom: 32 }}>
              We don't summarize.<br />
              <em style={{ fontStyle: "italic" }}>We translate.</em>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))", gap: 20, marginBottom: 36 }}>
              {[
                { icon: "§", title: "Real law", body: "Every flag shows you the real law for your state. Not guesses. Real laws.", color: "#1E3A5F" },
                { icon: "↔", title: "Both sides matter", body: "We show issues for both renters and landlords. A lease both people understand is better for everyone.", color: "#5A8B7A" },
                { icon: "⊘", title: "Nothing stored", body: "Your lease is read in your browser and deleted. We don't keep it. Your housing is your business.", color: "#C97A4A" },
                { icon: "✓", title: "Facts, not advice", body: "We tell you what the lease says and what the law says. We don't tell you what to do.", color: "#7A2C3D" },
              ].map(({ icon, title, body, color }) => (
                <div key={title} style={{ backgroundColor: "var(--color-bone)", border: "2px solid #171717", borderRadius: 18, padding: "clamp(22px,3vw,32px)", boxShadow: "5px 5px 0 0 #171717" }}>
                  <div style={{ fontFamily: "var(--app-font-serif)", fontSize: 32, color, marginBottom: 16, lineHeight: 1 }} aria-hidden="true">{icon}</div>
                  <h3 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: 20, letterSpacing: "-0.02em", color: "var(--color-ink)", marginBottom: 10 }}>{title}</h3>
                  <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "var(--color-ink-muted)", lineHeight: 1.65 }}>{body}</p>
                </div>
              ))}
            </div>
            <Link
              href="/how-it-works"
              style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, fontWeight: 600, color: "var(--color-ink-blue)", textDecoration: "underline", textUnderlineOffset: 4 }}
            >
              Read the full technical methodology →
            </Link>
          </div>
        </section>

        {/* ═══ VALUES ═════════════════════════════════════════════════════════ */}
        <section
          data-reveal className="ctl-reveal"
          style={{ padding: "clamp(56px,8vw,96px) clamp(24px,4vw,48px)", borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <IconScale size={32} aria-hidden={true} />
              <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.16em", color: "var(--color-sage)" }}>What we believe</span>
            </div>
            <h2 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(26px,4vw,44px)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--color-ink)", marginBottom: 48 }}>
              Four principles we don't compromise on.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, borderRadius: 20, overflow: "hidden", border: "2.5px solid #171717", boxShadow: "7px 7px 0 0 #171717", marginBottom: 20 }}>
              <div style={{ position: "relative", minHeight: 200, gridColumn: "1 / -1" }}>
                <img src={PhotoParents} alt="A couple holding a baby, representing families protected by a fair lease" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 25%", display: "block", maxHeight: 220 }} />
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 20%, rgba(251,248,241,0.92) 100%)" }} />
                <div style={{ position: "absolute", bottom: 20, left: 28, fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: "clamp(15px,1.8vw,19px)", color: "var(--color-ink)", letterSpacing: "-0.02em" }}>
                  Clear agreements, understood by both parties.
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, border: "2.5px solid #171717", borderRadius: 20, overflow: "hidden", boxShadow: "7px 7px 0 0 #171717" }}>
              {VALUES.map(({ n, color, title, body }, i) => (
                <div key={n} style={{ padding: "clamp(28px,4vw,44px)", backgroundColor: "var(--color-bone)", borderRight: i % 2 === 0 ? "1px solid var(--border-soft)" : "none", borderBottom: i < 2 ? "1px solid var(--border-soft)" : "none", position: "relative", overflow: "hidden" }}>
                  <div aria-hidden="true" style={{ fontFamily: "var(--app-font-serif)", fontWeight: 900, fontSize: 100, color: "rgba(23,23,23,0.04)", lineHeight: 1, position: "absolute", bottom: -12, right: 16, userSelect: "none", pointerEvents: "none" }}>{n}</div>
                  <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color, marginBottom: 14 }}>{n}</div>
                  <h3 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(18px,2.5vw,24px)", letterSpacing: "-0.02em", color: "var(--color-ink)", marginBottom: 12, lineHeight: 1.25, position: "relative" }}>{title}</h3>
                  <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "var(--color-ink-muted)", lineHeight: 1.65, position: "relative" }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ EDITORIAL - Mom + Baby ══════════════════════════════════════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }} className="ctl-mom-editorial">
          <div style={{ position: "relative", minHeight: 320 }}>
            <img
              src={PhotoMomBaby}
              alt="A parent holding a baby while reviewing documents in a new home"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 25%", display: "block", position: "absolute", inset: 0 }}
            />
          </div>
          <div style={{ padding: "clamp(40px,6vw,72px) clamp(28px,4vw,56px)", backgroundColor: "var(--color-bone-dark)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--color-sage)", marginBottom: 16 }}>Who this is for</div>
            <p style={{ fontFamily: "var(--app-font-serif)", fontSize: "clamp(18px,2.5vw,26px)", fontWeight: 500, letterSpacing: "-0.025em", lineHeight: 1.35, color: "var(--color-ink)", margin: "0 0 20px" }}>
              Everyone who touches a lease deserves to understand it.
            </p>
            <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "var(--color-ink-muted)", lineHeight: 1.7, margin: "0 0 16px" }}>
              For renters, Check the Lease surfaces what the law protects you from - illegal clauses, rights your landlord cannot waive, and what to ask before you sign. For landlords, it identifies language courts have already voided, compliance gaps by state, and what to fix before a dispute starts. A lease that works for both sides is the best protection either side can have.
            </p>
            <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "var(--color-ink-muted)", lineHeight: 1.7, margin: 0 }}>
              If you need more than an AI analysis can give - a real attorney, a legal aid clinic, a tenant union - our{" "}
              <a href="/resources" style={{ color: "var(--color-sage)", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3 }}>free resources directory</a>{" "}
              covers all 50 states, DC, and US territories.
            </p>
          </div>
        </div>

        {/* ═══ PRIVACY COMMITMENT ═════════════════════════════════════════════ */}
        <section
          data-reveal className="ctl-reveal"
          style={{ padding: "clamp(56px,8vw,96px) clamp(24px,4vw,48px)", backgroundColor: "#1E3A5F", position: "relative", overflow: "hidden" }}
        >
          <svg aria-hidden="true" width="280" height="280" viewBox="0 0 280 280" style={{ position: "absolute", right: -40, top: -40, opacity: 0.04, pointerEvents: "none" }}>
            <circle cx="140" cy="140" r="130" stroke="white" strokeWidth="2" fill="none"/>
            <circle cx="140" cy="140" r="90" stroke="white" strokeWidth="2" fill="none"/>
            <circle cx="140" cy="140" r="50" stroke="white" strokeWidth="2" fill="none"/>
          </svg>
          <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <IconShield size={32} aria-hidden={true} style={{ color: "rgba(251,248,241,0.7)" }} />
              <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.16em", color: "rgba(251,248,241,0.35)" }}>Privacy</span>
            </div>
            <h2 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(28px,4.5vw,52px)", letterSpacing: "-0.035em", lineHeight: 1.08, color: "var(--color-bone)", marginBottom: 24 }}>
              Your lease never<br />leaves your browser.
            </h2>
            <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 15, color: "rgba(251,248,241,0.6)", lineHeight: 1.75, maxWidth: 520, marginBottom: 36 }}>
              We deliberately chose not to store lease documents. Your housing situation - your income details, your landlord's name, your address - is yours. We have no database to breach because we store nothing.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {["No account required", "No email collected", "No server storage", "No tracking cookies", "Session-only processing", "PDF discarded after analysis"].map((item) => (
                <div key={item} style={{ fontFamily: "var(--app-font-sans)", fontSize: 12, fontWeight: 500, color: "rgba(251,248,241,0.85)", backgroundColor: "rgba(251,248,241,0.1)", border: "1px solid rgba(251,248,241,0.15)", borderRadius: 999, padding: "7px 16px" }}>
                  ✓ {item}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 32 }}>
              <Link href="/privacy" style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, fontWeight: 600, color: "rgba(251,248,241,0.6)", textDecoration: "underline", textUnderlineOffset: 4 }}>
                Read our full privacy policy →
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ BUILDER NOTE ═══════════════════════════════════════════════════ */}
        <section
          data-reveal className="ctl-reveal"
          style={{ padding: "clamp(56px,8vw,96px) clamp(24px,4vw,48px)", borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <IconUser size={32} aria-hidden={true} />
              <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.16em", color: "var(--color-clay)" }}>The story</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "clamp(24px,4vw,48px)", alignItems: "start" }}>
              <div style={{ width: 200, borderRadius: 16, overflow: "hidden", border: "2.5px solid #171717", boxShadow: "4px 4px 0 0 #171717", flexShrink: 0, aspectRatio: "1/1" }} className="ctl-story-photo">
                <img
                  src={ProfilePhoto}
                  alt="Ishmael McCalla, founder of Check the Lease"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
                />
              </div>
              <div>
                <h2 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(22px,3.5vw,38px)", letterSpacing: "-0.03em", lineHeight: 1.15, color: "var(--color-ink)", marginBottom: 20 }}>
                  Built because both sides<br />deserve a fair read.
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <p style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: "clamp(15px,1.8vw,18px)", color: "var(--color-ink)", lineHeight: 1.7 }}>
                    "I built Check the Lease because no one should have to sign 35 pages of legal language without help. Renters and landlords both deserve a fair read. The technology has been here for years. Now it's free."
                  </p>
                  <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 15, color: "var(--color-ink)", lineHeight: 1.75 }}>
                    Check the Lease started as a Buildathon project in May 2026. The goal was simple: take a problem millions of people face (opaque lease agreements) and use AI to level the playing field. Not with a chatbot. Not with vague summaries. With specific, cited, plain-English analysis that treats users as capable adults.
                  </p>
                  <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 15, color: "var(--color-ink)", lineHeight: 1.75 }}>
                    The design system was built from scratch to match the editorial seriousness the subject deserves. Lease disputes ruin credit scores, housing situations, and relationships. This tool isn't a toy.
                  </p>
                  <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "var(--color-ink-muted)", marginTop: 4 }}>- Ishmael, May 2026</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ HOW I BUILT IT ═════════════════════════════════════════════════ */}
        <section
          data-reveal className="ctl-reveal"
          style={{ padding: "clamp(56px,8vw,96px) clamp(24px,4vw,48px)", backgroundColor: "#F2EDE2", borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <IconCalendar size={32} aria-hidden={true} style={{ color: "var(--color-sage)" }} />
              <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.16em", color: "var(--color-clay)" }}>24-hour build</span>
            </div>
            <h2 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(26px,4vw,44px)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--color-ink)", marginBottom: 32 }}>
              Built in 24 hours<br />with Replit Agent.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20, marginBottom: 32 }}>
              {[
                { hours: "0 to 4", title: "The prompt", body: "Started with a single Replit Agent prompt: 'build a free AI lease reader for US renters that cites the actual state law.' First version was rough. A dropzone, a paste field, raw text output." },
                { hours: "4 to 10", title: "Brand from scratch", body: "Rebuilt the design from scratch. Cream, sage, clay, and Fraunces italic so it didn't feel like every other Tailwind hackathon site. Hand-coded SVG icons because I wanted them to have personality." },
                { hours: "10 to 18", title: "The hard part", body: "Prompted Agent through 11 iterations to get the results page right. Four tabs, severity grouping, statute citations, action plan checklist. Most lease readers give you a wall of red flags. This one gives you a punch list." },
                { hours: "18 to 24", title: "Legal and chat", body: "Added a 50-state legal aid directory because renters most likely to get burned are least likely to have a lawyer's number. Then built a chatbot that knows your state's rules and answers questions in plain English. Free, no account." },
              ].map(({ hours, title, body }) => (
                <div key={hours} style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 20, alignItems: "flex-start", paddingBottom: 20, borderBottom: "1px solid rgba(23,23,23,0.1)" }}>
                  <div>
                    <div style={{ fontFamily: "var(--app-font-serif)", fontWeight: 700, fontSize: 16, color: "var(--color-sage)", letterSpacing: "-0.02em" }}>{hours}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-ink)", marginBottom: 6 }}>{title}</div>
                    <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "var(--color-ink-muted)", lineHeight: 1.65, margin: 0 }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: "clamp(14px,1.5vw,16px)", color: "var(--color-ink-muted)", margin: 0 }}>
              Built May 2-3, 2026 for the 10 Year Buildathon. Ishmael
            </p>
          </div>
        </section>

        {/* ═══ CTA ════════════════════════════════════════════════════════════ */}
        <section
          data-reveal className="ctl-reveal"
          style={{ padding: "clamp(56px,8vw,96px) clamp(24px,4vw,48px)" }}
        >
          <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: "clamp(13px,1.5vw,15px)", color: "var(--color-ink-muted)", marginBottom: 24 }}>
              Ready to read your lease?
            </div>
            <h2 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(28px,4.5vw,52px)", letterSpacing: "-0.035em", color: "var(--color-ink)", marginBottom: 32, lineHeight: 1.1 }}>
              Upload your PDF.<br />Get clarity in 15 seconds.
            </h2>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/upload" style={{ display: "inline-block", borderRadius: 999, padding: "14px 32px", fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 15, textDecoration: "none", backgroundColor: "#5A8B7A", color: "#FBF8F1", border: "2.5px solid #171717", boxShadow: "5px 5px 0 0 #171717" }}>
                Read my lease →
              </Link>
              <Link href="/how-it-works" style={{ display: "inline-block", borderRadius: 999, padding: "14px 32px", fontFamily: "var(--app-font-sans)", fontWeight: 500, fontSize: 15, textDecoration: "none", backgroundColor: "transparent", color: "var(--color-ink)", border: "2px solid rgba(23,23,23,0.25)" }}>
                How it works →
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
