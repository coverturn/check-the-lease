import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { SkipLink } from "@/components/SkipLink";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

// Loads a paid report by its private token, drops it into the session, and
// hands off to the normal results view (unlocked). The token is the access key.
export default function SavedReport() {
  const [, navigate] = useLocation();
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = window.location.pathname.split("/r/")[1]?.split(/[/?#]/)[0];
    if (!token) { setError(true); return; }
    fetch(`/api/report/${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d || !d.ok || !d.report) { setError(true); return; }
        try {
          sessionStorage.setItem("ctl-analysis", JSON.stringify(d.report));
          if (d.intake) sessionStorage.setItem("ctl-intake", JSON.stringify(d.intake));
          sessionStorage.setItem("ctl-paid", "1");
          localStorage.setItem("ctl-report-token", token);
        } catch { /* noop */ }
        navigate("/results");
      })
      .catch(() => setError(true));
  }, [navigate]);

  return (
    <div className="ctl-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--color-bone)", color: "var(--color-ink)" }}>
      <SkipLink />
      <Nav />
      <main id="main" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 28px", textAlign: "center" }} role="main">
        {error ? (
          <div style={{ maxWidth: 440 }}>
            <h1 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(24px,3.5vw,32px)", color: "var(--color-ink)", letterSpacing: "-0.02em", margin: "0 0 12px" }}>We couldn't find that report.</h1>
            <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 15, color: "var(--color-ink-muted)", lineHeight: 1.6, margin: "0 0 24px" }}>The link may be incorrect or the report may have been removed. You can run a fresh scan anytime.</p>
            <a href="/upload" style={{ fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 14, color: "#FBF8F1", backgroundColor: "#5A8B7A", border: "2.5px solid #171717", borderRadius: 999, padding: "13px 24px", textDecoration: "none", boxShadow: "4px 4px 0 0 #171717", display: "inline-block" }}>Scan a lease</a>
          </div>
        ) : (
          <p style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: "clamp(22px,3vw,30px)", color: "var(--color-ink-muted)", letterSpacing: "-0.02em" }}>Loading your saved report…</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
