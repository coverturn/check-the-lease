import { Link } from "wouter";
import { Wordmark } from "./Nav";

const SWATCHES = ["#7A2C3D", "#C97A4A", "#F5C547", "#5A8B7A", "#1E3A5F", "#7A5A8B"];

const PRODUCT = [
  { label: "Read my lease", href: "/upload" },
  { label: "Pricing", href: "/pricing" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Resources", href: "/resources" },
  { label: "Renter rights by state", href: "/renters-rights" },
];

const LEGAL = [
  { label: "About", href: "/about" },
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of service", href: "/terms" },
];

const HELP = [
  { label: "Find a tenant lawyer", href: "/resources" },
  { label: "Renter rights by state", href: "/renters-rights" },
];

const BG = "#1E3A5F";
const TEXT = "var(--color-bone)";
const MUTED = "rgba(251,248,241,0.5)";
const DIM = "rgba(251,248,241,0.22)";
const BORDER = "rgba(251,248,241,0.12)";

export function Footer() {
  return (
    <footer style={{ backgroundColor: BG, color: TEXT }}>

      {/* ── Swatch bar ── */}
      <div style={{ display: "flex", height: 6 }}>
        {SWATCHES.map((c) => (
          <div key={c} style={{ flex: 1, backgroundColor: c }} />
        ))}
      </div>

      {/* ── Main body ── */}
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "clamp(56px,8vw,96px) clamp(24px,4vw,48px) 0" }}>

        {/* Mission statement */}
        <div style={{ marginBottom: "clamp(40px,6vw,64px)", display: "grid", gridTemplateColumns: "1fr auto", gap: "clamp(32px,5vw,80px)", alignItems: "flex-end" }} className="footer-quote-stats">
          <div>
            {/* Wordmark in footer */}
            <div style={{ marginBottom: 24 }}>
              <Wordmark size="sm" />
            </div>
            <p style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-0.04em", lineHeight: 1.05, color: TEXT, margin: "0 0 28px" }}>
              "A fair lease<br />
              <em style={{ fontStyle: "italic", color: MUTED }}>protects everyone</em><br />
              who signs it."
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link
                href="/upload"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 14,
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  color: BG, backgroundColor: "var(--color-bone)",
                  border: "2.5px solid var(--color-bone)",
                  borderRadius: 999, padding: "12px 24px",
                  textDecoration: "none",
                  boxShadow: "4px 4px 0 0 rgba(251,248,241,0.3)",
                  transition: "transform 0.1s ease",
                }}
              >
                Read my lease →
              </Link>
              <Link
                href="/how-it-works"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 14,
                  color: MUTED,
                  border: `2.5px solid ${BORDER}`,
                  borderRadius: 999, padding: "12px 22px",
                  textDecoration: "none",
                  transition: "background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease",
                }}
              >
                How it works
              </Link>
            </div>
          </div>

          {/* Stats column */}
          <div style={{ display: "grid", gridTemplateColumns: "auto", gap: 0 }} className="footer-stats-grid">
            {[
              { n: "50", l: "states covered" },
              { n: "6", l: "territories" },
              { n: "<15s", l: "per scan" },
              { n: "Free", l: "to scan" },
            ].map(({ n, l }) => (
              <div key={l} style={{ padding: "14px 0", borderBottom: `1px solid ${BORDER}`, textAlign: "right" }}>
                <div style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(24px,3vw,36px)", letterSpacing: "-0.04em", color: TEXT, lineHeight: 1 }}>{n}</div>
                <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 11, color: DIM, letterSpacing: "0.04em", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", backgroundColor: BORDER, marginBottom: "clamp(32px,4vw,48px)" }} />

        {/* Nav columns */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "clamp(24px,4vw,48px)", marginBottom: "clamp(40px,5vw,56px)" }} className="footer-nav-grid">

          {/* Product */}
          <div>
            <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: DIM, marginBottom: 20 }}>Product</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {PRODUCT.map(({ label, href }) => (
                <Link key={label} href={href} role="menuitem" style={{ fontFamily: "var(--app-font-sans)", fontSize: 15, color: MUTED, textDecoration: "none", display: "flex", alignItems: "center", gap: 10, transition: "color 0.12s", minHeight: "44px", padding: "6px 0" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = TEXT; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = MUTED; }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#5A8B7A", flexShrink: 0 }} />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: DIM, marginBottom: 20 }}>Company</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {LEGAL.map(({ label, href }) => (
                <Link key={label} href={href} role="menuitem" style={{ fontFamily: "var(--app-font-sans)", fontSize: 15, color: MUTED, textDecoration: "none", display: "flex", alignItems: "center", gap: 10, transition: "color 0.12s", minHeight: "44px", padding: "6px 0" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = TEXT; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = MUTED; }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#C97A4A", flexShrink: 0 }} />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Help */}
          <div>
            <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: DIM, marginBottom: 20 }}>Free help</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
              {HELP.map(({ label, href }) => (
                <Link key={label} href={href} role="menuitem" style={{ fontFamily: "var(--app-font-sans)", fontSize: 15, color: MUTED, textDecoration: "none", display: "flex", alignItems: "center", gap: 10, transition: "color 0.12s", minHeight: "44px", padding: "6px 0" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = TEXT; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = MUTED; }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#1E3A5F", flexShrink: 0 }} />
                  {label}
                </Link>
              ))}
            </div>
            <div style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: 13, color: DIM, lineHeight: 1.55, borderTop: `1px solid ${BORDER}`, paddingTop: 14 }}>
              "I built Check the Lease because no one should have to sign 35 pages of legal language without help."
              <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 11, color: DIM, marginTop: 8 }}>- Ishmael</div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", backgroundColor: BORDER, marginBottom: "clamp(24px,3vw,36px)" }} />

        {/* Legal disclaimer */}
        <div style={{ backgroundColor: "rgba(122,44,61,0.15)", border: "1.5px solid rgba(122,44,61,0.28)", borderRadius: 12, padding: "16px 20px", marginBottom: "clamp(24px,3vw,36px)", display: "flex", gap: 14, alignItems: "flex-start" }}>
          <span style={{ fontFamily: "var(--app-font-serif)", fontWeight: 700, fontSize: 18, color: "rgba(200,120,130,0.8)", flexShrink: 0, lineHeight: 1.2, marginTop: 1 }}>§</span>
          <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 12, color: MUTED, lineHeight: 1.65, margin: 0 }}>
            Check the Lease provides legal <em>information</em>, not legal advice. We are not a law firm and do not provide legal advice. No attorney-client relationship is formed by using this service. For advice specific to your situation, consult a qualified attorney licensed in your state.
          </p>
        </div>

        {/* Bottom row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, paddingBottom: "clamp(32px,4vw,48px)", flexWrap: "wrap" }}>
          <p style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 400, letterSpacing: "0.06em", color: DIM, margin: 0 }}>
            © 2026 Check the Lease. All rights reserved.
          </p>
          <div aria-hidden="true" style={{ fontFamily: "var(--app-font-serif)", fontWeight: 900, fontSize: "clamp(48px,8vw,80px)", color: "rgba(251,248,241,0.04)", letterSpacing: "-0.06em", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>
            CTL
          </div>
        </div>

      </div>
    </footer>
  );
}
