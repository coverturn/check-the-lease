import { Link } from "wouter";
import { SkipLink } from "@/components/SkipLink";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useSEO } from "@/lib/seo";
import { STATE_GUIDES } from "@/lib/guide-data";

const INK = "#171717";
const BONE = "var(--color-bone)";
const NAVY = "#1E3A5F";

export default function Guides() {
  useSEO({
    title: "Renter Rights by State — 50-State Guides & Lease Red Flags | Check the Lease",
    description: "Free guides to renter rights, lease red flags, and legal-aid help for all 50 US states, DC, and the territories. Scan your lease free.",
    path: "/renters-rights",
  });

  return (
    <div className="ctl-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: BONE, color: "var(--color-ink)" }}>
      <SkipLink />
      <Nav />

      <main id="main" style={{ flex: 1, width: "100%" }} role="main">
        <section style={{ background: NAVY, padding: "clamp(40px,6vw,72px) clamp(24px,4vw,48px) clamp(32px,5vw,52px)" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "rgba(251,248,241,0.5)", marginBottom: 16 }}>Renter rights guides</div>
            <h1 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(32px,5vw,56px)", letterSpacing: "-0.035em", lineHeight: 1.02, color: "#FBF8F1", margin: "0 0 16px" }}>
              Renter rights, <em style={{ fontStyle: "italic", color: "rgba(251,248,241,0.55)" }}>state by state.</em>
            </h1>
            <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(15px,1.8vw,18px)", color: "rgba(251,248,241,0.7)", lineHeight: 1.6, maxWidth: 580, margin: 0 }}>
              Pick your state for the protections the law gives you, the lease clauses to watch for, and free legal help near you. Covering all 50 states, DC, and the US territories.
            </p>
          </div>
        </section>

        <div style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(36px,5vw,56px) clamp(24px,4vw,48px) clamp(48px,7vw,80px)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 10 }}>
            {STATE_GUIDES.map((s) => (
              <Link key={s.code} href={`/renters-rights/${s.slug}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, fontFamily: "var(--app-font-sans)", fontSize: 15, fontWeight: 600, color: "var(--color-ink)", backgroundColor: BONE, border: `2px solid ${INK}`, borderRadius: 12, padding: "14px 18px", textDecoration: "none", boxShadow: `3px 3px 0 0 ${INK}` }}>
                {s.name}
                <span aria-hidden="true" style={{ color: "var(--color-sage)" }}>→</span>
              </Link>
            ))}
          </div>

          <div style={{ marginTop: "clamp(40px,5vw,56px)", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: "clamp(16px,2vw,20px)", color: "var(--color-ink-muted)", margin: "0 0 18px" }}>
              Want it checked against your actual lease?
            </p>
            <Link href="/upload" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 15, color: "#FBF8F1", backgroundColor: NAVY, border: `2.5px solid ${INK}`, borderRadius: 999, padding: "15px 32px", textDecoration: "none", boxShadow: `4px 4px 0 0 ${INK}` }}>
              Start free scan →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
