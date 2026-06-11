import { useEffect } from "react";
import { Link } from "wouter";
import { SkipLink } from "@/components/SkipLink";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

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

const LAST_UPDATED = "May 2026";

const SECTION_COLORS = [
  "#5A8B7A", "#1E3A5F", "#C97A4A", "#7A2C3D",
  "#5A8B7A", "#1E3A5F", "#C97A4A", "#7A2C3D", "#5A8B7A",
];

function PolicySection({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  const idx = parseInt(n, 10) - 1;
  const color = SECTION_COLORS[idx] ?? "#5A8B7A";
  return (
    <section style={{ paddingBottom: "clamp(36px,5vw,52px)", marginBottom: "clamp(36px,5vw,52px)", borderBottom: "1px solid var(--border-subtle)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `2px 2px 0 0 #171717` }}>
          <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 11, fontWeight: 700, color: "white", lineHeight: 1 }}>{n}</span>
        </div>
        <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color }}>Section {n}</span>
      </div>
      <h2 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(22px,3vw,32px)", letterSpacing: "-0.025em", color: "var(--color-ink)", marginBottom: 20, lineHeight: 1.15 }}>{title}</h2>
      <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 15, color: "var(--color-ink)", lineHeight: 1.8 }}>
        {children}
      </div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ marginBottom: 16, color: "var(--color-ink)", lineHeight: 1.8 }}>{children}</p>;
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: "0 0 16px", paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 0 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: i < items.length - 1 ? "1px solid rgba(23,23,23,0.07)" : "none" }}>
          <span style={{ color: "var(--color-sage)", fontWeight: 700, flexShrink: 0, marginTop: 3, fontSize: 12 }}>→</span>
          <span style={{ fontSize: 14, lineHeight: 1.7 }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Privacy() {
  useScrollReveal();

  return (
    <div className="ctl-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--color-bone)", color: "var(--color-ink)" }}>
      <SkipLink />
      <Nav />

      <main id="main" style={{ flex: 1, width: "100%" }} role="main">

        {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
        <div style={{ background: "#1E3A5F", padding: "clamp(64px,9vw,96px) clamp(24px,4vw,48px) clamp(52px,7vw,72px)", position: "relative", overflow: "hidden" }}>
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 22 22" style={{ position: "absolute", top: "18%", right: "7%", animation: "star-twinkle 5s ease-in-out infinite", pointerEvents: "none" }}>
            <path d="M11 2 L13 8 L19 11 L13 14 L11 20 L9 14 L3 11 L9 8 Z" fill="#F5C547" stroke="#171717" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
          <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(251,248,241,0.35)", marginBottom: 24 }}>Privacy Policy</div>
            <h1 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(40px,6vw,72px)", letterSpacing: "-0.04em", lineHeight: 1.0, color: "var(--color-bone)", margin: "0 0 24px" }}>
              We built privacy in<br />
              <em style={{ fontStyle: "italic", color: "rgba(251,248,241,0.38)" }}>from the start.</em>
            </h1>
            <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(14px,1.5vw,17px)", color: "rgba(251,248,241,0.55)", lineHeight: 1.7, maxWidth: 520, marginBottom: 32 }}>
              Your lease document is personal. We treat it that way. That's why we designed a system that processes everything in memory and stores nothing.
            </p>
            <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 10, color: "rgba(251,248,241,0.28)", letterSpacing: "0.06em" }}>
              Last updated: {LAST_UPDATED}
            </div>
          </div>
        </div>

        {/* ═══ SUMMARY CARDS ═════════════════════════════════════════════════ */}
        <div
          data-reveal className="ctl-reveal"
          style={{ padding: "clamp(40px,6vw,64px) clamp(24px,4vw,48px)", backgroundColor: "var(--color-bone-dark)", borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#5A8B7A", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "2px 2px 0 0 #171717" }}>
                <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 12, fontWeight: 700, color: "white" }}>↑</span>
              </div>
              <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "#5A8B7A" }}>The short version</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))", gap: 14 }}>
              {[
                { icon: "⊘", label: "No lease storage", desc: "Your PDF is processed in-memory only. Never written to disk or database.", color: "#5A8B7A" },
                { icon: "◯", label: "No account needed", desc: "No email, no username, no password. We don't know who you are.", color: "#1E3A5F" },
                { icon: "⊠", label: "No tracking", desc: "No advertising cookies, no analytics pixels, no behavioral tracking.", color: "#C97A4A" },
                { icon: "↻", label: "Session only", desc: "Results live in your browser's session storage. Close the tab and everything is deleted.", color: "#7A5A8B" },
              ].map(({ icon, label, desc, color }) => (
                <div key={label} style={{ border: "2.5px solid #171717", borderRadius: 18, padding: "22px 24px", backgroundColor: "var(--color-bone)", boxShadow: `5px 5px 0 0 ${color}` }}>
                  <div style={{ fontFamily: "var(--app-font-serif)", fontSize: 28, color, marginBottom: 12, lineHeight: 1 }} aria-hidden="true">{icon}</div>
                  <div style={{ fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 14, color: "var(--color-ink)", marginBottom: 6 }}>{label}</div>
                  <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "var(--color-ink-muted)", lineHeight: 1.65 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ FULL POLICY TEXT ══════════════════════════════════════════════ */}
        <div data-reveal className="ctl-reveal" style={{ padding: "clamp(48px,7vw,80px) clamp(24px,4vw,48px)" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>

            <PolicySection n="01" title="What we collect">
              <P>
                Check the Lease is designed to collect as little as possible. When you use this service, the only data we receive is:
              </P>
              <Ul items={[
                "The text content extracted from your lease PDF (sent to our analysis endpoint for AI processing, then discarded).",
                "The intake form data you provide: your state, your role (renter or landlord), your stage (pre- or post-signing), and the optional context flags you select (parent, housing aid, student, reviewing for someone else).",
                "Standard server request logs (IP address, timestamp, HTTP method) that are retained for up to 30 days for security and error monitoring only.",
              ]} />
              <P>
                We do not collect your name, email address, physical address, financial information, or any other personally identifiable information.
              </P>
            </PolicySection>

            <PolicySection n="02" title="Your lease document">
              <P>
                Your PDF lease document is handled as follows:
              </P>
              <Ul items={[
                "It is parsed in your browser using JavaScript's File API. The raw bytes never leave your device in their original form.",
                "The extracted text content is sent over HTTPS to our server for AI analysis.",
                "The server passes this text to an AI provider (Anthropic's Claude) for analysis. This transmission is governed by Anthropic's data processing agreements.",
                "Neither our server nor the AI provider retains your lease text after the analysis request completes.",
                "The analysis results are returned to your browser and stored in session storage only. This is a browser-level, temporary, per-tab store that is deleted when you close or refresh the tab.",
              ]} />
            </PolicySection>

            <PolicySection n="03" title="Cookies and tracking">
              <P>
                We do not use advertising cookies, analytics pixels, or third-party tracking scripts. We do not track your behavior across sessions, sites, or devices.
              </P>
              <P>
                If your browser issues a session cookie for technical reasons (such as CSRF protection), it is a first-party, functional cookie only. It contains no personal information and expires at the end of your session.
              </P>
            </PolicySection>

            <PolicySection n="04" title="Third-party services">
              <P>
                Check the Lease uses the following third-party services:
              </P>
              <Ul items={[
                "Anthropic (Claude API) for AI analysis of lease text. Anthropic's privacy policy governs their handling of API requests. We have configured our usage to disable training on API inputs where this option is available.",
                "Replit for infrastructure and hosting. Replit's privacy policy governs their handling of server infrastructure.",
              ]} />
              <P>
                We do not sell, rent, or share your data with any other third party.
              </P>
            </PolicySection>

            <PolicySection n="05" title="Data retention">
              <P>
                We retain essentially nothing about individual users. Specifically:
              </P>
              <Ul items={[
                "Lease text: not retained after analysis request completion.",
                "Analysis results: stored in your browser's session storage only, not on our servers.",
                "Server request logs (IP, timestamp, response code): retained for up to 30 days for security monitoring, then deleted.",
                "We have no user accounts, so there is no user profile data to retain or delete.",
              ]} />
            </PolicySection>

            <PolicySection n="06" title="Your rights">
              <P>
                Because we store no personal data about you, most data subject rights (access, correction, deletion, portability) are satisfied by default. There is nothing we hold about you to provide, correct, or delete.
              </P>
              <P>
                If you have a question about data that may have been captured in server request logs, or any other privacy concern, contact us at the address below.
              </P>
            </PolicySection>

            <PolicySection n="07" title="Children">
              <P>
                Check the Lease is not directed to children under 13. We do not knowingly collect personal information from anyone under 13. If you believe a child has provided personal information to us, please contact us.
              </P>
            </PolicySection>

            <PolicySection n="08" title="Changes to this policy">
              <P>
                We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top of this page. We encourage you to review this policy periodically. Continued use of Check the Lease after any changes constitutes your acceptance of the updated policy.
              </P>
            </PolicySection>

            <PolicySection n="09" title="Contact">
              <P>
                If you have questions, concerns, or requests related to this Privacy Policy or our data practices, please reach out. Because we built this for the Replit Buildathon, contact is through the Replit platform for the time being.
              </P>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
                <Link href="/about" style={{ display: "inline-block", borderRadius: 999, padding: "13px 28px", fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 14, textDecoration: "none", backgroundColor: "var(--color-ink-blue)", color: "var(--color-bone)", border: "2.5px solid #171717", boxShadow: "5px 5px 0 0 #171717" }}>
                  About this project →
                </Link>
                <Link href="/terms" style={{ display: "inline-block", borderRadius: 999, padding: "13px 28px", fontFamily: "var(--app-font-sans)", fontWeight: 500, fontSize: 14, textDecoration: "none", color: "var(--color-ink)", border: "2.5px solid rgba(23,23,23,0.2)" }}>
                  Terms of Service →
                </Link>
              </div>
            </PolicySection>

          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
