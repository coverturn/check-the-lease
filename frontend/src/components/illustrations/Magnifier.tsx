export function IllusMagnifier({ size = 120 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Block shadow - lens */}
      <circle cx="54" cy="54" r="34" fill="#171717" />

      {/* Lens frame */}
      <circle cx="50" cy="50" r="34" fill="#1E3A5F" stroke="#171717" strokeWidth="2.5" />

      {/* Lens glass */}
      <circle cx="50" cy="50" r="26" fill="#B8C8D9" stroke="#171717" strokeWidth="2" />

      {/* Inner highlight arc */}
      <path d="M35 36 Q50 28 63 38" stroke="rgba(251,248,241,0.65)" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Cross-hair */}
      <circle cx="50" cy="50" r="8" fill="none" stroke="#1E3A5F" strokeWidth="2" opacity="0.5" />
      <line x1="50" y1="28" x2="50" y2="72" stroke="#1E3A5F" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <line x1="28" y1="50" x2="72" y2="50" stroke="#1E3A5F" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />

      {/* Document lines inside lens */}
      <rect x="38" y="44" width="24" height="2.5" rx="1.25" fill="#171717" opacity="0.35" />
      <rect x="38" y="49.5" width="18" height="2.5" rx="1.25" fill="#171717" opacity="0.25" />
      <rect x="38" y="55" width="21" height="2.5" rx="1.25" fill="#171717" opacity="0.3" />

      {/* Handle block shadow */}
      <rect x="73" y="78" width="12" height="38" rx="6" fill="#171717" transform="rotate(45 73 78)" />

      {/* Handle */}
      <rect x="70" y="74" width="12" height="38" rx="6" fill="#C97A4A" stroke="#171717" strokeWidth="2.5" transform="rotate(45 70 74)" />

      {/* Handle grip texture */}
      <line x1="84" y1="88" x2="98" y2="102" stroke="rgba(23,23,23,0.25)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="88" y1="88" x2="102" y2="102" stroke="rgba(23,23,23,0.25)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Sunshine star */}
      <path d="M94 22 L95.5 27 L100 28 L95.5 29 L94 34 L92.5 29 L88 28 L92.5 27 Z" fill="#F5C547" stroke="#171717" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
