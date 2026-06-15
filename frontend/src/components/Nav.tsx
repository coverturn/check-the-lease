import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { IconMenu, IconClose } from "@/components/icons/Icon";

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

  // When the mobile menu is open: lock background scroll + close on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prevOverflow; window.removeEventListener("keydown", onKey); };
  }, [menuOpen]);

  const navLink = (href: string, label: string) => {
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
          transition: "color 0.15s ease, border-color 0.15s ease",
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

  const drawerItems = [
    { href: "/how-it-works", label: lang === "es" ? "Cómo funciona" : "How it works" },
    { href: "/pricing", label: lang === "es" ? "Precio" : "Pricing" },
    { href: "/resources", label: lang === "es" ? "Recursos" : "Resources" },
  ];

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
          {/* Logo (left) */}
          <div style={{ flex: "0 0 auto" }}>
            <Link
              href="/"
              style={{ textDecoration: "none", display: "inline-block", transition: "transform 0.2s ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.04)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
            >
              <Wordmark size="md" />
            </Link>
          </div>

          {/* Nav links (center) — desktop only */}
          <div className="hidden md:flex" style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 32 }}>
            {navLink("/how-it-works", lang === "es" ? "Cómo funciona" : "How it works")}
            {navLink("/pricing", lang === "es" ? "Precio" : "Pricing")}
            {navLink("/resources", lang === "es" ? "Recursos" : "Resources")}
          </div>

          {/* Spacer on mobile so the burger stays hard-right */}
          <div className="flex md:hidden" style={{ flex: 1, minWidth: 0 }} />

          {/* Right zone */}
          <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: 10 }}>
            {showAnalyseAnother && (
              <button
                onClick={() => navigate("/upload")}
                className="hidden sm:inline-block"
                style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, fontWeight: 600, color: "var(--color-sage)", background: "transparent", border: "none", cursor: "pointer", padding: "6px 0", letterSpacing: "-0.01em", transition: "color 0.15s ease" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#3D5F50"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-sage)"; }}
              >
                {lang === "es" ? "Analizar otro →" : "Analyse another →"}
              </button>
            )}

            {/* CTA — desktop only; on mobile it lives in the drawer */}
            <Link
              href={loc === "/upload" ? "/example" : "/upload"}
              className="hidden md:inline-flex"
              onMouseEnter={() => setCtaHov(true)}
              onMouseLeave={() => setCtaHov(false)}
              style={{
                borderRadius: 999,
                padding: "10px 20px",
                fontFamily: "var(--app-font-sans)",
                fontWeight: 700,
                fontSize: 13,
                alignItems: "center",
                gap: 6,
                textDecoration: "none",
                backgroundColor: ctaHov ? "#3D5F50" : "#5A8B7A",
                color: "#FBF8F1",
                border: "2.5px solid #171717",
                boxShadow: ctaHov ? "2px 2px 0 0 #171717" : "4px 4px 0 0 #171717",
                transition: "background-color 0.15s ease, transform 0.12s cubic-bezier(0.23,1,0.32,1), box-shadow 0.12s cubic-bezier(0.23,1,0.32,1)",
                transform: ctaHov ? "translate(2px, 2px)" : "translate(0, 0)",
                minHeight: 42,
                whiteSpace: "nowrap",
                letterSpacing: "-0.01em",
              }}
            >
              {loc === "/upload"
                ? (lang === "es" ? "Ver informe de ejemplo" : "See example report")
                : (lang === "es" ? "Leer mi contrato" : "Read my lease")}
              <span aria-hidden={true} style={{ display: "inline-block", transform: ctaHov ? "translateX(3px)" : "translateX(0)", transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}>→</span>
            </Link>

            {/* Hamburger / close — mobile only */}
            <button
              className="flex md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              type="button"
              style={{
                background: menuOpen ? "#F5C547" : "transparent",
                border: "2.5px solid #171717",
                borderRadius: 8,
                cursor: "pointer",
                padding: "8px 10px",
                minHeight: 48,
                minWidth: 48,
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.18s ease-out, transform 0.12s cubic-bezier(0.23,1,0.32,1)",
                color: "var(--color-ink)",
              }}
              onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(0.94)"; }}
              onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
            >
              {menuOpen ? <IconClose size={20} aria-hidden={true} /> : <IconMenu size={20} aria-hidden={true} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen menu */}
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
            padding: "28px 24px calc(28px + env(safe-area-inset-bottom))",
            gap: 0,
            overflowY: "auto",
            animation: "ctl-slide-down 0.32s cubic-bezier(0.32,0.72,0,1)",
          }}
        >
          {drawerItems.map(({ href, label }, i) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "var(--app-font-serif)",
                fontWeight: 500,
                fontSize: 26,
                letterSpacing: "-0.025em",
                color: "var(--color-ink)",
                textDecoration: "none",
                padding: "18px 0",
                borderBottom: "1px solid var(--border-subtle)",
                display: "block",
                opacity: 0,
                animation: `ctl-fade-up 0.42s ${90 + i * 55}ms cubic-bezier(0.23,1,0.32,1) both`,
              }}
            >
              {label}
            </a>
          ))}

          <div style={{ marginTop: "auto", paddingTop: 36, display: "flex", flexDirection: "column", gap: 12, opacity: 0, animation: `ctl-fade-up 0.42s ${90 + drawerItems.length * 55}ms cubic-bezier(0.23,1,0.32,1) both` }}>
            <Link
              href={loc === "/upload" ? "/example" : "/upload"}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                borderRadius: 999,
                padding: "16px 24px",
                fontFamily: "var(--app-font-sans)",
                fontWeight: 700,
                fontSize: 16,
                backgroundColor: "#5A8B7A",
                color: "#FBF8F1",
                border: "2.5px solid #171717",
                boxShadow: "4px 4px 0 0 #171717",
                textDecoration: "none",
              }}
            >
              {loc === "/upload"
                ? (lang === "es" ? "Ver informe de ejemplo" : "See example report")
                : (lang === "es" ? "Leer mi contrato" : "Read my lease")}
              <span aria-hidden={true}>→</span>
            </Link>
            <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 12.5, color: "var(--color-ink-muted)", textAlign: "center" }}>
              {lang === "es" ? "Gratis · sin cuenta · tu contrato nunca se guarda" : "Free · no account · your lease is never stored"}
            </span>
          </div>
        </nav>
      )}
    </>
  );
}
