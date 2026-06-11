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
  "#C97A4A", "#7A2C3D", "#1E3A5F", "#5A8B7A",
  "#C97A4A", "#7A2C3D", "#1E3A5F", "#5A8B7A", "#C97A4A",
];

function PolicySection({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  const idx = parseInt(n, 10) - 1;
  const color = SECTION_COLORS[idx] ?? "#C97A4A";
  return (
    <section style={{ paddingBottom: "clamp(36px,5vw,52px)", marginBottom: "clamp(36px,5vw,52px)", borderBottom: "1px solid var(--border-subtle)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "2px 2px 0 0 #171717" }}>
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
  return <p style={{ marginBottom: 16, lineHeight: 1.8 }}>{children}</p>;
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: "0 0 16px", paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 0 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: i < items.length - 1 ? "1px solid rgba(23,23,23,0.07)" : "none" }}>
          <span style={{ color: "var(--color-clay)", fontWeight: 700, flexShrink: 0, marginTop: 3, fontSize: 12 }}>→</span>
          <span style={{ fontSize: 14, lineHeight: 1.7 }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Terms() {
  useScrollReveal();

  return (
    <div className="ctl-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--color-bone)", color: "var(--color-ink)" }}>
      <SkipLink />
      <Nav />

      <main id="main" style={{ flex: 1, width: "100%" }} role="main">

        {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
        <div style={{ background: "#171717", padding: "clamp(64px,9vw,96px) clamp(24px,4vw,48px) clamp(52px,7vw,72px)", position: "relative", overflow: "hidden" }}>
          <div aria-hidden="true" style={{ position: "absolute", right: -20, bottom: -30, fontFamily: "var(--app-font-serif)", fontWeight: 900, fontSize: "clamp(140px,22vw,240px)", color: "rgba(251,248,241,0.025)", letterSpacing: "-0.05em", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>§</div>
          <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(251,248,241,0.28)", marginBottom: 24 }}>Terms of Service</div>
            <h1 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(40px,6vw,72px)", letterSpacing: "-0.04em", lineHeight: 1.0, color: "var(--color-bone)", margin: "0 0 24px" }}>
              A few ground rules.<br />
              <em style={{ fontStyle: "italic", color: "rgba(251,248,241,0.28)" }}>Plain English, naturally.</em>
            </h1>
            <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(14px,1.5vw,17px)", color: "rgba(251,248,241,0.45)", lineHeight: 1.7, maxWidth: 520, marginBottom: 32 }}>
              By using Check the Lease, you agree to these terms. They're written to be readable, not evasive.
            </p>
            <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 10, color: "rgba(251,248,241,0.22)", letterSpacing: "0.06em" }}>
              Last updated: {LAST_UPDATED}
            </div>
          </div>
        </div>

        {/* ═══ KEY TERMS CALLOUT ══════════════════════════════════════════════ */}
        <div
          data-reveal className="ctl-reveal"
          style={{ padding: "clamp(40px,6vw,64px) clamp(24px,4vw,48px)", backgroundColor: "rgba(122,44,61,0.05)", borderBottom: "1px solid rgba(122,44,61,0.15)" }}
        >
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div style={{ border: "2.5px solid #7A2C3D", borderRadius: 20, padding: "clamp(24px,3.5vw,40px)", display: "flex", gap: 24, alignItems: "flex-start", boxShadow: "6px 6px 0 0 #7A2C3D", backgroundColor: "rgba(122,44,61,0.03)" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: "#7A2C3D", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "3px 3px 0 0 #171717" }}>
                <span style={{ fontFamily: "var(--app-font-serif)", fontSize: 26, color: "white", lineHeight: 1 }} aria-hidden="true">!</span>
              </div>
              <div>
                <h2 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(18px,2.5vw,26px)", letterSpacing: "-0.02em", color: "#7A2C3D", marginBottom: 12 }}>
                  This service provides legal information, not legal advice.
                </h2>
                <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 15, color: "var(--color-ink)", lineHeight: 1.7 }}>
                  Check the Lease is not a law firm. We do not provide legal advice. No attorney-client relationship is formed by using this service. The analysis we provide is educational and informational only. For advice specific to your legal situation, consult a qualified attorney.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ FULL TERMS ═════════════════════════════════════════════════════ */}
        <div data-reveal className="ctl-reveal" style={{ padding: "clamp(48px,7vw,80px) clamp(24px,4vw,48px)" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>

            <PolicySection n="01" title="What this service is">
              <P>
                Check the Lease is an AI-powered tool that reads residential lease agreements in PDF format and produces a plain-English analysis. This analysis includes extracted key terms, clauses that may conflict with applicable state law, commonly missing lease protections, and suggested questions to raise with the other party.
              </P>
              <P>
                The service is provided free of charge and without requiring registration or account creation.
              </P>
            </PolicySection>

            <PolicySection n="02" title="What this service is not">
              <P>
                By using Check the Lease, you acknowledge and agree that:
              </P>
              <Ul items={[
                "Check the Lease provides legal information, not legal advice. These are different things.",
                "We are not a law firm and do not employ attorneys in connection with this service.",
                "No attorney-client relationship is created by your use of this service.",
                "The analysis we provide may be incomplete, inaccurate, or outdated. State law changes, and AI models have knowledge cutoffs.",
                "We make no warranty, express or implied, that our analysis is correct, complete, or fit for any particular purpose.",
                "Nothing in our analysis should be construed as a recommendation to sign, not sign, terminate, enforce, or take any action with respect to a lease agreement.",
              ]} />
            </PolicySection>

            <PolicySection n="03" title="Your use of the service">
              <P>You agree to use Check the Lease only for lawful purposes and in accordance with these Terms. Specifically, you agree not to:</P>
              <Ul items={[
                "Upload documents that you do not have the right to upload or analyze.",
                "Use the service to engage in any form of harassment, fraud, or deceptive practice.",
                "Attempt to reverse-engineer, scrape, or systematically extract data from the service.",
                "Use the service in any way that could harm, disrupt, or impair its availability for other users.",
                "Represent our analysis as legal advice, or use it to mislead any other party.",
              ]} />
              <P>
                You are solely responsible for your decisions and actions taken in connection with any lease agreement. We are not liable for any consequence of those decisions.
              </P>
            </PolicySection>

            <PolicySection n="04" title="Intellectual property">
              <P>
                The Check the Lease service, including its design, code, content, and methodology, is the intellectual property of its creator. All rights reserved.
              </P>
              <P>
                Your lease document remains your property (or the property of its original author). We assert no intellectual property rights over it.
              </P>
              <P>
                The analysis we generate in response to your submission is provided to you for your personal, non-commercial use. You may not resell, republish, or represent our analysis as your own work without attribution.
              </P>
            </PolicySection>

            <PolicySection n="05" title="Disclaimers and limitation of liability">
              <P>
                The service is provided "as is" and "as available" without warranty of any kind, express or implied. We do not warrant that:
              </P>
              <Ul items={[
                "The service will be uninterrupted or error-free.",
                "The analysis produced is accurate, complete, or current.",
                "The service will meet your specific requirements.",
                "Any errors in the service will be corrected.",
              ]} />
              <P>
                To the fullest extent permitted by law, Check the Lease and its creators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of money, opportunity, or legal rights, arising out of your use of this service, even if we have been advised of the possibility of such damages.
              </P>
              <P>
                Our total liability to you for any claims arising out of or relating to these Terms or the service shall not exceed the amount you paid to access the service (which, as the service is free, is zero).
              </P>
            </PolicySection>

            <PolicySection n="06" title="Third-party services">
              <P>
                Check the Lease uses Anthropic's Claude API to perform lease analysis. By using this service, your lease text is transmitted to Anthropic's infrastructure. Anthropic's own terms of service and privacy policy apply to that transmission. We are not responsible for Anthropic's data handling practices.
              </P>
              <P>
                We select third-party providers with data protection in mind and configure our usage to limit data retention where possible.
              </P>
            </PolicySection>

            <PolicySection n="07" title="Availability and changes">
              <P>
                We reserve the right to modify, suspend, or discontinue the service at any time, with or without notice. We may also update these Terms at any time. The "Last updated" date at the top of this page indicates when the most recent changes were made.
              </P>
              <P>
                Continued use of the service after any modification to these Terms constitutes acceptance of the updated Terms.
              </P>
            </PolicySection>

            <PolicySection n="08" title="Governing law">
              <P>
                These Terms are governed by and construed in accordance with the laws of the United States and the state in which the service is operated. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the applicable courts.
              </P>
            </PolicySection>

            <PolicySection n="09" title="Questions about these terms">
              <P>
                If you have questions about these Terms, please reach out through the Replit platform. These terms were prepared for the Replit 10 Year Buildathon and will be revised as the service evolves.
              </P>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
                <Link href="/privacy" style={{ display: "inline-block", borderRadius: 999, padding: "13px 28px", fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 14, textDecoration: "none", backgroundColor: "var(--color-ink-blue)", color: "var(--color-bone)", border: "2.5px solid #171717", boxShadow: "5px 5px 0 0 #171717" }}>
                  Privacy Policy →
                </Link>
                <Link href="/about" style={{ display: "inline-block", borderRadius: 999, padding: "13px 28px", fontFamily: "var(--app-font-sans)", fontWeight: 500, fontSize: 14, textDecoration: "none", color: "var(--color-ink)", border: "2.5px solid rgba(23,23,23,0.2)" }}>
                  About →
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
