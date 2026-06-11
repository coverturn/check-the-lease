const TEXT = "Free for renters  ·  Free for landlords  ·  Information, not advice  ·  Cited to the actual law  ·  Free forever  ·  ";
const REPEATED = TEXT.repeat(4);

export function MarqueeDivider() {
  return (
    <div
      aria-hidden="true"
      style={{
        borderTop: "1px solid var(--border-subtle)",
        borderBottom: "1px solid var(--border-subtle)",
        overflow: "hidden",
        whiteSpace: "nowrap",
        padding: "14px 0",
        backgroundColor: "var(--color-bone)",
      }}
    >
      <div
        style={{
          display: "inline-block",
          animation: "ctl-marquee 36s linear infinite",
          fontFamily: "'Fraunces', Georgia, serif",
          fontStyle: "italic",
          fontSize: 15,
          color: "var(--color-ink-blue)",
          letterSpacing: "-0.01em",
        }}
      >
        {REPEATED}
      </div>
    </div>
  );
}
