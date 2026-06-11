export function IllusDocument({ size = 120 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Block shadow */}
      <rect x="26" y="18" width="68" height="90" rx="4" fill="#171717" />

      {/* Paper body */}
      <rect x="22" y="14" width="68" height="90" rx="4" fill="#FBF8F1" stroke="#171717" strokeWidth="2.5" />

      {/* Folded corner */}
      <path d="M70 14 L90 34 L70 34 Z" fill="#F2EDE2" stroke="#171717" strokeWidth="2" strokeLinejoin="round" />
      <path d="M70 14 L90 34" stroke="#171717" strokeWidth="2" strokeLinecap="round" />

      {/* Header bar */}
      <rect x="22" y="14" width="48" height="20" rx="4" fill="#1E3A5F" stroke="#171717" strokeWidth="2" />
      <rect x="22" y="28" width="48" height="6" fill="#1E3A5F" />

      {/* Header text lines */}
      <rect x="30" y="20" width="28" height="3" rx="1.5" fill="rgba(251,248,241,0.7)" />

      {/* Body text lines */}
      <rect x="30" y="44" width="56" height="3" rx="1.5" fill="rgba(23,23,23,0.3)" />
      <rect x="30" y="51" width="46" height="3" rx="1.5" fill="rgba(23,23,23,0.2)" />
      <rect x="30" y="58" width="52" height="3" rx="1.5" fill="rgba(23,23,23,0.25)" />
      <rect x="30" y="65" width="38" height="3" rx="1.5" fill="rgba(23,23,23,0.2)" />

      {/* Divider */}
      <line x1="30" y1="75" x2="82" y2="75" stroke="rgba(23,23,23,0.15)" strokeWidth="1.5" />

      {/* Signature line */}
      <rect x="30" y="84" width="36" height="2" rx="1" fill="rgba(23,23,23,0.15)" />
      <path d="M30 84 Q38 78 44 83 Q50 88 56 81 Q62 75 66 83" stroke="#5A8B7A" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Stamp circle */}
      <circle cx="77" cy="88" r="9" fill="#C97A4A" stroke="#171717" strokeWidth="2" />
      <circle cx="77" cy="88" r="6" fill="none" stroke="rgba(251,248,241,0.5)" strokeWidth="1" strokeDasharray="2 1.5" />
      <text x="77" y="91.5" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="5.5" fill="white" fontWeight="700" letterSpacing="0.5">SIGN</text>
    </svg>
  );
}
