import { useEffect } from "react";
import { Link } from "wouter";
import { SkipLink } from "@/components/SkipLink";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import PhotoTruck from "@assets/DTS_Chicago_to_LA_Alex_Tan_Photos_ID2722_1777779569758.jpg";
import PhotoSteps from "@assets/DTS_Chicago_to_LA_Alex_Tan_Photos_ID2720_1777779569750.jpg";

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

const STEPS = [
  {
    n: "01",
    color: "#1E3A5F",
    title: "You upload the PDF.",
    subtitle: "Your browser reads it.",
    body: "Drop your lease onto the page. Your browser reads it. The file never goes to our servers. Only the text gets sent for reading.",
    detail: "Max file size: 25 MB. Works with text-based PDFs. If your PDF is a scanned image, use a free OCR tool first.",
    icon: (
      <svg viewBox="0 0 48 56" width="48" height="56" fill="none" aria-hidden="true">
        <rect x="4" y="4" width="32" height="48" rx="4" fill="var(--color-bone)" stroke="#1E3A5F" strokeWidth="2.5"/>
        <path d="M28 4 L28 16 L36 16" fill="none" stroke="#1E3A5F" strokeWidth="2.5" strokeLinejoin="round"/>
        <path d="M14 34 L24 24 L34 34" fill="none" stroke="#1E3A5F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="24" y1="24" x2="24" y2="42" stroke="#1E3A5F" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    n: "02",
    color: "#5A8B7A",
    title: "We pull out the text.",
    subtitle: "Every page, every clause.",
    body: "We read the whole lease. Every page. Every addendum. Nothing gets skipped. All the text goes to the AI to read.",
    detail: "We keep the paragraphs and parts together so the AI sees the lease the way you would read it.",
    icon: (
      <svg viewBox="0 0 48 48" width="48" height="48" fill="none" aria-hidden="true">
        <rect x="4" y="8" width="40" height="32" rx="4" stroke="#5A8B7A" strokeWidth="2.5" fill="none"/>
        <line x1="12" y1="18" x2="36" y2="18" stroke="#5A8B7A" strokeWidth="2" strokeLinecap="round"/>
        <line x1="12" y1="24" x2="36" y2="24" stroke="#5A8B7A" strokeWidth="2" strokeLinecap="round"/>
        <line x1="12" y1="30" x2="26" y2="30" stroke="#5A8B7A" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="38" cy="38" r="6" fill="#5A8B7A"/>
        <path d="M35 38 L37 40 L41 36" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    n: "03",
    color: "#C97A4A",
    title: "The AI reads it.",
    subtitle: "Finds problems and questions.",
    body: "An AI reads each clause. It finds key terms, spots clauses that break state law, finds missing protections, and makes questions you should ask.",
    detail: "The AI knows your state, your role, and whether you've signed yet. It's careful. It only flags things with real reasons.",
    icon: (
      <svg viewBox="0 0 48 48" width="48" height="48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="18" stroke="#C97A4A" strokeWidth="2.5" fill="none"/>
        <path d="M16 24 C16 20 20 16 24 16 C28 16 32 20 32 24" stroke="#C97A4A" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <circle cx="19" cy="28" r="2.5" fill="#C97A4A"/>
        <circle cx="29" cy="28" r="2.5" fill="#C97A4A"/>
        <path d="M20 35 C22 37 26 37 28 35" stroke="#C97A4A" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  {
    n: "04",
    color: "#7A2C3D",
    title: "Your state's law is checked.",
    subtitle: "Real law citations.",
    body: "Every flag shows the real law for your state. Not guesses. Real laws. We cite them so you can check.",
    detail: "Laws are different in each state. What's okay in Texas might be illegal in California. We use the law for your state.",
    icon: (
      <svg viewBox="0 0 48 48" width="48" height="48" fill="none" aria-hidden="true">
        <rect x="8" y="4" width="32" height="40" rx="3" stroke="#7A2C3D" strokeWidth="2.5" fill="none"/>
        <path d="M16 16 L32 16" stroke="#7A2C3D" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 22 L32 22" stroke="#7A2C3D" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 28 L24 28" stroke="#7A2C3D" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="34" cy="38" r="6" fill="#7A2C3D"/>
        <path d="M31 38 L33 40 L37 36" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    n: "05",
    color: "#7A5A8B",
    title: "You get your results.",
    subtitle: "Four simple sections.",
    body: "You get four sections: key terms, problems, missing protections, and questions to ask. Each one is easy to scan.",
    detail: "Results stay in your browser only. When you close the page, they're gone. We never save them. You get your answer in 5 to 15 seconds.",
    icon: (
      <svg viewBox="0 0 48 48" width="48" height="48" fill="none" aria-hidden="true">
        <rect x="4" y="4" width="40" height="40" rx="6" stroke="#7A5A8B" strokeWidth="2.5" fill="none"/>
        <rect x="10" y="14" width="28" height="6" rx="2" fill="#7A5A8B" fillOpacity="0.15" stroke="#7A5A8B" strokeWidth="1.5"/>
        <rect x="10" y="24" width="20" height="6" rx="2" fill="#7A5A8B" fillOpacity="0.15" stroke="#7A5A8B" strokeWidth="1.5"/>
        <rect x="10" y="34" width="24" height="6" rx="2" fill="#7A5A8B" fillOpacity="0.15" stroke="#7A5A8B" strokeWidth="1.5"/>
      </svg>
    ),
  },
];

const WHAT_WE_LOOK_FOR = [
  { label: "Key terms", desc: "Rent amount, security deposit, late fees, lease term, renewal conditions, entry notice requirements, pet policies, utility responsibilities.", color: "#5A8B7A" },
  { label: "Risky clauses", desc: "Clauses that conflict with state law - excessive security deposits, illegal self-help eviction language, overly broad entry rights, unenforceable late-fee structures.", color: "#7A2C3D" },
  { label: "Missing protections", desc: "Legally sound clauses that are missing - deposit-return timelines, habitability warranties, repair-request channels, move-out documentation procedures.", color: "#C97A4A" },
  { label: "Questions to ask", desc: "Specific questions tailored to your lease and situation - before signing, or post-signing documentation and rights to be aware of.", color: "#1E3A5F" },
];

export default function HowItWorks() {
  useScrollReveal();

  return (
    <div className="ctl-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--color-bone)", color: "var(--color-ink)" }}>
      <SkipLink />
      <Nav />

      <main id="main" style={{ flex: 1, width: "100%" }} role="main">

        {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
        <div style={{ background: "#1E3A5F", padding: "clamp(64px,9vw,108px) clamp(24px,4vw,48px) clamp(56px,8vw,88px)", position: "relative", overflow: "hidden" }}>
          <svg aria-hidden="true" width="28" height="28" viewBox="0 0 28 28" style={{ position: "absolute", top: "15%", right: "6%", animation: "star-twinkle 4s ease-in-out infinite", pointerEvents: "none" }}>
            <path d="M14 2 L16 10 L24 13 L16 16 L14 26 L12 16 L4 13 L12 10 Z" fill="#F5C547" stroke="#171717" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" style={{ position: "absolute", bottom: "20%", left: "4%", animation: "blob-bob 10s ease-in-out infinite 2s", pointerEvents: "none" }}>
            <circle cx="10" cy="10" r="7" fill="#D4B8E5" stroke="#171717" strokeWidth="2"/>
          </svg>
          <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(251,248,241,0.35)", marginBottom: 24 }}>Methodology</div>
            <h1 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(40px,6.5vw,76px)", letterSpacing: "-0.04em", lineHeight: 1.0, color: "var(--color-bone)", margin: "0 0 24px" }}>
              The read<br />
              <em style={{ fontStyle: "italic", color: "rgba(251,248,241,0.38)" }}>behind the read.</em>
            </h1>
            <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(251,248,241,0.55)", lineHeight: 1.7, maxWidth: 540, margin: 0 }}>
              Exactly how Check the Lease works - from PDF upload to plain-English results. No mystery, no magic. Just a transparent look at what the AI does and why.
            </p>
          </div>
        </div>

        {/* ═══ PHOTO STRIP ════════════════════════════════════════════════════ */}
        <div style={{ width: "100%", height: "clamp(180px,22vw,300px)", overflow: "hidden", position: "relative", borderBottom: "2.5px solid #171717" }}>
          <img src={PhotoTruck} alt="A moving truck in a city alley, life in transit" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%", display: "block" }} />
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(30,58,95,0.55) 0%, transparent 50%, rgba(30,58,95,0.3) 100%)" }} />
          <div style={{ position: "absolute", left: "clamp(24px,4vw,48px)", bottom: "clamp(18px,3vw,32px)", fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: "clamp(14px,1.8vw,20px)", color: "rgba(251,248,241,0.9)", letterSpacing: "-0.02em", maxWidth: 420 }}>
            Every address change comes with a lease worth reading.
          </div>
        </div>

        {/* ═══ STEP BY STEP ═══════════════════════════════════════════════════ */}
        <section
          data-reveal className="ctl-reveal"
          aria-labelledby="steps-heading"
          style={{ padding: "clamp(56px,8vw,96px) clamp(24px,4vw,48px)", borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#5A8B7A", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "2px 2px 0 0 #171717" }}>
                <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 11, fontWeight: 700, color: "white" }}>05</span>
              </div>
              <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.16em", color: "var(--color-sage)" }}>The process</span>
            </div>
            <h2 id="steps-heading" style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(26px,4vw,44px)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--color-ink)", marginBottom: 56 }}>
              Five steps. Under 15 seconds.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {STEPS.map(({ n, color, title, subtitle, body, detail, icon }, i) => (
                <div key={n} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "clamp(20px,3vw,40px)", paddingBottom: i < STEPS.length - 1 ? "clamp(36px,5vw,56px)" : 0, marginBottom: i < STEPS.length - 1 ? "clamp(36px,5vw,56px)" : 0, borderBottom: i < STEPS.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                  {/* Icon column */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                    <div style={{ width: 72, height: 72, borderRadius: 20, border: `2.5px solid ${color}`, backgroundColor: `${color}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `4px 4px 0 0 ${color}` }}>
                      {icon}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div style={{ width: 2, flex: 1, backgroundColor: "rgba(23,23,23,0.1)", marginTop: 16, minHeight: 32 }} />
                    )}
                  </div>
                  {/* Content */}
                  <div style={{ paddingTop: 12 }}>
                    <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color, marginBottom: 8 }}>Step {n}</div>
                    <h3 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(20px,3vw,28px)", letterSpacing: "-0.025em", color: "var(--color-ink)", marginBottom: 4 }}>{title}</h3>
                    <div style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: 15, color: "var(--color-ink-muted)", marginBottom: 16 }}>{subtitle}</div>
                    <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 15, color: "var(--color-ink)", lineHeight: 1.75, marginBottom: 14 }}>{body}</p>
                    <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "var(--color-ink-muted)", lineHeight: 1.65, padding: "12px 16px", backgroundColor: "rgba(23,23,23,0.04)", borderRadius: 10, borderLeft: `3px solid ${color}40` }}>
                      {detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ WHAT WE LOOK FOR ═══════════════════════════════════════════════ */}
        <section
          data-reveal className="ctl-reveal"
          style={{ padding: "clamp(56px,8vw,96px) clamp(24px,4vw,48px)", backgroundColor: "var(--color-bone-dark)", borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#C97A4A", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "2px 2px 0 0 #171717" }}>
                <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 11, fontWeight: 700, color: "white" }}>04</span>
              </div>
              <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.16em", color: "var(--color-clay)" }}>Output structure</span>
            </div>
            <h2 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(26px,4vw,44px)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--color-ink)", marginBottom: 40 }}>
              Four sections, every analysis.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,340px), 1fr))", gap: 16 }}>
              {WHAT_WE_LOOK_FOR.map(({ label, desc, color }, i) => (
                <div key={label} style={{ backgroundColor: "var(--color-bone)", border: "2.5px solid #171717", borderRadius: 18, padding: "clamp(24px,3.5vw,36px)", boxShadow: `5px 5px 0 0 ${color}`, position: "relative", overflow: "hidden" }}>
                  <div aria-hidden="true" style={{ position: "absolute", bottom: -12, right: 16, fontFamily: "var(--app-font-serif)", fontWeight: 900, fontSize: 80, color: "rgba(23,23,23,0.04)", userSelect: "none" }}>0{i + 1}</div>
                  <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color, marginBottom: 14 }}>Section 0{i + 1}</div>
                  <h3 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(18px,2.5vw,22px)", letterSpacing: "-0.02em", color: "var(--color-ink)", marginBottom: 12, position: "relative" }}>{label}</h3>
                  <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "var(--color-ink-muted)", lineHeight: 1.65, position: "relative" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ EDITORIAL BREAK ════════════════════════════════════════════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "5fr 7fr", border: "2.5px solid #171717", borderLeft: "none", borderRight: "none" }} className="ctl-hiw-editorial">
          <div style={{ padding: "clamp(40px,6vw,72px) clamp(24px,4vw,48px)", backgroundColor: "var(--color-bone)", display: "flex", flexDirection: "column", justifyContent: "center", borderRight: "2.5px solid #171717" }}>
            <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--color-sage)", marginBottom: 20 }}>What this is</div>
            <p style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(18px,2.4vw,28px)", letterSpacing: "-0.02em", lineHeight: 1.3, color: "var(--color-ink)", margin: "0 0 20px" }}>
              A starting point for your review - not a substitute for it.
            </p>
            <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(13px,1.4vw,15px)", color: "var(--color-ink-muted)", lineHeight: 1.7, margin: 0 }}>
              We flag what the model finds. You decide what to do about it. Reading your lease still matters.
            </p>
          </div>
          <div style={{ position: "relative", minHeight: 260, overflow: "hidden" }}>
            <img src={PhotoSteps} alt="Stone steps leading to a brownstone apartment entrance" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block", position: "absolute", inset: 0 }} />
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(30,58,95,0.18) 0%, transparent 60%)" }} />
          </div>
        </div>

        {/* ═══ LIMITATIONS ════════════════════════════════════════════════════ */}
        <section
          data-reveal className="ctl-reveal"
          style={{ padding: "clamp(56px,8vw,96px) clamp(24px,4vw,48px)", borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#7A2C3D", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "2px 2px 0 0 #171717" }}>
                <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 11, fontWeight: 700, color: "white" }}>!</span>
              </div>
              <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.16em", color: "var(--color-wine)" }}>Honest limitations</span>
            </div>
            <h2 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(26px,4vw,44px)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--color-ink)", marginBottom: 32 }}>
              What we can't do.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { title: "We're not lawyers. This isn't legal advice.", body: "Everything Check the Lease surfaces is legal information - accurate, cited, and useful - but it is not a substitute for advice from a qualified attorney. If you face an eviction, a lease dispute, or serious financial exposure, speak to a lawyer.", color: "#7A2C3D" },
                { title: "We can't read scanned documents.", body: "If your lease is a scanned image (not a text-based PDF), our parser can't extract the text. Run it through a free OCR tool like ilovepdf.com or Adobe Acrobat first. We'll tell you if the document appears to be empty.", color: "#C97A4A" },
                { title: "AI can miss things. You should read your lease.", body: "Large language models are powerful but imperfect. We may miss unusual clauses or misread ambiguous language. Our analysis is a starting point for your review, not a complete substitute for it.", color: "#8B6A3A" },
                { title: "State law changes. We may lag behind.", body: "Tenant protection laws are updated by legislatures. Our citations are based on training data that has a knowledge cutoff. For recent legislative changes, verify with your state's official resources.", color: "#3D6A8B" },
              ].map(({ title, body, color }) => (
                <div key={title} style={{ borderLeft: `4px solid ${color}`, borderRadius: 14, padding: "22px 24px", backgroundColor: `${color}08`, border: `1.5px solid ${color}28`, borderLeftWidth: 4, borderLeftColor: color }}>
                  <h3 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: 18, letterSpacing: "-0.01em", color: "var(--color-ink)", marginBottom: 10 }}>{title}</h3>
                  <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "var(--color-ink)", lineHeight: 1.65 }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CTA ════════════════════════════════════════════════════════════ */}
        <section
          data-reveal className="ctl-reveal"
          style={{ padding: "clamp(56px,8vw,96px) clamp(24px,4vw,48px)" }}
        >
          <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 32, alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(24px,3.5vw,40px)", letterSpacing: "-0.03em", color: "var(--color-ink)", marginBottom: 12 }}>
                See it in action.
              </h2>
              <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "var(--color-ink-muted)", lineHeight: 1.65, maxWidth: 380 }}>
                Try the sample California lease, or upload your own. The full analysis runs in under 15 seconds.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/upload" style={{ display: "inline-block", borderRadius: 999, padding: "14px 32px", fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 15, textDecoration: "none", backgroundColor: "#5A8B7A", color: "#FBF8F1", border: "2.5px solid #171717", boxShadow: "5px 5px 0 0 #171717" }}>
                Read my lease →
              </Link>
              <Link href="/about" style={{ display: "inline-block", borderRadius: 999, padding: "14px 32px", fontFamily: "var(--app-font-sans)", fontWeight: 500, fontSize: 15, textDecoration: "none", color: "var(--color-ink)", border: "2px solid rgba(23,23,23,0.25)" }}>
                About this project →
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
