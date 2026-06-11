import { Link, useRoute } from "wouter";
import { SkipLink } from "@/components/SkipLink";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useSEO } from "@/lib/seo";
import { getGuide, relatedGuides } from "@/lib/guide-data";
import NotFound from "@/pages/not-found";

const INK = "#171717";
const BONE = "var(--color-bone)";
const NAVY = "#1E3A5F";
const SAGE = "#5A8B7A";
const WINE = "#7A2C3D";

const RED_FLAGS = [
  { title: "A security deposit above the state limit", body: "Many states cap deposits at one or two months' rent. Anything higher — or a deposit labelled 'non-refundable' — is worth questioning." },
  { title: "Entry with little or no notice", body: "Most states require advance written notice (often 24 hours) before a landlord enters. Clauses that waive notice 'for any reason' rarely hold up." },
  { title: "Waiving the right to repairs or habitability", body: "The implied warranty of habitability can't be waived in any US state. A clause that tries is usually unenforceable." },
  { title: "Vague or open-ended fees", body: "'Late fee as determined by the landlord' or undefined admin fees give a landlord room to charge what they like. Pin them to a specific figure." },
  { title: "Automatic renewal with a long notice window", body: "A lease that auto-renews unless you give 60–90 days' notice can trap you for another term. Watch the notice period." },
  { title: "One-sided attorney-fee clauses", body: "If the lease makes you pay the landlord's legal fees but not the reverse, it's worth asking to make it mutual." },
];

export default function Guide() {
  const [, params] = useRoute("/renters-rights/:slug");
  const guide = params?.slug ? getGuide(params.slug) : undefined;

  // SEO hook must run before any early return (rules of hooks). Provide safe defaults.
  const title = guide ? `${guide.name} Renter Rights & Lease Red Flags (2026) | Check the Lease` : "Renter Rights Guides | Check the Lease";
  const description = guide
    ? `Renter rights under ${guide.name} law, the lease clauses to watch for, and free legal-aid help in ${guide.name}. Scan your lease free in seconds.`
    : "Free state-by-state guides to renter rights, lease red flags, and legal aid.";
  useSEO({ title, description });

  if (!guide) return <NotFound />;

  const related = relatedGuides(guide.code, 6);

  return (
    <div className="ctl-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: BONE, color: "var(--color-ink)" }}>
      <SkipLink />
      <Nav />

      <main id="main" style={{ flex: 1, width: "100%" }} role="main">

        {/* Hero */}
        <section style={{ background: NAVY, padding: "clamp(40px,6vw,72px) clamp(24px,4vw,48px) clamp(32px,5vw,52px)" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <nav aria-label="Breadcrumb" style={{ fontFamily: "var(--app-font-mono)", fontSize: 11, color: "rgba(251,248,241,0.5)", marginBottom: 18, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Link href="/renters-rights" style={{ color: "rgba(251,248,241,0.7)" }}>Renter rights</Link>
              <span aria-hidden="true">/</span>
              <span style={{ color: "rgba(251,248,241,0.85)" }}>{guide.name}</span>
            </nav>
            <h1 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(32px,5vw,54px)", letterSpacing: "-0.035em", lineHeight: 1.03, color: "#FBF8F1", margin: "0 0 16px" }}>
              {guide.name} renter rights & <em style={{ fontStyle: "italic", color: "rgba(251,248,241,0.55)" }}>lease red flags.</em>
            </h1>
            <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(15px,1.8vw,18px)", color: "rgba(251,248,241,0.7)", lineHeight: 1.6, maxWidth: 600, margin: "0 0 24px" }}>
              Signing a lease in {guide.name}? Here are the protections {guide.name} law gives renters, the clauses landlords most often slip in, and where to find free help — plus a tool that scans your actual lease in seconds.
            </p>
            <Link href="/upload" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 15, color: NAVY, backgroundColor: "#FBF8F1", border: "2.5px solid #FBF8F1", borderRadius: 999, padding: "14px 26px", textDecoration: "none", boxShadow: "4px 4px 0 0 rgba(251,248,241,0.25)" }}>
              Scan your {guide.name} lease free →
            </Link>
          </div>
        </section>

        <div style={{ maxWidth: 820, margin: "0 auto", padding: "clamp(40px,6vw,64px) clamp(24px,4vw,48px) clamp(48px,7vw,80px)" }}>

          {/* Rights */}
          <section aria-labelledby="rights-h" style={{ marginBottom: "clamp(40px,6vw,64px)" }}>
            <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: SAGE }}>Your rights</span>
            <h2 id="rights-h" style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(24px,3.5vw,34px)", letterSpacing: "-0.025em", color: "var(--color-ink)", margin: "8px 0 6px" }}>
              What {guide.name} law gives you.
            </h2>
            <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "var(--color-ink-muted)", margin: "0 0 24px", lineHeight: 1.6 }}>
              These protections come from {guide.name} statute. A lease can't quietly take them away.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {guide.rights.map((r, i) => (
                <div key={i} style={{ background: BONE, border: `2.5px solid ${INK}`, borderLeft: `6px solid ${SAGE}`, borderRadius: 14, padding: "18px 22px", boxShadow: `4px 4px 0 0 ${INK}` }}>
                  <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(14px,1.7vw,16px)", color: "var(--color-ink)", lineHeight: 1.6, margin: 0 }}>{r.text}</p>
                  {r.citation && (
                    <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 12, color: "#3D5F50", marginTop: 10 }}>§ {r.citation}</div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Red flags */}
          <section aria-labelledby="flags-h" style={{ marginBottom: "clamp(40px,6vw,64px)" }}>
            <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: WINE }}>Red flags</span>
            <h2 id="flags-h" style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(24px,3.5vw,34px)", letterSpacing: "-0.025em", color: "var(--color-ink)", margin: "8px 0 6px" }}>
              Clauses to watch for in a {guide.name} lease.
            </h2>
            <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "var(--color-ink-muted)", margin: "0 0 24px", lineHeight: 1.6 }}>
              These show up in leases everywhere. Many don't hold up — but only if you spot them.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 12 }}>
              {RED_FLAGS.map((f) => (
                <div key={f.title} style={{ background: BONE, border: `2px solid ${INK}`, borderTop: `5px solid ${WINE}`, borderRadius: 12, padding: "18px 20px", boxShadow: `3px 3px 0 0 ${INK}` }}>
                  <h3 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: 17, color: "var(--color-ink)", letterSpacing: "-0.01em", margin: "0 0 7px", lineHeight: 1.25 }}>{f.title}</h3>
                  <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 13.5, color: "var(--color-ink-muted)", lineHeight: 1.55, margin: 0 }}>{f.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section style={{ marginBottom: "clamp(40px,6vw,64px)" }}>
            <div style={{ background: NAVY, border: `2.5px solid ${INK}`, borderRadius: 20, padding: "clamp(28px,4vw,40px)", boxShadow: `8px 8px 0 0 ${INK}`, textAlign: "center" }}>
              <h2 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(22px,3vw,30px)", letterSpacing: "-0.025em", color: "#FBF8F1", margin: "0 0 12px" }}>
                Don't just read about the law — check your lease against it.
              </h2>
              <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "rgba(251,248,241,0.65)", lineHeight: 1.6, maxWidth: 460, margin: "0 auto 22px" }}>
                Upload your {guide.name} lease for a free scan. We'll flag the risky clauses and cite the {guide.name} law behind each one. No account, never stored.
              </p>
              <Link href="/upload" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 15, color: NAVY, backgroundColor: "#FBF8F1", border: "2.5px solid #FBF8F1", borderRadius: 999, padding: "15px 30px", textDecoration: "none" }}>
                Start free scan →
              </Link>
            </div>
          </section>

          {/* Legal aid */}
          {guide.programs.length > 0 && (
            <section aria-labelledby="aid-h" style={{ marginBottom: "clamp(40px,6vw,64px)" }}>
              <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: SAGE }}>Free help</span>
              <h2 id="aid-h" style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(24px,3.5vw,34px)", letterSpacing: "-0.025em", color: "var(--color-ink)", margin: "8px 0 6px" }}>
                Free legal help & rent assistance in {guide.name}.
              </h2>
              <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "var(--color-ink-muted)", margin: "0 0 24px", lineHeight: 1.6 }}>
                Real organizations serving {guide.name} renters. No cost to reach out.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {guide.programs.map((p, i) => (
                  <div key={i} style={{ background: BONE, border: `2px solid ${INK}`, borderRadius: 12, padding: "18px 22px", boxShadow: `3px 3px 0 0 ${INK}` }}>
                    <h3 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: 18, color: "var(--color-ink)", margin: "0 0 4px", letterSpacing: "-0.01em" }}>{p.name}</h3>
                    {p.org && <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 11, color: "var(--color-ink-muted)", marginBottom: 8 }}>{p.org}</div>}
                    {p.what && <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 13.5, color: "var(--color-ink-muted)", lineHeight: 1.55, margin: "0 0 6px" }}>{p.what}</p>}
                    {p.who && <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 12.5, color: "var(--color-ink-muted)", lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>Who: {p.who}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related */}
          <section aria-labelledby="related-h" style={{ marginBottom: 12 }}>
            <h2 id="related-h" style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(18px,2.5vw,22px)", letterSpacing: "-0.02em", color: "var(--color-ink)", margin: "0 0 16px" }}>
              Renter rights in other states
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {related.map((s) => (
                <Link key={s.code} href={`/renters-rights/${s.slug}`} style={{ fontFamily: "var(--app-font-sans)", fontSize: 13.5, fontWeight: 600, color: "var(--color-ink)", backgroundColor: "rgba(23,23,23,0.04)", border: "1.5px solid rgba(23,23,23,0.15)", borderRadius: 999, padding: "8px 16px", textDecoration: "none" }}>
                  {s.name} →
                </Link>
              ))}
              <Link href="/renters-rights" style={{ fontFamily: "var(--app-font-sans)", fontSize: 13.5, fontWeight: 700, color: SAGE, padding: "8px 6px", textDecoration: "underline", textUnderlineOffset: 3 }}>
                All states →
              </Link>
            </div>
          </section>

          <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 12, color: "var(--color-ink-muted)", fontStyle: "italic", marginTop: 32, lineHeight: 1.5 }}>
            Check the Lease provides legal information, not legal advice. Laws change and individual situations differ — for advice on your specific situation, consult a qualified attorney or one of the legal-aid organizations above.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
