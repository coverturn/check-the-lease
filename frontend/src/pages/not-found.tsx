import { useState } from "react";
import { Link } from "wouter";
import { SkipLink } from "@/components/SkipLink";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="ctl-page"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--color-bone)", color: "var(--color-ink)" }}
    >
      <SkipLink />
      <Nav />
      <main
        id="main"
        style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 28px", textAlign: "center" }}
      >
        <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-sage)", marginBottom: 16 }}>404</div>
        <h1 style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontWeight: 500, fontSize: "clamp(48px, 8vw, 72px)", color: "var(--color-ink-blue)", letterSpacing: "-0.025em", lineHeight: 1.05, marginBottom: 20 }}>
          Lost?
        </h1>
        <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 16, color: "var(--color-ink-muted)", lineHeight: 1.55, maxWidth: 380, marginBottom: 36 }}>
          We couldn't find that page. Let's get you back.
        </p>
        <Link
          href="/"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{ display: "inline-block", borderRadius: 999, padding: "13px 28px", fontFamily: "var(--app-font-sans)", fontWeight: 500, fontSize: 15, backgroundColor: hover ? "var(--color-ink-blue-dark)" : "var(--color-ink-blue)", color: "var(--color-bone)", border: `2px solid ${hover ? "var(--color-ink-blue-dark)" : "var(--color-ink-blue)"}`, transform: hover ? "scale(0.97)" : "scale(1)", transition: "background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease", textDecoration: "none", minHeight: 44, lineHeight: "18px" }}
        >
          Back home →
        </Link>
      </main>
      <Footer />
    </div>
  );
}
