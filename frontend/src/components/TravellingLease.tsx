import { useEffect, useRef, useState } from "react";

/**
 * TravellingLease — the homepage's persistent scroll companion.
 *
 * One comic-style lease document travels down the page as you scroll,
 * transforming at each section: scanned at the score band, pinned at the
 * map, flagged at the problem section, carried through the three steps,
 * split for renters/landlords, and finally fixed with a sage tick.
 *
 * Engineering notes:
 * - Pure transform/opacity, driven by a single rAF loop. No re-render per
 *   frame: the transform is written straight to the element. React state
 *   changes only when the *stage* changes (a handful per page).
 * - Desktop only (>=1200px) and disabled for prefers-reduced-motion.
 * - aria-hidden + pointer-events:none — purely decorative; every piece of
 *   meaning it conveys also exists as real page content.
 */

type Way = {
  id: string;
  at: "top" | "center" | "bottom";
  x: number; // fraction of viewport width
  y: number; // fraction of viewport height
  r: number; // rotation deg
  s: number; // scale
  stage: number;
};

const WAYPOINTS: Way[] = [
  { id: "hero-section", at: "center", x: 0.8, y: 0.42, r: -7, s: 1, stage: 0 },
  { id: "score-band", at: "center", x: 0.24, y: 0.52, r: 4, s: 0.9, stage: 1 },
  { id: "state-coverage", at: "top", x: 0.88, y: 0.24, r: -5, s: 0.7, stage: 2 },
  { id: "problem", at: "top", x: 0.89, y: 0.34, r: 6, s: 0.8, stage: 3 },
  { id: "how-it-works", at: "top", x: 0.16, y: 0.3, r: -4, s: 0.8, stage: 4 },
  { id: "how-it-works", at: "bottom", x: 0.8, y: 0.28, r: 5, s: 0.8, stage: 4 },
  { id: "who-its-for", at: "center", x: 0.5, y: 0.11, r: 0, s: 0.85, stage: 5 },
  { id: "final-cta", at: "center", x: 0.5, y: 0.3, r: -3, s: 0.9, stage: 6 },
];

const smooth = (u: number) => u * u * (3 - 2 * u);

// Colour of the soft light the document "carries" at each stage, so the
// section it passes over visibly responds to it (blended via mix-blend-mode).
const STAGE_LIGHT = ["#F5C547", "#7A2C3D", "#5A8B7A", "#C97A4A", "#C97A4A", "#F5C547", "#5A8B7A"];

export function TravellingLease() {
  const [enabled, setEnabled] = useState(false);
  const [stage, setStage] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const check = () => setEnabled(window.innerWidth >= 1200 && !mq.matches);
    check();
    window.addEventListener("resize", check);
    mq.addEventListener?.("change", check);
    return () => {
      window.removeEventListener("resize", check);
      mq.removeEventListener?.("change", check);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = wrapRef.current;
    if (!el) return;

    // Current (lerped) pose. Snapped to the first computed target so the
    // document fades in at its anchor instead of swooping in from off-screen.
    let cx = -200, cy = -200, cr = 0, cs = 1, co = 0;
    let snapped = false;
    let raf = 0;
    let alive = true;

    const markerY = (w: Way, vh: number): number | null => {
      const node = document.getElementById(w.id);
      if (!node) return null;
      const rect = node.getBoundingClientRect();
      const ref = w.at === "top" ? rect.top : w.at === "bottom" ? rect.bottom : rect.top + rect.height / 2;
      return ref - vh * 0.5;
    };

    const tick = () => {
      if (!alive) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const ds: { d: number; w: Way }[] = [];
      for (const w of WAYPOINTS) {
        const d = markerY(w, vh);
        if (d !== null) ds.push({ d, w });
      }
      if (ds.length >= 2) {
        // Find the segment the viewport centre currently sits in.
        let target = ds[0].w;
        let tx = target.x, ty = target.y, tr = target.r, ts = target.s;
        let nearestStage = target.stage;
        if (ds[0].d > 0) {
          // before the first waypoint
        } else if (ds[ds.length - 1].d < 0) {
          const last = ds[ds.length - 1].w;
          tx = last.x; ty = last.y; tr = last.r; ts = last.s;
          nearestStage = last.stage;
        } else {
          for (let i = 0; i < ds.length - 1; i++) {
            const a = ds[i], b = ds[i + 1];
            if (a.d <= 0 && b.d >= 0) {
              const u = smooth(a.d === b.d ? 0 : a.d / (a.d - b.d));
              tx = a.w.x + (b.w.x - a.w.x) * u;
              ty = a.w.y + (b.w.y - a.w.y) * u;
              tr = a.w.r + (b.w.r - a.w.r) * u;
              ts = a.w.s + (b.w.s - a.w.s) * u;
              nearestStage = u < 0.5 ? a.w.stage : b.w.stage;
              break;
            }
          }
        }

        // Fade out once the last waypoint is well past (footer territory).
        const lastD = ds[ds.length - 1].d;
        const targetO = lastD < -vh * 0.55 ? 0 : 1;

        // Lerp toward the target pose for a soft, springy follow.
        if (!snapped) { cx = tx * vw; cy = ty * vh; cr = tr; cs = ts; snapped = true; }
        const k = 0.11;
        cx += (tx * vw - cx) * k;
        cy += (ty * vh - cy) * k;
        cr += (tr - cr) * k;
        cs += (ts - cs) * k;
        co += (targetO - co) * 0.08;

        el.style.transform = `translate3d(${cx - 48}px, ${cy - 60}px, 0) rotate(${cr}deg) scale(${cs})`;
        el.style.opacity = String(Math.max(0, Math.min(1, co)));

        // Carried light follows the document, centred on it, so the section
        // beneath visibly warms/tints as it passes (the "adapting" feel).
        const lg = lightRef.current;
        if (lg) {
          lg.style.transform = `translate3d(${cx - 220}px, ${cy - 220}px, 0) scale(${cs})`;
          lg.style.opacity = String(Math.max(0, Math.min(1, co)) * 0.9);
        }

        if (nearestStage !== stageRef.current) {
          stageRef.current = nearestStage;
          setStage(nearestStage);
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  const lightColor = STAGE_LIGHT[Math.min(stage, STAGE_LIGHT.length - 1)] ?? "#F5C547";
  return (
    <>
    <div
      ref={lightRef}
      aria-hidden="true"
      className="ctl-trav-light"
      style={{ position: "fixed", top: 0, left: 0, width: 440, height: 440, borderRadius: "50%", zIndex: 29, pointerEvents: "none", opacity: 0, mixBlendMode: "soft-light", background: `radial-gradient(circle, ${lightColor} 0%, ${lightColor}00 68%)`, transition: "background 0.7s ease", willChange: "transform, opacity" }}
    />
    <div
      ref={wrapRef}
      aria-hidden="true"
      data-stage={stage}
      className="ctl-traveller"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 96,
        height: 120,
        zIndex: 30,
        pointerEvents: "none",
        opacity: 0,
        willChange: "transform, opacity",
      }}
    >
      <style>{`
        @keyframes ctl-trav-scan {
          0% { top: 4px; opacity: 0; }
          12% { opacity: 1; }
          88% { opacity: 1; }
          100% { top: 104px; opacity: 0; }
        }
        @keyframes ctl-trav-pop {
          0% { transform: scale(0.4); opacity: 0; }
          70% { transform: scale(1.12); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .ctl-traveller .trav-scan { display: none; }
        .ctl-traveller[data-stage="1"] .trav-scan { display: block; animation: ctl-trav-scan 1.6s cubic-bezier(0.45,0,0.55,1) infinite; }
        .ctl-traveller .trav-overlay { opacity: 0; transform: scale(0.4); transition: transform 0.3s cubic-bezier(0.23,1,0.32,1), opacity 0.25s ease; }
        .ctl-traveller .trav-seal { transition-delay: 0.1s; }
        .ctl-traveller[data-stage="1"] .trav-seal,
        .ctl-traveller[data-stage="2"] .trav-seal,
        .ctl-traveller[data-stage="3"] .trav-seal { opacity: 1; transform: scale(1); }
        .ctl-traveller[data-stage="2"] .trav-pin { opacity: 1; transform: scale(1); }
        .ctl-traveller[data-stage="3"] .trav-flag-1,
        .ctl-traveller[data-stage="4"] .trav-flag-1,
        .ctl-traveller[data-stage="5"] .trav-flag-1 { opacity: 1; transform: scale(1); }
        .ctl-traveller[data-stage="3"] .trav-flag-2,
        .ctl-traveller[data-stage="4"] .trav-flag-2,
        .ctl-traveller[data-stage="5"] .trav-flag-2 { opacity: 1; transform: scale(1); transition-delay: 0.12s; }
        .ctl-traveller[data-stage="3"] .trav-flag-3,
        .ctl-traveller[data-stage="4"] .trav-flag-3,
        .ctl-traveller[data-stage="5"] .trav-flag-3 { opacity: 1; transform: scale(1); transition-delay: 0.24s; }
        .ctl-traveller[data-stage="4"] .trav-para { opacity: 1; transform: scale(1); }
        .ctl-traveller .trav-ghost { opacity: 0; transition: transform 0.45s cubic-bezier(0.23,1,0.32,1), opacity 0.35s ease; }
        .ctl-traveller[data-stage="5"] .trav-ghost-a { opacity: 0.95; transform: translate(-42px, 6px) rotate(-9deg); }
        .ctl-traveller[data-stage="5"] .trav-ghost-b { opacity: 0.95; transform: translate(42px, 6px) rotate(9deg); }
        .ctl-traveller[data-stage="6"] .trav-tick { opacity: 1; transform: scale(1); animation: ctl-trav-pop 0.45s cubic-bezier(0.23,1,0.32,1) both; }
      `}</style>

      {/* Ghost copies — appear when the doc "splits" for renters/landlords */}
      <div className="trav-ghost trav-ghost-a" style={{ position: "absolute", inset: 0, background: "#F5C547", border: "2.5px solid #171717", borderRadius: 8, boxShadow: "3px 3px 0 0 #171717" }} />
      <div className="trav-ghost trav-ghost-b" style={{ position: "absolute", inset: 0, background: "#5A8B7A", border: "2.5px solid #171717", borderRadius: 8, boxShadow: "3px 3px 0 0 #171717" }} />

      {/* The document itself */}
      <svg width="96" height="120" viewBox="0 0 96 120" fill="none" style={{ position: "relative", display: "block", filter: "drop-shadow(2.5px 3px 0 rgba(23,23,23,0.8)) drop-shadow(0 16px 20px rgba(23,23,23,0.22))" }}>
        <path d="M6 10 a6 6 0 0 1 6-6 H68 L90 26 V110 a6 6 0 0 1-6 6 H12 a6 6 0 0 1-6-6 Z" fill="#FBF8F1" stroke="#171717" strokeWidth="3" strokeLinejoin="round" />
        <path d="M68 4 V20 a6 6 0 0 0 6 6 H90" fill="#F2EDE2" stroke="#171717" strokeWidth="3" strokeLinejoin="round" />
        <rect x="18" y="34" width="52" height="5" rx="2.5" fill="rgba(23,23,23,0.55)" />
        <rect x="18" y="48" width="58" height="4" rx="2" fill="rgba(23,23,23,0.28)" />
        <rect x="18" y="59" width="44" height="4" rx="2" fill="rgba(23,23,23,0.28)" />
        <rect x="16" y="68" width="54" height="8" rx="3" fill="rgba(245,197,71,0.7)" />
        <rect x="18" y="70" width="50" height="4" rx="2" fill="rgba(23,23,23,0.34)" />
        <rect x="18" y="82" width="56" height="4" rx="2" fill="rgba(23,23,23,0.28)" />
        <rect x="18" y="93" width="38" height="4" rx="2" fill="rgba(23,23,23,0.28)" />
        <path d="M60 104 q6 -7 14 -2" stroke="rgba(23,23,23,0.5)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>

      {/* Scan line */}
      <div className="trav-scan" style={{ position: "absolute", left: 4, right: 4, height: 7, borderRadius: 4, background: "#F5C547", border: "1.5px solid #171717", boxShadow: "0 0 14px rgba(245,197,71,0.9)" }} />

      {/* Score seal */}
      <div className="trav-overlay trav-seal" style={{ position: "absolute", right: -18, bottom: -14, width: 46, height: 46, borderRadius: "50%", background: "#7A2C3D", border: "2.5px solid #171717", boxShadow: "2.5px 2.5px 0 0 #171717", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: 17, lineHeight: 1, color: "#FBF8F1", letterSpacing: "-0.03em" }}>41</span>
        <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 6, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(251,248,241,0.75)", textTransform: "uppercase" }}>/100</span>
      </div>

      {/* Map pin */}
      <div className="trav-overlay trav-pin" style={{ position: "absolute", top: -16, left: -12 }}>
        <svg width="30" height="36" viewBox="0 0 30 36" fill="none">
          <path d="M15 2 C8 2 3 7.5 3 14 C3 23 15 34 15 34 C15 34 27 23 27 14 C27 7.5 22 2 15 2 Z" fill="#5A8B7A" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="15" cy="14" r="4.5" fill="#FBF8F1" stroke="#171717" strokeWidth="2" />
        </svg>
      </div>

      {/* Red flags */}
      {[{ t: 45, l: -10, c: "trav-flag-1" }, { t: 66, l: 84, c: "trav-flag-2" }, { t: 88, l: -8, c: "trav-flag-3" }].map((f) => (
        <div key={f.c} className={`trav-overlay ${f.c}`} style={{ position: "absolute", top: f.t, left: f.l, width: 20, height: 20, borderRadius: "50%", background: "#7A2C3D", border: "2px solid #171717", boxShadow: "1.5px 1.5px 0 0 #171717", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="9" height="11" viewBox="0 0 9 11" fill="none"><path d="M1.5 1 V10 M1.5 1.5 H7.5 L5.5 3.75 L7.5 6 H1.5" stroke="#FBF8F1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      ))}

      {/* Law paragraph badge — the steps stage */}
      <div className="trav-overlay trav-para" style={{ position: "absolute", top: -14, right: -12, width: 30, height: 30, borderRadius: 8, background: "#C97A4A", border: "2.5px solid #171717", boxShadow: "2px 2px 0 0 #171717", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--app-font-serif)", fontWeight: 700, fontSize: 16, color: "#FBF8F1", lineHeight: 1 }}>§</span>
      </div>

      {/* Fixed tick — the resolution */}
      <div className="trav-overlay trav-tick" style={{ position: "absolute", top: 36, left: 24, width: 48, height: 48, borderRadius: "50%", background: "#5A8B7A", border: "3px solid #171717", boxShadow: "3px 3px 0 0 #171717", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 12.5 L9.5 18 L20 6" stroke="#FBF8F1" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </div>
    </>
  );
}
