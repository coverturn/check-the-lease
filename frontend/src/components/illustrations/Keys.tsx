export function IllusKeys({ size = 120 }: { size?: number }) {
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
      <ellipse cx="60" cy="115" rx="38" ry="4" fill="rgba(23,23,23,0.10)" />

      {/* Key 1 - sunshine yellow, rotated */}
      <g transform="rotate(-28 60 60)">
        {/* Shadow offset */}
        <circle cx="44" cy="42" r="19" fill="#171717" />
        <rect x="58" y="36" width="10" height="36" rx="2" fill="#171717" />
        <rect x="64" y="56" width="8" height="5" rx="1" fill="#171717" />
        <rect x="64" y="64" width="8" height="5" rx="1" fill="#171717" />
        {/* Key fill */}
        <circle cx="41" cy="39" r="19" fill="#F5C547" stroke="#171717" strokeWidth="2.5" />
        <circle cx="41" cy="39" r="11" fill="none" stroke="#171717" strokeWidth="2.5" />
        <rect x="55" y="33" width="10" height="36" rx="2" fill="#F5C547" stroke="#171717" strokeWidth="2" strokeLinejoin="round" />
        <rect x="61" y="53" width="8" height="5" rx="1" fill="#171717" />
        <rect x="61" y="61" width="8" height="5" rx="1" fill="#171717" />
      </g>

      {/* Key 2 - ink-blue, rotated other way */}
      <g transform="rotate(18 60 60)">
        {/* Shadow offset */}
        <circle cx="79" cy="44" r="16" fill="#171717" />
        <rect x="89" y="39" width="9" height="30" rx="2" fill="#171717" />
        <rect x="94" y="55" width="7" height="4" rx="1" fill="#171717" />
        {/* Key fill */}
        <circle cx="76" cy="41" r="16" fill="#1E3A5F" stroke="#171717" strokeWidth="2.5" />
        <circle cx="76" cy="41" r="9" fill="none" stroke="rgba(251,248,241,0.4)" strokeWidth="2" />
        <rect x="86" y="36" width="9" height="30" rx="2" fill="#1E3A5F" stroke="#171717" strokeWidth="2" strokeLinejoin="round" />
        <rect x="91" y="52" width="7" height="4" rx="1" fill="#F5C547" />
      </g>

      {/* Sunshine star accent */}
      <path d="M98 18 L99.5 23 L104 24 L99.5 25.5 L98 30 L96.5 25.5 L92 24 L96.5 23 Z" fill="#F5C547" stroke="#171717" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
