import { useState, useRef, useCallback } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const GEO_URL = "/us-states.json";

const FIPS_TO_ABBR: Record<string, string> = {
  "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA",
  "08": "CO", "09": "CT", "10": "DE", "11": "DC", "12": "FL",
  "13": "GA", "15": "HI", "16": "ID", "17": "IL", "18": "IN",
  "19": "IA", "20": "KS", "21": "KY", "22": "LA", "23": "ME",
  "24": "MD", "25": "MA", "26": "MI", "27": "MN", "28": "MS",
  "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH",
  "34": "NJ", "35": "NM", "36": "NY", "37": "NC", "38": "ND",
  "39": "OH", "40": "OK", "41": "OR", "42": "PA", "44": "RI",
  "45": "SC", "46": "SD", "47": "TN", "48": "TX", "49": "UT",
  "50": "VT", "51": "VA", "53": "WA", "54": "WV", "55": "WI",
  "56": "WY",
};

export const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", DC: "Washington D.C.",
  FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois",
  IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana",
  ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan",
  MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana",
  NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota",
  OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania",
  RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota",
  TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia",
  WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  PR: "Puerto Rico", GU: "Guam", VI: "US Virgin Islands",
  AS: "American Samoa", MP: "N. Mariana Islands",
};

const STATE_FILL: Record<string, string> = {
  WA: "#2A5A8F", OR: "#C97A4A", CA: "#5A8B7A",
  AK: "#3D6A8B", HI: "#7A2C3D",
  ID: "#5A8B7A", MT: "#B86A3A", WY: "#1E3A5F",
  CO: "#7A5A8B", UT: "#5A7A4A", NV: "#2A5A8F", AZ: "#C97A4A", NM: "#7A2C3D",
  ND: "#3D6A8B", SD: "#7A5A8B", NE: "#5A8B7A",
  KS: "#8B6A3A", OK: "#7A2C3D", TX: "#1E3A5F",
  MN: "#7A5A8B", WI: "#3D6A8B", MI: "#C97A4A",
  IA: "#5A7A4A", IL: "#5A8B7A", IN: "#1E3A5F", OH: "#8B6A3A",
  MO: "#3D6A8B", AR: "#7A5A8B", LA: "#5A8B7A",
  KY: "#C97A4A", TN: "#1E3A5F", VA: "#8B6A3A",
  WV: "#7A2C3D", NC: "#3D6A8B", SC: "#7A5A8B",
  GA: "#C97A4A", FL: "#5A8B7A", AL: "#1E3A5F", MS: "#8B6A3A",
  NY: "#7A2C3D", PA: "#3D6A8B", ME: "#7A5A8B",
  NH: "#C97A4A", VT: "#5A8B7A", MA: "#1E3A5F",
  RI: "#8B6A3A", CT: "#7A2C3D", NJ: "#3D6A8B",
  DE: "#7A5A8B", MD: "#C97A4A", DC: "#5A8B7A",
};

const TERRITORY_INFO: { abbr: string; fill: string }[] = [
  { abbr: "DC", fill: "#5A8B7A" },
  { abbr: "PR", fill: "#2A5A8F" },
  { abbr: "GU", fill: "#7A5A8B" },
  { abbr: "VI", fill: "#C97A4A" },
  { abbr: "AS", fill: "#7A2C3D" },
  { abbr: "MP", fill: "#3D6A8B" },
];

/* Hand-coded brand glyphs (comic line-art) — replace OS emoji for on-brand consistency.
   DC = capitol · PR = palm · GU = hibiscus · VI = island + sun · AS = waves · MP = globe */
function TerritoryGlyph({ abbr, color, size = 20 }: { abbr: string; color: string; size?: number }) {
  const p = { fill: "none", stroke: color, strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" aria-hidden="true" style={{ display: "block" }}>
      {abbr === "DC" && (<>
        <path d="M6.5 9 Q11 4 15.5 9" {...p} />
        <path d="M11 4 V2.7" {...p} />
        <path d="M5.5 9.2 H16.5" {...p} />
        <path d="M7 9.7 V15.3 M9 9.7 V15.3 M11 9.7 V15.3 M13 9.7 V15.3 M15 9.7 V15.3" {...p} />
        <path d="M5 15.6 H17" {...p} />
      </>)}
      {abbr === "PR" && (<>
        <path d="M11 17 C10.6 13 10.8 11.5 11 10.4" {...p} />
        <path d="M11 10.4 C8 8.8 5.6 9.2 4.2 10.8" {...p} />
        <path d="M11 10.4 C14 8.8 16.4 9.2 17.8 10.8" {...p} />
        <path d="M11 10.4 C9.4 7.4 8.6 6.2 7.2 5.4" {...p} />
        <path d="M11 10.4 C12.6 7.4 13.8 7 15.4 6" {...p} />
        <path d="M8 17 Q11 16 14 17" {...p} />
      </>)}
      {abbr === "GU" && (<>
        <circle cx="11" cy="10.5" r="1.4" {...p} />
        <circle cx="11" cy="6.7" r="1.9" {...p} />
        <circle cx="14.6" cy="9.3" r="1.9" {...p} />
        <circle cx="13.2" cy="13.4" r="1.9" {...p} />
        <circle cx="8.8" cy="13.4" r="1.9" {...p} />
        <circle cx="7.4" cy="9.3" r="1.9" {...p} />
      </>)}
      {abbr === "VI" && (<>
        <path d="M4 16 C7 10.5 15 10.5 18 16" {...p} />
        <path d="M3 16 H19" {...p} />
        <circle cx="15" cy="7" r="2" {...p} />
      </>)}
      {abbr === "AS" && (<>
        <path d="M3 9.5 Q6.5 5.8 10 9.5 T17 9.5" {...p} />
        <path d="M3 14 Q6.5 10.3 10 14 T17 14" {...p} />
      </>)}
      {abbr === "MP" && (<>
        <circle cx="11" cy="11" r="6.5" {...p} />
        <path d="M11 4.5 Q6.5 11 11 17.5 Q15.5 11 11 4.5" {...p} />
        <path d="M4.5 11 H17.5" {...p} />
      </>)}
    </svg>
  );
}

function lighten(hex: string, amount = 0.28): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lr = Math.min(255, Math.round(r + (255 - r) * amount));
  const lg = Math.min(255, Math.round(g + (255 - g) * amount));
  const lb = Math.min(255, Math.round(b + (255 - b) * amount));
  return `#${lr.toString(16).padStart(2, "0")}${lg.toString(16).padStart(2, "0")}${lb.toString(16).padStart(2, "0")}`;
}

/* ── Stylised US flag ─────────────────────────────────────────────────────── */
export function USFlag({ width: w = 52, height: h = 28 }: { width?: number; height?: number }) {
  const stripeH = h / 13;
  const cantonW = w * 0.384;
  const cantonH = stripeH * 7;
  const starRows = [6, 5, 6, 5, 6, 5, 6, 5, 6] as const;
  const rowCount = 9;
  const starRY = cantonH / rowCount;

  return (
    <svg
      width={w} height={h}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label="United States flag"
      style={{ borderRadius: 2, border: "1.5px solid #171717", display: "block", flexShrink: 0 }}
    >
      {Array.from({ length: 13 }, (_, i) => (
        <rect key={i} x={0} y={i * stripeH} width={w} height={stripeH + 0.5}
          fill={i % 2 === 0 ? "#7A2C3D" : "#FBF8F1"} />
      ))}
      <rect x={0} y={0} width={cantonW} height={cantonH} fill="#1E3A5F" />
      {starRows.map((cols, row) =>
        Array.from({ length: cols }, (_, col) => {
          const offset = cols === 5 ? (cantonW / (6 * 2)) : 0;
          const x = offset + (cantonW / (cols + 1)) * (col + 1);
          const y = starRY * (row + 0.5);
          return (
            <circle key={`${row}-${col}`} cx={x} cy={y} r={Math.min(w, h) * 0.028}
              fill="#FBF8F1" />
          );
        })
      )}
    </svg>
  );
}

interface USStateMapProps {
  onStateClick: (stateKey: string) => void;
}

export function USStateMap({ onStateClick }: USStateMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [hovTerr, setHovTerr] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(
    (abbr: string) => (evt: React.MouseEvent<SVGPathElement>) => {
      setHovered(abbr);
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const wr = wrapper.getBoundingClientRect();
      const tr = (evt.currentTarget as SVGPathElement).getBoundingClientRect();
      setTooltipPos({ x: tr.left - wr.left + tr.width / 2, y: tr.top - wr.top });
    },
    []
  );

  const handleMouseLeave = useCallback(() => setHovered(null), []);
  const handleClick = useCallback((abbr: string) => () => onStateClick(abbr), [onStateClick]);

  const active = hovered;

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%" }}>

      {/* ── Floating tooltip - follows cursor over map states ── */}
      {hovered && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: tooltipPos.x,
            top: Math.max(0, tooltipPos.y - 46),
            transform: "translateX(-50%)",
            pointerEvents: "none",
            zIndex: 30,
            backgroundColor: "#171717",
            color: "#FBF8F1",
            fontFamily: "var(--app-font-sans)",
            fontSize: 12,
            fontWeight: 700,
            padding: "5px 12px",
            borderRadius: 7,
            boxShadow: "2px 2px 0 0 rgba(23,23,23,0.4)",
            whiteSpace: "nowrap",
            letterSpacing: "0.01em",
          }}
        >
          {STATE_NAMES[hovered] ?? hovered}
        </div>
      )}

      {/* ── Map frame ──
           outer div: border + shadow + radius (no overflow so Alaska inset never clips)
           inner div: overflow hidden + matching radius for clean corners on the SVG    ── */}
      <div
        style={{
          position: "relative",
          border: "2.5px solid #171717",
          borderRadius: 20,
          boxShadow: "6px 6px 0 0 #171717",
          backgroundColor: "#D6E4F0",
        }}
      >
        {/* inner clip - slightly smaller radius so the SVG corners are clean */}
        <div style={{ borderRadius: 17, overflow: "hidden", lineHeight: 0 }}>
          {/*
            projectionConfig scale 880 (vs default ~1000) gives Alaska's inset
            more breathing room at the bottom-left so it is fully visible.
            width=800 height=490 keeps the standard react-simple-maps aspect ratio.
          */}
          <ComposableMap
            projection="geoAlbersUsa"
            projectionConfig={{ scale: 880 }}
            width={800}
            height={490}
            style={{ width: "100%", height: "auto", display: "block" }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const abbr = FIPS_TO_ABBR[geo.id as string];
                  if (!abbr) return null;
                  const fill = STATE_FILL[abbr] ?? "#3D6A8B";
                  const isHov = hovered === abbr;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={handleClick(abbr)}
                      onMouseEnter={handleMouseEnter(abbr)}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        default: {
                          fill: isHov ? lighten(fill) : fill,
                          stroke: "#171717",
                          strokeWidth: isHov ? 1.0 : 0.5,
                          outline: "none",
                          cursor: "pointer",
                          transition: "fill 0.12s ease",
                        },
                        hover: {
                          fill: lighten(fill),
                          stroke: "#171717",
                          strokeWidth: 1.0,
                          outline: "none",
                          cursor: "pointer",
                        },
                        pressed: {
                          fill: lighten(fill, 0.5),
                          stroke: "#F5C547",
                          strokeWidth: 1.8,
                          outline: "none",
                          cursor: "pointer",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>

        {/* ── Hovered state name - inside the map, bottom-left ── */}
        <div
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: "absolute",
            bottom: 10,
            left: 12,
            pointerEvents: "none",
            transition: "opacity 0.15s ease",
            opacity: active ? 1 : 0,
          }}
        >
          {active && (
            <div style={{
              backgroundColor: "rgba(23,23,23,0.82)",
              backdropFilter: "blur(4px)",
              color: "#FBF8F1",
              borderRadius: 10,
              padding: "6px 12px 7px",
              border: "1.5px solid rgba(251,248,241,0.15)",
            }}>
              <div style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: 15, fontWeight: 400, letterSpacing: "-0.01em", color: "#FBF8F1", lineHeight: 1.2 }}>
                {STATE_NAMES[active] ?? active}
              </div>
              <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 10, color: "rgba(251,248,241,0.5)", letterSpacing: "0.06em", marginTop: 2 }}>
                click to view rights →
              </div>
            </div>
          )}
        </div>

        {/* ── Inset labels (Alaska / Hawaii) - bottom-right corner of map ── */}
        <div style={{ position: "absolute", bottom: 10, right: 12, display: "flex", gap: 6, pointerEvents: "none" }}>
          {["AK", "HI"].map((abbr) => (
            <div key={abbr} style={{
              fontFamily: "var(--app-font-mono)",
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "rgba(251,248,241,0.55)",
              backgroundColor: "rgba(23,23,23,0.45)",
              backdropFilter: "blur(3px)",
              borderRadius: 5,
              padding: "3px 7px",
            }}>
              {abbr}
            </div>
          ))}
        </div>
      </div>

      {/* ── DC & US Territories - fully visible row BELOW the map ── */}
      <div style={{ marginTop: 14 }}>
        <div style={{
          fontFamily: "var(--app-font-mono)",
          fontSize: 9,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: "var(--color-ink-muted)",
          marginBottom: 8,
          paddingLeft: 2,
        }}>
          DC &amp; US Territories - click to explore
        </div>

        <div
          className="ctl-territory-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 8,
          }}
        >
          {TERRITORY_INFO.map(({ abbr, fill }) => {
            const isHov = hovTerr === abbr;
            const name = STATE_NAMES[abbr] ?? abbr;
            return (
              <button
                key={abbr}
                onClick={() => onStateClick(abbr)}
                onMouseEnter={() => setHovTerr(abbr)}
                onMouseLeave={() => setHovTerr(null)}
                aria-label={`View ${name} tenant rights`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "10px 12px 9px",
                  borderRadius: 10,
                  border: `2px solid ${isHov ? "#171717" : "rgba(23,23,23,0.18)"}`,
                  backgroundColor: isHov ? fill : `${fill}22`,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease",
                  boxShadow: isHov ? "3px 3px 0 0 #171717" : "none",
                  transform: isHov ? "translate(-1px,-1px)" : "none",
                }}
              >
                <span style={{ lineHeight: 0, marginBottom: 6 }} aria-hidden="true"><TerritoryGlyph abbr={abbr} color={isHov ? "#FBF8F1" : "#171717"} /></span>
                <span style={{
                  fontFamily: "var(--app-font-mono)",
                  fontSize: 11,
                  fontWeight: 700,
                  color: isHov ? "#FBF8F1" : "#171717",
                  letterSpacing: "0.08em",
                  lineHeight: 1,
                  marginBottom: 3,
                }}>
                  {abbr}
                </span>
                <span style={{
                  fontFamily: "var(--app-font-sans)",
                  fontSize: 10,
                  color: isHov ? "rgba(251,248,241,0.85)" : "var(--color-ink-muted)",
                  lineHeight: 1.3,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                }}>
                  {name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Status bar ── */}
      <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 28 }}>
        <span style={{
          fontFamily: "var(--app-font-sans)",
          fontSize: 12,
          color: "var(--color-ink-muted)",
          letterSpacing: "0.01em",
        }}>
          50 states · DC · Puerto Rico · Guam · US Virgin Islands · American Samoa · N. Mariana Islands
        </span>
      </div>

    </div>
  );
}
