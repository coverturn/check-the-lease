import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { IconMenu } from "@/components/icons/Icon";

export function Wordmark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const configs = {
    sm: { padding: '4px 10px 5px', fontSize: 13, shadow: '3px 3px 0 0 #171717' },
    md: { padding: '5px 14px 7px', fontSize: 17, shadow: '4px 4px 0 0 #171717' },
    lg: { padding: '7px 18px 9px', fontSize: 21, shadow: '5px 5px 0 0 #171717' },
  };
  const { padding, fontSize, shadow } = configs[size];
  return (
    <div style={{
      display: 'inline-block',
      background: '#F5C547',
      border: '2.5px solid #171717',
      padding,
      transform: 'rotate(-1deg)',
      boxShadow: shadow,
      flexShrink: 0,
    }}>
      <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize, letterSpacing: '-0.02em', color: '#171717' }}>Check the </span>
      <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: 'italic', fontWeight: 600, fontSize, letterSpacing: '-0.02em', color: '#171717' }}>Lease</span>
    </div>
  );
}

export function Nav({ showAnalyseAnother = false }: { showAnalyseAnother?: boolean }) {
  const [ctaHov, setCtaHov] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [, navigate] = useLocation();
  const [loc] = useLocation();
  const { lang } = useLanguage();

  const navLink = (href: string, label: string) => {
    // Hash anchors (/#section) are never "active" - only real page routes are
    const isHashLink = href.startsWith("/#");
    const active = !isHashLink && loc === href;
    return (
      <a
        href={href}
        aria-current={active ? "page" : undefined}
        role="menuitem"
        style={{
          fontFamily: "var(--app-font-sans)",
          fontSize: 14,
          fontWeight: active ? 700 : 500,
          color: active ? "var(--color-ink)" : "var(--color-ink-muted)",
          textDecoration: "none",
          padding: "8px 8px",
          borderBottom: active ? "2px solid var(--color-sage)" : "2px solid transparent",
          transition: "all 0.15s ease",
          whiteSpace: "nowrap",
          letterSpacing: "-0.01em",
          minHeight: "44px",
          display: "inline-flex",
          alignItems: "center",
        }}
        onMouseEnter={(e) => { 
          (e.currentTarget as HTMLElement).style.color = "var(--color-ink)";
          if (!active) (e.currentTarget as HTMLElement).style.borderBottomColor = "rgba(23,23,23,0.2)";
        }}
        onMouseLeave={(e) => { 
          (e.currentTarget as HTMLElement).style.color = active ? "var(--color-ink)" : "var(--color-ink-muted)";
          if (!active) (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent";
        }}
      >
        {label}
      </a>
    );
  };

  return (
    <>
      <header
        className="sticky top-0 z-50 backdrop-blur-sm border-b"
        style={{ backgroundColor: "rgba(251,248,241,0.98)", borderColor: "var(--border-subtle)", padding: "0 clamp(20px,3vw,48px)", boxShadow: "0 1px 3px rgba(23,23,23,0.04)" }}
      >
        <nav
          aria-label="Main navigation"
          style={{ maxWidth: 1360, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62, gap: 24 }}
        >

          {/* ── Zone 1: Logo (left) ── */}
          <div style={{ flex: "0 0 auto" }}>
            <Link 
              href="/" 
              style={{ 
                textDecoration: "none", 
                display: "inline-block",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.04)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
            >
              <Wordmark size="md" />
            </Link>
          </div>

          {/* ── Zone 2: Nav links (center) - desktop only ── */}
          <div
            className="hidden md:flex"
            style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 32 }}
          >
            {navLink("/how-it-works", lang === "es" ? "Cómo funciona" : "How it works")}
            {navLink("/pricing", lang === "es" ? "Precio" : "Pricing")}
            {navLink("/resources", lang === "es" ? "Recursos" : "Resources")}
          </div>

          {/* ── Spacer on mobile so CTA stays right ── */}
          <div className="flex md:hidden" style={{ flex: 1, minWidth: 0 }} />

          {/* ── Zone 3: CTA + hamburger (right) ── */}
          <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: 10 }}>
            {showAnalyseAnother && (
              <button
                onClick={() => navigate("/upload")}
                className="hidden sm:inline-block"
                style={{ 
                  fontFamily: "var(--app-font-sans)", 
                  fontSize: 13, 
                  fontWeight: 600, 
                  color: "var(--color-sage)", 
                  background: "transparent", 
                  border: "none", 
                  cursor: "pointer", 
                  padding: "6px 0", 
                  textDecoration: "none",
                  letterSpacing: "-0.01em",
                  transition: "all 0.15s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => { 
                  (e.currentTarget as HTMLElement).style.color = "#3D5F50";
                }}
                onMouseLeave={(e) => { 
                  (e.currentTarget as HTMLElement).style.color = "var(--color-sage)";
                }}
              >
                {lang === "es" ? "Analizar otro →" : "Analyse another →"}
              </button>
            )}

            <Link
              href={loc === "/upload" ? "/example" : "/upload"}
              onMouseEnter={() => setCtaHov(true)}
              onMouseLeave={() => setCtaHov(false)}
              style={{
                borderRadius: 999,
                padding: "10px 20px",
                fontFamily: "var(--app-font-sans)",
                fontWeight: 700,
                fontSize: 13,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                textDecoration: "none",
                backgroundColor: ctaHov ? "#3D5F50" : "#5A8B7A",
                color: "#FBF8F1",
                border: "2.5px solid #171717",
                boxShadow: ctaHov ? "2px 2px 0 0 #171717" : "4px 4px 0 0 #171717",
                transition: "background-color 0.15s ease, transform 0.12s ease, box-shadow 0.12s ease",
                transform: ctaHov ? "translate(2px, 2px)" : "translate(0, 0)",
                minHeight: 42,
                whiteSpace: "nowrap",
                letterSpacing: "-0.01em",
              }}
            >
              {loc === "/upload"
                ? (lang === "es" ? "Ver informe de ejemplo" : "See example report")
                : (lang === "es" ? "Leer mi contrato" : "Read my lease")}
              <span
                aria-hidden={true}
                style={{
                  display: "inline-block",
                  transform: ctaHov ? "translateX(3px)" : "translateX(0)",
                  transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              >
                →
              </span>
            </Link>

            {/* Mobile hamburger - display controlled by md:hidden class, no inline display */}
            <button
              className="flex md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              type="button"
              style={{ 
                background: "transparent", 
                border: "2.5px solid #171717", 
                borderRadius: 8, 
                cursor: "pointer", 
                padding: "8px 10px", 
                minHeight: 48, 
                minWidth: 48, 
                alignItems: "center", 
                justifyContent: "center",
                transition: "background-color 0.2s ease, box-shadow 0.2s ease",
                color: "var(--color-ink)",
              }}
              onMouseEnter={(e) => { 
                (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(23,23,23,0.04)";
                (e.currentTarget as HTMLElement).style.boxShadow = "2px 2px 0 0 rgba(23,23,23,0.1)";
              }}
              onMouseLeave={(e) => { 
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <IconMenu size={20} aria-hidden={true} />
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile drawer ── */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          className="md:hidden"
          role="navigation"
          aria-label="Mobile navigation"
          style={{ 
            position: "fixed", 
            top: 62, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            zIndex: 40, 
            backgroundColor: "var(--color-bone)", 
            borderTop: "2.5px solid #171717", 
            display: "flex", 
            flexDirection: "column", 
            padding: "32px 24px", 
            gap: 0,
            animation: "ctl-slide-down 0.3s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {/* Wordmark in drawer */}
          <div style={{ marginBottom: 40 }}>
              <Wordmark size="sm" />
          </div>

          {[
            { href: "/how-it-works", label: lang === "es" ? "Cómo funciona" : "How it works" },
            { href: "/pricing", label: lang === "es" ? "Precio" : "Pricing" },
            { href: "/resources", label: lang === "es" ? "Recursos" : "Resources" },
          ].map(({ href, label }) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{ 
                fontFamily: "var(--app-font-serif)", 
                fontWeight: 500, 
                fontSize: 22, 
                letterSpacing: "-0.025em", 
                color: "var(--color-ink)", 
                textDecoration: "none", 
                padding: "14px 0", 
                borderBottom: "1px solid var(--border-subtle)", 
                display: "block",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-sage)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-ink)"; }}
            >
              {label}
            </a>
          ))}

          <div style={{ marginTop: "auto", paddingTop: 40, display: "flex", flexDirection: "column", gap: 16 }}>
            <Link
              href="/upload"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                borderRadius: 999,
                padding: "14px 24px",
                fontFamily: "var(--app-font-sans)",
                fontWeight: 700,
                fontSize: 15,
                backgroundColor: "#5A8B7A",
                color: "#FBF8F1",
                border: "2.5px solid #171717",
                boxShadow: "4px 4px 0 0 #171717",
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => { 
                (e.currentTarget as HTMLElement).style.backgroundColor = "#3D5F50";
                (e.currentTarget as HTMLElement).style.transform = "translate(2px, 2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "2px 2px 0 0 #171717";
              }}
              onMouseLeave={(e) => { 
                (e.currentTarget as HTMLElement).style.backgroundColor = "#5A8B7A";
                (e.currentTarget as HTMLElement).style.transform = "translate(0, 0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0 0 #171717";
              }}
            >
              {lang === "es" ? "Leer mi contrato" : "Read my lease"}
              <span aria-hidden={true}>→</span>
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
