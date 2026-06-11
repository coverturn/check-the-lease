import { useState, useMemo, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import statePreviews from "@/data/state-previews.json";
import { USStateMap, STATE_NAMES, USFlag } from "./USStateMap";

type StateKey = keyof typeof statePreviews.states;
type Tab = "rights" | "programs";

const ALL_STATES = Object.keys(statePreviews.states) as StateKey[];
const TERRITORIES = new Set(["DC", "PR", "GU", "VI", "AS", "MP"]);

const CATEGORIES = [
  { id: "all",          label: "All",              color: "#171717",  bg: "rgba(23,23,23,0.07)" },
  { id: "rent-help",    label: "Rental assistance", color: "#1E3A5F",  bg: "rgba(30,58,95,0.10)" },
  { id: "emergency",    label: "Emergency funds",   color: "#7A2C3D",  bg: "rgba(122,44,61,0.10)" },
  { id: "veterans",     label: "Veterans",          color: "#5A4A2A",  bg: "rgba(90,74,42,0.10)" },
  { id: "seniors",      label: "Seniors 60+",       color: "#C97A4A",  bg: "rgba(201,122,74,0.10)" },
  { id: "families",     label: "Families",          color: "#5A8B7A",  bg: "rgba(90,139,122,0.10)" },
  { id: "students",     label: "Students",          color: "#7A5A8B",  bg: "rgba(122,90,139,0.10)" },
  { id: "minorities",   label: "Minorities",        color: "#8B5A2A",  bg: "rgba(139,90,42,0.10)" },
  { id: "lgbtq",        label: "LGBTQ+",            color: "#8B2A6A",  bg: "rgba(139,42,106,0.10)" },
  { id: "disability",   label: "Disability",        color: "#2A6A8B",  bg: "rgba(42,106,139,0.10)" },
  { id: "income-based", label: "Income-based",      color: "#4A7A4A",  bg: "rgba(74,122,74,0.10)" },
] as const;

const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
const CARD_ACCENTS = ["#1E3A5F", "#5A8B7A", "#C97A4A", "#7A2C3D"];

/* ─── Modal ─────────────────────────────────────────────────────────────── */
function StateModal({ stateKey, onClose }: { stateKey: StateKey; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("rights");
  const [category, setCategory] = useState("all");
  const [visible, setVisible] = useState(false);

  const data = statePreviews.states[stateKey];
  const programs = (data as unknown as { programs?: unknown[] }).programs ?? [];

  const filteredPrograms = useMemo(
    () => category === "all" ? programs : programs.filter((p: unknown) => (p as { category: string }).category === category),
    [programs, category]
  );

  useEffect(() => { const t = setTimeout(() => setVisible(true), 16); return () => clearTimeout(t); }, []);

  const handleClose = useCallback(() => { setVisible(false); setTimeout(onClose, 280); }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const isTerritory = TERRITORIES.has(stateKey);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${data.name} tenant rights and support programs`}
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
    >
      <div
        onClick={handleClose}
        style={{ position: "absolute", inset: 0, backgroundColor: "rgba(23,23,23,0.72)", opacity: visible ? 1 : 0, transition: "opacity 0.28s ease", cursor: "pointer" }}
      />
      <div
        style={{
          position: "relative", width: "100%", maxHeight: "92dvh",
          display: "flex", flexDirection: "column",
          borderRadius: "24px 24px 0 0", overflow: "hidden",
          border: "2.5px solid #171717", borderBottom: "none",
          boxShadow: "0 -8px 0 0 #171717",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.32s cubic-bezier(0.34,1.28,0.64,1)",
          backgroundColor: "var(--color-bone)",
        }}
      >
        {/* Header */}
        <div style={{ background: "#1E3A5F", padding: "0 clamp(20px,4vw,36px)", flexShrink: 0, position: "relative", overflow: "hidden" }}>
          <div aria-hidden="true" style={{ position: "absolute", right: -8, top: -18, fontFamily: "var(--app-font-serif)", fontWeight: 900, fontSize: "clamp(100px,14vw,160px)", color: "rgba(251,248,241,0.05)", lineHeight: 1, letterSpacing: "-0.04em", userSelect: "none", pointerEvents: "none" }}>{stateKey}</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 20, paddingBottom: 4 }}>
            <div>
              {isTerritory && (
                <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", backgroundColor: "rgba(90,139,122,0.28)", color: "#7FBBAA", borderRadius: 4, padding: "3px 8px", marginBottom: 8, display: "inline-block" }}>US Territory</span>
              )}
              <h2 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(28px,5vw,52px)", letterSpacing: "-0.035em", color: "#FBF8F1", margin: 0, lineHeight: 1.05 }}>{data.name}</h2>
            </div>
            <button onClick={handleClose} aria-label="Close" style={{ width: 42, height: 42, borderRadius: "50%", border: "2px solid rgba(251,248,241,0.25)", background: "rgba(251,248,241,0.08)", color: "rgba(251,248,241,0.8)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div style={{ display: "flex", gap: 0, marginTop: 6 }}>
            {([["rights", "Tenant Rights"], ["programs", "Support Programmes"]] as [Tab, string][]).map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)} aria-pressed={tab === t}
                style={{ fontFamily: "var(--app-font-sans)", fontSize: 11, fontWeight: tab === t ? 700 : 500, letterSpacing: "0.07em", textTransform: "uppercase", padding: "14px 20px", border: "none", cursor: "pointer", background: "transparent", color: tab === t ? "#FBF8F1" : "rgba(251,248,241,0.38)", borderBottom: tab === t ? "2.5px solid #F5C547" : "2.5px solid transparent", transition: "color 0.15s" }}>{label}</button>
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {tab === "rights" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))", gap: 2, padding: 2, backgroundColor: "#171717" }}>
              {data.rights.map((right, i) => (
                <div key={i} style={{ backgroundColor: "var(--color-bone)", padding: "clamp(22px,3vw,32px)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: CARD_ACCENTS[i % 4] }} />
                  <div aria-hidden="true" style={{ fontFamily: "var(--app-font-serif)", fontWeight: 900, fontSize: 96, color: "rgba(23,23,23,0.04)", lineHeight: 1, position: "absolute", bottom: -12, right: 16, userSelect: "none", pointerEvents: "none" }}>{i + 1}</div>
                  <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: CARD_ACCENTS[i % 4], marginBottom: 12 }}>Right {String(i + 1).padStart(2, "0")}</div>
                  <p style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(17px,2.5vw,22px)", lineHeight: 1.45, letterSpacing: "-0.02em", color: "var(--color-ink)", margin: 0, marginBottom: 16, position: "relative" }}>{right.text}</p>
                  <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 10, color: "var(--color-ink-muted)", letterSpacing: "0.04em", padding: "6px 10px", borderRadius: 6, backgroundColor: "rgba(23,23,23,0.04)", border: "1px solid rgba(23,23,23,0.08)", display: "inline-block", position: "relative" }}>{right.citation}</div>
                </div>
              ))}
            </div>
          )}

          {tab === "programs" && (
            <div>
              <div style={{ padding: "14px 20px 12px", borderBottom: "1px solid rgba(23,23,23,0.08)", display: "flex", flexWrap: "wrap", gap: 6, position: "sticky", top: 0, backgroundColor: "var(--color-bone)", zIndex: 10 }}>
                {CATEGORIES.map((cat) => {
                  const isActive = category === cat.id;
                  return (
                    <button key={cat.id} onClick={() => setCategory(cat.id)} aria-pressed={isActive}
                      style={{ fontFamily: "var(--app-font-sans)", fontSize: 11, fontWeight: isActive ? 700 : 500, padding: "5px 13px", borderRadius: 999, cursor: "pointer", border: isActive ? `1.5px solid ${cat.color}` : "1.5px solid rgba(23,23,23,0.14)", backgroundColor: isActive ? cat.bg : "transparent", color: isActive ? cat.color : "var(--color-ink-muted)", transition: "all 0.12s" }}>{cat.label}</button>
                  );
                })}
              </div>
              {filteredPrograms.length === 0 ? (
                <div style={{ padding: "40px 24px", textAlign: "center" }}>
                  <p style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: 16, color: "var(--color-ink-muted)" }}>No programs in this category for {data.name}.</p>
                  <button onClick={() => setCategory("all")} style={{ marginTop: 12, fontFamily: "var(--app-font-sans)", fontSize: 12, color: "var(--color-ink-blue)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Show all programs</button>
                </div>
              ) : (
                (filteredPrograms as { category: string; name: string; org: string; who: string; what: string }[]).map((prog, i) => {
                  const cat = CAT_MAP[prog.category as keyof typeof CAT_MAP] ?? CAT_MAP["rent-help"];
                  return (
                    <div key={i} style={{ padding: "22px clamp(20px,4vw,36px)", borderBottom: "1px solid rgba(23,23,23,0.07)", borderLeft: `4px solid ${cat.color}22` }}>
                      <div style={{ marginBottom: 8 }}>
                        <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", backgroundColor: cat.bg, color: cat.color, borderRadius: 4, padding: "3px 8px" }}>{cat.label}</span>
                      </div>
                      <div style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(15px,2vw,18px)", color: "var(--color-ink)", letterSpacing: "-0.02em", marginBottom: 2 }}>{prog.name}</div>
                      <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 11, color: "var(--color-ink-muted)", marginBottom: 10, fontStyle: "italic" }}>{prog.org}</div>
                      <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap", alignItems: "baseline" }}>
                        <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-ink-muted)", flexShrink: 0 }}>WHO</span>
                        <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "var(--color-ink)", lineHeight: 1.5 }}>{prog.who}</span>
                      </div>
                      <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "rgba(23,23,23,0.72)", lineHeight: 1.65, margin: 0 }}>{prog.what}</p>
                    </div>
                  );
                })
              )}
              <div style={{ padding: "16px 24px", backgroundColor: "rgba(23,23,23,0.025)", borderTop: "1px solid rgba(23,23,23,0.07)" }}>
                <p style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: 11, color: "var(--color-ink-muted)", margin: 0 }}>Programme availability and eligibility change. Always verify directly with the administering agency.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ flexShrink: 0, padding: "16px clamp(20px,4vw,36px)", borderTop: "2px solid #171717", backgroundColor: "var(--color-bone)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 12, color: "var(--color-ink-muted)", margin: 0 }}>{data.name} · {data.rights.length} rights · {programs.length} support programs</p>
          <a href="/upload" style={{ fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "#FBF8F1", backgroundColor: "#1E3A5F", border: "2px solid #171717", borderRadius: 10, padding: "10px 18px", textDecoration: "none", boxShadow: "3px 3px 0 0 #171717", flexShrink: 0 }}>Read my lease →</a>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ─── Main section ───────────────────────────────────────────────────────── */
export function StatePreviews() {
  const [openState, setOpenState] = useState<StateKey | null>(null);
  const _territories = ALL_STATES.filter(k => TERRITORIES.has(k));
  void _territories;

  const handleMapClick = useCallback((abbr: string) => {
    if (abbr in statePreviews.states) setOpenState(abbr as StateKey);
  }, []);

  return (
    <>
      <section
        aria-labelledby="state-preview-heading"
        style={{ padding: "clamp(32px, 5vw, 72px) clamp(24px, 4vw, 48px)" }}
      >
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          {/* Section header with flag */}
          <div style={{ marginBottom: "clamp(24px,4vw,36px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <USFlag width={52} height={28} />
              <div style={{ fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--color-sage)" }}>
                US State &amp; Territory Coverage
              </div>
            </div>
            <h2 id="state-preview-heading" style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(24px, 3.5vw, 38px)", letterSpacing: "-0.03em", color: "var(--color-ink)", marginBottom: 10, lineHeight: 1.1 }}>
              Know your rights, wherever you are.
            </h2>
            <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "var(--color-ink-muted)", lineHeight: 1.65, maxWidth: 520, margin: 0 }}>
              Click any state or territory to see the laws that protect every renter there, plus housing support programs for seniors, veterans, students, families, and more.
            </p>
          </div>

          {/* The map - territories are inside it */}
          <USStateMap onStateClick={handleMapClick} />
        </div>
      </section>

      {openState && (
        <StateModal stateKey={openState} onClose={() => setOpenState(null)} />
      )}
    </>
  );
}
