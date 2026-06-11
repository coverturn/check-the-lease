import { useState, useMemo } from "react";
import { SkipLink } from "@/components/SkipLink";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import resourcesHub from "@/data/resources-hub.json";
import { Link } from "wouter";
import { IconSearchSmall, IconExternalLink, IconGlobe, IconScale, IconShield } from "@/components/icons/Icon";
import PhotoStairs from "@assets/DTS_Chicago_to_LA_Alex_Tan_Photos_ID2720_1777779569750.jpg";
import PhotoApartment from "@assets/DTS_Chicago_to_LA_Alex_Tan_Photos_ID2723_1777779569759.jpg";
import PhotoDoor from "@assets/DTS_Home_Buyer_Mathew_Addington_Photos_ID1413_1777779569760.jpg";

const BG_INK_BLUE = "#1E3A5F";
const SAGE = "#5A8B7A";
const CLAY = "#C97A4A";

/* ── US tile-grid map ─────────────────────────────────────────────────── */
// Standard cartogram grid - 12 cols × 8 rows (indices 0-based)
const MAP_GRID: (string | null)[][] = [
  [null, null, null, null, null, null, null, null, null, null, null, "ME"],
  ["WA", null, "MT", "ND", "MN", null, null, null, null, null, "VT", "NH"],
  ["OR", "ID", "WY", "SD", "WI", "MI", null, null, null, "NY", "MA", "RI"],
  ["CA", "NV", "UT", "CO", "NE", "IA", "IL", "IN", "OH", "PA", "NJ", "CT"],
  [null, "AZ", "NM", "KS", "MO", "KY", "WV", "VA", "MD", "DE", null, null],
  [null, null, null, "OK", "AR", "TN", "NC", "SC", "DC", null, null, null],
  [null, null, "TX", "LA", "MS", "AL", "GA", "FL", null, null, null, null],
  ["AK", null, null, null, null, null, null, "HI", null, null, null, null],
];

const TERRITORY_CODES = ["PR", "GU", "VI", "AS", "MP"];
const ALL_STATE_CODES = Object.keys(resourcesHub.states) as Array<keyof typeof resourcesHub.states>;
const STATE_CODE_SET = new Set(ALL_STATE_CODES as string[]);

const ALL_REGIONS = ["All", "Northeast", "South", "Midwest", "West", "Territories"] as const;
type Region = typeof ALL_REGIONS[number];

const REGION_MAP: Record<string, Region> = {
  ME: "Northeast", NH: "Northeast", VT: "Northeast", MA: "Northeast", RI: "Northeast",
  CT: "Northeast", NY: "Northeast", NJ: "Northeast", PA: "Northeast",
  DE: "South", MD: "South", DC: "South", VA: "South", WV: "South", NC: "South",
  SC: "South", GA: "South", FL: "South", KY: "South", TN: "South", AL: "South",
  MS: "South", AR: "South", LA: "South", OK: "South", TX: "South",
  OH: "Midwest", MI: "Midwest", IN: "Midwest", IL: "Midwest", WI: "Midwest",
  MN: "Midwest", IA: "Midwest", MO: "Midwest", ND: "Midwest", SD: "Midwest",
  NE: "Midwest", KS: "Midwest",
  MT: "West", ID: "West", WY: "West", CO: "West", NM: "West", AZ: "West",
  UT: "West", NV: "West", WA: "West", OR: "West", CA: "West", AK: "West", HI: "West",
  PR: "Territories", GU: "Territories", VI: "Territories", AS: "Territories", MP: "Territories",
};

/* ── Region color palette ── */
const REGION_COLORS: Record<Region, { base: string; hover: string; text: string }> = {
  Northeast: { base: "#7A2C3D", hover: "#5E2130", text: "#FBF8F1" },
  South:     { base: "#C97A4A", hover: "#A8623A", text: "#FBF8F1" },
  Midwest:   { base: "#1E3A5F", hover: "#163050", text: "#FBF8F1" },
  West:      { base: "#5A8B7A", hover: "#3D5F50", text: "#FBF8F1" },
  Territories: { base: "#8B6914", hover: "#6D5210", text: "#FBF8F1" },
  All:       { base: SAGE, hover: "#3D5F50", text: "#FBF8F1" },
};

/* ── Tile map ── */
function StateMap({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (code: string) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  function getRegionColor(code: string) {
    const region: Region = REGION_MAP[code] ?? "All";
    return REGION_COLORS[region];
  }

  function cellStyle(code: string) {
    const isSel = selected === code;
    const isHov = hovered === code;
    const hasData = STATE_CODE_SET.has(code);
    const rc = getRegionColor(code);

    let bg: string;
    if (isSel) {
      bg = "#171717";
    } else if (!hasData) {
      bg = "rgba(23,23,23,0.06)";
    } else if (isHov) {
      bg = rc.hover;
    } else {
      bg = rc.base;
    }

    return {
      display: "flex" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      backgroundColor: bg,
      border: isSel ? "2.5px solid #171717" : "1.5px solid rgba(23,23,23,0.0)",
      borderRadius: 7,
      cursor: hasData ? "pointer" : "default",
      transition: "background-color 0.12s",
      boxShadow: isSel ? "3px 3px 0 0 rgba(23,23,23,0.5)" : "none",
      outline: "none",
    };
  }

  function labelStyle(code: string) {
    const isSel = selected === code;
    const hasData = STATE_CODE_SET.has(code);
    return {
      fontFamily: "var(--app-font-mono)",
      fontWeight: 700,
      fontSize: 9,
      letterSpacing: "0.05em",
      color: isSel ? "#FBF8F1" : hasData ? "#FBF8F1" : "rgba(23,23,23,0.22)",
      userSelect: "none" as const,
    };
  }

  const LEGEND_ITEMS = [
    { color: REGION_COLORS.West.base,      label: "West" },
    { color: REGION_COLORS.Midwest.base,   label: "Midwest" },
    { color: REGION_COLORS.South.base,     label: "South" },
    { color: REGION_COLORS.Northeast.base, label: "Northeast" },
    { color: REGION_COLORS.Territories.base, label: "Territories" },
    { color: "#171717",                    label: "Selected" },
  ];

  return (
    <div>
      {/* 48-state grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gridTemplateRows: "repeat(8, 1fr)",
        gap: 3,
        aspectRatio: "12/8",
        width: "100%",
        maxWidth: 612,
      }} className="state-map-grid">
        {MAP_GRID.map((row, ri) =>
          row.map((code, ci) => {
            if (!code) {
              return <div key={`${ri}-${ci}`} />;
            }
            const hasData = STATE_CODE_SET.has(code);
            const stateName = hasData
              ? (resourcesHub.states as Record<string, { name: string; legal_aid: unknown[] }>)[code]?.name ?? code
              : code;
            return (
              <button
                key={code}
                title={stateName}
                aria-label={`${stateName}${hasData ? " – click to see legal aid" : ""}`}
                onClick={() => hasData && onSelect(code)}
                onMouseEnter={() => setHovered(code)}
                onMouseLeave={() => setHovered(null)}
                style={cellStyle(code)}
                className="state-map-cell"
              >
                <span style={labelStyle(code)}>{code}</span>
              </button>
            );
          })
        )}
      </div>

      {/* Territories row */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
        <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(23,23,23,0.3)", marginRight: 4, whiteSpace: "nowrap" }}>
          Territories
        </span>
        {TERRITORY_CODES.map((code) => {
          const hasData = STATE_CODE_SET.has(code);
          const stateName = hasData
            ? (resourcesHub.states as Record<string, { name: string }>)[code]?.name ?? code
            : code;
          return (
            <button
              key={code}
              title={stateName}
              aria-label={`${stateName}${hasData ? " – click to see legal aid" : ""}`}
              onClick={() => hasData && onSelect(code)}
              onMouseEnter={() => setHovered(code)}
              onMouseLeave={() => setHovered(null)}
              style={{ ...cellStyle(code), width: 44, height: 30, flexShrink: 0 }}
            >
              <span style={{ ...labelStyle(code), fontSize: 8 }}>{code}</span>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 14, marginTop: 14, flexWrap: "wrap", alignItems: "center" }}>
        {LEGEND_ITEMS.map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: color, flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 11, color: "var(--color-ink-muted)" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── State legal aid panel ── */
function StateLegalAidPanel({
  code,
  onClose,
}: {
  code: string | null;
  onClose: () => void;
}) {
  if (!code) {
    return (
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "40px 28px", border: "2px dashed rgba(23,23,23,0.14)", borderRadius: 18,
        color: "var(--color-ink-muted)", textAlign: "center", minHeight: 220,
      }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" style={{ marginBottom: 14, opacity: 0.25 }}>
          <path d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4Z" stroke="#171717" strokeWidth="1.5"/>
          <path d="M16 11v6M16 21v1" stroke="#171717" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <div style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: 17, lineHeight: 1.4, marginBottom: 8, color: "var(--color-ink)" }}>
          Click any state on the map<br/>to see free legal aid near you.
        </div>
        <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 12, opacity: 0.6 }}>
          Green states have resources listed.
        </div>
      </div>
    );
  }

  const stateData = (resourcesHub.states as Record<string, { name: string; legal_aid: { name: string; url: string; desc: string }[] }>)[code];
  if (!stateData) return null;

  const isTerritory = TERRITORY_CODES.includes(code);
  const accent = isTerritory ? CLAY : SAGE;

  return (
    <div style={{ flex: 1, border: "2.5px solid #171717", borderRadius: 18, overflow: "hidden", boxShadow: "5px 5px 0 0 #171717" }}>
      {/* Panel header */}
      <div style={{ backgroundColor: accent, padding: "20px 24px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "rgba(251,248,241,0.55)", marginBottom: 4 }}>
            {isTerritory ? "Territory" : "State"} · {code}
          </div>
          <div style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: 22, color: "#FBF8F1", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            {stateData.name}
          </div>
          <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 12, color: "rgba(251,248,241,0.55)", marginTop: 4 }}>
            {stateData.legal_aid.length} free resource{stateData.legal_aid.length !== 1 ? "s" : ""}
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close panel"
          style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid rgba(251,248,241,0.35)", backgroundColor: "rgba(251,248,241,0.12)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background-color 0.15s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(251,248,241,0.22)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(251,248,241,0.12)"; }}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
            <path d="M1.5 1.5L9.5 9.5M9.5 1.5L1.5 9.5" stroke="#FBF8F1" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Orgs list */}
      <div style={{ backgroundColor: "var(--color-bone)", padding: "16px 20px", maxHeight: 380, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
        {stateData.legal_aid.map((org) => (
          <a
            key={org.name}
            href={org.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: "rgba(23,23,23,0.03)", border: "1.5px solid rgba(23,23,23,0.1)", borderRadius: 12, padding: "14px 16px", textDecoration: "none", display: "flex", flexDirection: "column", gap: 6, transition: "border-color 0.15s, background-color 0.15s" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = accent;
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(90,139,122,0.04)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(23,23,23,0.1)";
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(23,23,23,0.03)";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <span style={{ fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 14, color: "var(--color-ink)" }}>{org.name}</span>
              <IconExternalLink size={14} aria-hidden={true} />
            </div>
            <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 12, color: "var(--color-ink-muted)", lineHeight: 1.6, margin: 0 }}>{org.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function Resources() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<Region>("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return ALL_STATE_CODES.filter((code) => {
      const state = resourcesHub.states[code];
      const matchesSearch =
        !search ||
        state.name.toLowerCase().includes(search.toLowerCase()) ||
        code.toLowerCase().includes(search.toLowerCase());
      const matchesRegion = region === "All" || REGION_MAP[code] === region;
      return matchesSearch && matchesRegion;
    });
  }, [search, region]);

  function handleMapSelect(code: string) {
    setSelectedState((prev) => (prev === code ? null : code));
  }

  return (
    <div className="ctl-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--color-bone)", color: "var(--color-ink)" }}>
      <SkipLink />
      <Nav />

      <main id="main" style={{ flex: 1, width: "100%" }} role="main">

        {/* ── Hero ── */}
        <div style={{ backgroundColor: BG_INK_BLUE, padding: "clamp(64px,9vw,108px) clamp(24px,4vw,48px) clamp(48px,7vw,80px)", position: "relative", overflow: "hidden" }}>
          <svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" style={{ position: "absolute", top: "12%", right: "7%", animation: "star-twinkle 4s ease-in-out infinite", pointerEvents: "none" }}>
            <path d="M16 2 L18.5 11 L28 14 L18.5 17 L16 30 L13.5 17 L4 14 L13.5 11 Z" fill="#F5C547" stroke="#171717" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <Link href="/" style={{ fontFamily: "var(--app-font-sans)", fontSize: 12, color: "rgba(251,248,241,0.4)", textDecoration: "none" }}>Home</Link>
              <span style={{ color: "rgba(251,248,241,0.2)", fontSize: 12 }}>›</span>
              <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 12, color: "rgba(251,248,241,0.55)" }}>Resources</span>
            </div>
            <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(251,248,241,0.35)", marginBottom: 20 }}>Free legal aid directory</div>
            <h1 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(38px,6vw,72px)", letterSpacing: "-0.04em", lineHeight: 1.0, color: "var(--color-bone)", margin: "0 0 24px" }}>
              Real help,{" "}
              <em style={{ fontStyle: "italic", color: "rgba(251,248,241,0.38)" }}>every state.</em>
            </h1>
            <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(15px,1.6vw,17px)", color: "rgba(251,248,241,0.55)", lineHeight: 1.75, maxWidth: 560, margin: "0 0 32px" }}>
              When you need more than an AI analysis can give, whether a real attorney, a legal aid clinic, or a tenant union, this directory connects you to free help in all 50 states, DC, and US territories.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {[
                { label: "All 50 states + DC", color: SAGE },
                { label: "5 territories", color: CLAY },
                { label: "Always free", color: "#F5C547" },
              ].map(({ label, color }) => (
                <div key={label} style={{ fontFamily: "var(--app-font-sans)", fontSize: 12, fontWeight: 600, color: "rgba(251,248,241,0.85)", backgroundColor: "rgba(251,248,241,0.08)", border: "1px solid rgba(251,248,241,0.14)", borderRadius: 999, padding: "7px 16px", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: color, flexShrink: 0 }} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── National orgs strip ── */}
        <div style={{ backgroundColor: BG_INK_BLUE, borderBottom: "2px solid rgba(251,248,241,0.08)", padding: "clamp(32px,5vw,56px) clamp(24px,4vw,48px)" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: "#5A8B7A", border: "2px solid #171717", boxShadow: "3px 3px 0 0 #171717", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 11, fontWeight: 700, color: "#FBF8F1" }}>04</span>
              </div>
              <div>
                <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(251,248,241,0.38)", marginBottom: 4 }}>National organizations for anyone, anywhere</div>
                <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "rgba(251,248,241,0.62)" }}>National help when a local lawyer or legal aid office is the next step.</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
              {resourcesHub.national.map((org) => (
                <a
                  key={org.name}
                  href={org.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ backgroundColor: "rgba(251,248,241,0.04)", border: "1.5px solid rgba(251,248,241,0.1)", borderRadius: 14, padding: "18px 20px", textDecoration: "none", display: "flex", flexDirection: "column", gap: 8, transition: "border-color 0.15s, background-color 0.15s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(90,139,122,0.5)"; (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(90,139,122,0.06)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(251,248,241,0.1)"; (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(251,248,241,0.04)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: 15, color: "var(--color-bone)", letterSpacing: "-0.01em" }}>{org.name}</span>
                    <IconExternalLink size={14} aria-hidden={true} />
                  </div>
                  <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 12, color: "rgba(251,248,241,0.45)", lineHeight: 1.6, margin: 0 }}>{org.desc}</p>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Interactive map section ── */}
        <div style={{ padding: "clamp(48px,7vw,80px) clamp(24px,4vw,48px)", borderBottom: "1.5px solid rgba(23,23,23,0.08)" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>

            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: SAGE, marginBottom: 10 }}>
                Interactive map
              </div>
              <h2 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(24px,3.5vw,40px)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--color-ink)", margin: 0 }}>
                Find legal aid in your state.
              </h2>
            </div>

            {/* Map + panel grid */}
            <div className="ctl-map-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,612px) 1fr", gap: 24, alignItems: "start" }}>
              <StateMap selected={selectedState} onSelect={handleMapSelect} />
              <StateLegalAidPanel code={selectedState} onClose={() => setSelectedState(null)} />
            </div>

          </div>
        </div>

        <div style={{ padding: "0 clamp(24px,4vw,48px) clamp(32px,5vw,48px)" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gap: 16 }}>
            <div style={{ border: "2.5px solid #171717", borderRadius: 18, overflow: "hidden", boxShadow: "5px 5px 0 0 #171717", backgroundColor: "#F2EDE2" }}>
              <div style={{ position: "relative", minHeight: 240 }}>
                <img src={PhotoStairs} alt="A person carrying boxes up the stairs outside a home" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center", display: "block" }} />
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(30,58,95,0.28) 0%, transparent 55%)" }} />
                <div style={{ position: "absolute", left: 20, bottom: 18, maxWidth: 320, color: "#FBF8F1" }}>
                  <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8 }}>Move-in moment</div>
                  <div style={{ fontFamily: "var(--app-font-serif)", fontSize: 22, lineHeight: 1.15, letterSpacing: "-0.02em" }}>Small details in the lease can matter most when you move.</div>
                </div>
              </div>
            </div>
            <div style={{ border: "2.5px solid #171717", borderRadius: 18, overflow: "hidden", boxShadow: "5px 5px 0 0 #171717", backgroundColor: "#F2EDE2" }}>
              <div style={{ position: "relative", minHeight: 220 }}>
                <img src={PhotoApartment} alt="A person carrying boxes through an apartment during a move" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center", display: "block" }} />
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(23,23,23,0.22) 0%, transparent 50%)" }} />
                <div style={{ position: "absolute", left: 20, bottom: 18, maxWidth: 320, color: "#FBF8F1" }}>
                  <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8 }}>Move with clarity</div>
                  <div style={{ fontFamily: "var(--app-font-serif)", fontSize: 22, lineHeight: 1.15, letterSpacing: "-0.02em" }}>Legal aid is for the moment when the lease stops making sense.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Full directory ── */}
        <div style={{ padding: "clamp(48px,7vw,80px) clamp(24px,4vw,48px)" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>

            <div style={{ marginBottom: "clamp(28px,4vw,44px)" }}>
              <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--color-ink-muted)", marginBottom: 10 }}>Full directory</div>
              <h2 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(22px,3vw,34px)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--color-ink)", margin: "0 0 20px" }}>
                Browse all states &amp; territories.
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
                {/* Search */}
                <div style={{ position: "relative", flex: "1 1 200px", maxWidth: 360 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--color-ink-muted)" }}>
                    <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M10 10L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <input
                    type="search"
                    placeholder="Search state or code..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: "100%", paddingLeft: 40, paddingRight: 16, paddingTop: 12, paddingBottom: 12, border: "2px solid rgba(23,23,23,0.18)", borderRadius: 12, fontFamily: "var(--app-font-sans)", fontSize: 14, color: "var(--color-ink)", backgroundColor: "var(--color-bone)", outline: "none", boxSizing: "border-box" }}
                    aria-label="Search states"
                  />
                </div>
                {/* Region filter */}
                <div role="group" aria-label="Filter by region" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {ALL_REGIONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRegion(r)}
                      aria-pressed={region === r}
                      style={{ borderRadius: 999, padding: "9px 18px", fontFamily: "var(--app-font-sans)", fontSize: 13, fontWeight: region === r ? 700 : 500, cursor: "pointer", border: `2px solid ${region === r ? BG_INK_BLUE : "rgba(23,23,23,0.18)"}`, backgroundColor: region === r ? BG_INK_BLUE : "transparent", color: region === r ? "var(--color-bone)" : "var(--color-ink-muted)", transition: "all 0.15s", minHeight: 44, boxShadow: region === r ? "3px 3px 0 0 #171717" : "none" }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 11, color: "var(--color-ink-muted)", marginBottom: 20 }}>
              {filtered.length} location{filtered.length !== 1 ? "s" : ""}
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "64px 0", color: "var(--color-ink-muted)", fontFamily: "var(--app-font-sans)", fontSize: 15 }}>
                No results for "{search}". Try a different state name or code.
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))", gap: 12 }}>
                {filtered.map((code) => {
                  const state = resourcesHub.states[code];
                  const isOpen = expanded === code;
                  const accent = code === "DC" || REGION_MAP[code] === "Territories" ? CLAY : SAGE;
                  return (
                    <div
                      key={code}
                      style={{ border: "2.5px solid #171717", borderRadius: 18, overflow: "hidden", boxShadow: isOpen ? "5px 5px 0 0 #171717" : "3px 3px 0 0 rgba(23,23,23,0.15)", transition: "box-shadow 0.15s", backgroundColor: "var(--color-bone)" }}
                    >
                      <button
                        onClick={() => setExpanded(isOpen ? null : code)}
                        aria-expanded={isOpen}
                        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "18px 20px", cursor: "pointer", border: "none", backgroundColor: "transparent", textAlign: "left" }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: isOpen ? accent : "rgba(23,23,23,0.06)", border: `2px solid ${isOpen ? "#171717" : "rgba(23,23,23,0.12)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                            <span style={{ fontFamily: "var(--app-font-mono)", fontWeight: 700, fontSize: 11, color: isOpen ? "#FBF8F1" : "var(--color-ink-muted)", letterSpacing: "0.04em" }}>{code}</span>
                          </div>
                          <div>
                            <div style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: 16, color: "var(--color-ink)", letterSpacing: "-0.01em" }}>{state.name}</div>
                            <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 11, color: "var(--color-ink-muted)", marginTop: 2 }}>
                              {state.legal_aid.length} resource{state.legal_aid.length !== 1 ? "s" : ""}
                            </div>
                          </div>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", color: "var(--color-ink-muted)" }}>
                          <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>

                      {isOpen && (
                        <div style={{ borderTop: "1.5px solid rgba(23,23,23,0.1)", padding: "0 20px 20px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                            {state.legal_aid.map((org) => (
                              <a
                                key={org.name}
                                href={org.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ backgroundColor: "rgba(23,23,23,0.03)", border: "1.5px solid rgba(23,23,23,0.1)", borderRadius: 12, padding: "14px 16px", textDecoration: "none", display: "flex", flexDirection: "column", gap: 6, transition: "border-color 0.15s" }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = accent; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(23,23,23,0.1)"; }}
                              >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                                  <span style={{ fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 14, color: "var(--color-ink)" }}>{org.name}</span>
                                  <IconExternalLink size={14} aria-hidden={true} />
                                </div>
                                <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 12, color: "var(--color-ink-muted)", lineHeight: 1.6, margin: 0 }}>{org.desc}</p>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Closing CTA ── */}
        <div style={{ backgroundColor: BG_INK_BLUE, padding: "clamp(48px,7vw,80px) clamp(24px,4vw,48px)", position: "relative", overflow: "hidden" }}>
          <img src={PhotoDoor} alt="" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 28%", opacity: 0.16, mixBlendMode: "screen" }} />
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(30,58,95,0.08) 0%, rgba(30,58,95,0.72) 100%)" }} />
          <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative" }}>
            <p style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: "clamp(22px,3.5vw,38px)", letterSpacing: "-0.03em", lineHeight: 1.2, color: "var(--color-bone)", margin: "0 0 24px" }}>
              Start with the lease. Then get the right help.
            </p>
            <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 15, color: "rgba(251,248,241,0.72)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 32px" }}>
              Check the Lease gives you a plain-English analysis in under 15 seconds. If it flags something serious, reach out to a local attorney or legal aid clinic. The directory above is a good place to start.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/upload" style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999, padding: "14px 28px", fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.08em", color: BG_INK_BLUE, backgroundColor: "var(--color-bone)", border: "2.5px solid var(--color-bone)", boxShadow: "4px 4px 0 0 rgba(251,248,241,0.3)", textDecoration: "none" }}>
                Read my lease →
              </a>
              <a href="/about" style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999, padding: "14px 28px", fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 14, color: "rgba(251,248,241,0.8)", border: "2.5px solid rgba(251,248,241,0.22)", textDecoration: "none" }}>
                About this tool
              </a>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
