export function ProductPreview() {
  return (
    <div
      role="img"
      aria-label="Check the Lease results preview: showing 4 potential issues, 6 missing protections, and a highlighted high-severity security deposit clause"
      style={{
        width: "100%",
        maxWidth: 520,
        borderRadius: 16,
        border: "1.5px solid rgba(23,23,23,0.14)",
        overflow: "hidden",
        backgroundColor: "#FBF8F1",
        boxShadow: "0 8px 32px rgba(23,23,23,0.08), 0 2px 8px rgba(23,23,23,0.04)",
        userSelect: "none",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          backgroundColor: "#F2EDE2",
          borderBottom: "1px solid rgba(23,23,23,0.1)",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", gap: 5 }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: c }} />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            backgroundColor: "#FBF8F1",
            borderRadius: 6,
            padding: "4px 10px",
            fontFamily: "var(--app-font-sans)",
            fontSize: 10,
            color: "#6B6B6B",
            border: "1px solid rgba(23,23,23,0.08)",
          }}
        >
          checkthelease.com/results
        </div>
      </div>

      {/* Snapshot bar */}
      <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid rgba(23,23,23,0.07)" }}>
        <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "#5A8B7A", fontWeight: 500, marginBottom: 8 }}>YOUR LEASE READ · CALIFORNIA</div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[
            { n: "4", label: "potential issues" },
            { n: "6", label: "missing protections" },
            { n: "7", label: "questions to ask" },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: 26, color: "#171717", lineHeight: 1, letterSpacing: "-0.03em" }}>{s.n}</div>
              <div style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: 9, color: "#5A8B7A", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Issue cards */}
      <div style={{ padding: "12px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
        {/* High severity */}
        <div style={{ backgroundColor: "#FBF8F1", border: "1.5px solid rgba(23,23,23,0.09)", borderRadius: 10, padding: "12px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <span style={{ backgroundColor: "#7A2C3D", color: "#FBF8F1", fontFamily: "var(--app-font-sans)", fontSize: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", padding: "2px 7px", borderRadius: 3 }}>HIGH</span>
          </div>
          <div style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: 12, color: "#171717", marginBottom: 4 }}>Security deposit exceeds the legal cap.</div>
          <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 10, color: "#6B6B6B", lineHeight: 1.5, marginBottom: 6 }}>California limits deposits to 2 months' rent. This lease asks for 3 months.</div>
          <code style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, color: "#1E3A5F", backgroundColor: "rgba(30,58,95,0.07)", padding: "3px 7px", borderRadius: 4 }}>Cal. Civ. Code § 1950.5</code>
        </div>
        {/* Medium severity */}
        <div style={{ backgroundColor: "#FBF8F1", border: "1.5px solid rgba(23,23,23,0.09)", borderRadius: 10, padding: "12px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <span style={{ backgroundColor: "#C97A4A", color: "#FBF8F1", fontFamily: "var(--app-font-sans)", fontSize: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", padding: "2px 7px", borderRadius: 3 }}>MEDIUM</span>
          </div>
          <div style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: 12, color: "#171717", marginBottom: 4 }}>Entry rights are broad.</div>
          <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 10, color: "#6B6B6B", lineHeight: 1.5, marginBottom: 6 }}>California requires 24 hours' written notice for non-emergency entry.</div>
          <code style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, color: "#1E3A5F", backgroundColor: "rgba(30,58,95,0.07)", padding: "3px 7px", borderRadius: 4 }}>Cal. Civ. Code § 1954</code>
        </div>
        <div style={{ textAlign: "center", padding: "6px 0 4px", fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: 10, color: "#6B6B6B" }}>+ 2 more issues · 7 questions to raise</div>
      </div>
    </div>
  );
}
