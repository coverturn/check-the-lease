export function IllusHouse({ size = 120 }: { size?: number }) {
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
      <rect x="18" y="58" width="86" height="56" rx="3" fill="#171717" />
      <path d="M18 62 L60 24 L102 62 Z" fill="#171717" />

      {/* Roof */}
      <path d="M14 62 L60 20 L106 62 Z" fill="#C97A4A" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />

      {/* Chimney */}
      <rect x="72" y="30" width="10" height="22" fill="#C97A4A" stroke="#171717" strokeWidth="2" />
      <rect x="70" y="27" width="14" height="6" rx="2" fill="#7A2C3D" stroke="#171717" strokeWidth="1.5" />

      {/* Smoke puffs */}
      <circle cx="77" cy="20" r="4" fill="rgba(23,23,23,0.12)" />
      <circle cx="74" cy="14" r="3" fill="rgba(23,23,23,0.08)" />
      <circle cx="80" cy="10" r="2.5" fill="rgba(23,23,23,0.06)" />

      {/* Wall */}
      <rect x="14" y="58" width="92" height="56" rx="3" fill="#FBF8F1" stroke="#171717" strokeWidth="2.5" />

      {/* Door */}
      <rect x="46" y="80" width="28" height="34" rx="4" fill="#1E3A5F" stroke="#171717" strokeWidth="2" />
      <circle cx="69" cy="98" r="2.5" fill="#F5C547" stroke="#171717" strokeWidth="1" />
      <line x1="60" y1="80" x2="60" y2="114" stroke="#171717" strokeWidth="1.5" />

      {/* Left window */}
      <rect x="22" y="68" width="22" height="20" rx="3" fill="#B8C8D9" stroke="#171717" strokeWidth="2" />
      <line x1="33" y1="68" x2="33" y2="88" stroke="#171717" strokeWidth="1.5" />
      <line x1="22" y1="78" x2="44" y2="78" stroke="#171717" strokeWidth="1.5" />
      {/* Window glare */}
      <rect x="24" y="70" width="6" height="3" rx="1" fill="rgba(251,248,241,0.7)" />

      {/* Right window */}
      <rect x="76" y="68" width="22" height="20" rx="3" fill="#B8C8D9" stroke="#171717" strokeWidth="2" />
      <line x1="87" y1="68" x2="87" y2="88" stroke="#171717" strokeWidth="1.5" />
      <line x1="76" y1="78" x2="98" y2="78" stroke="#171717" strokeWidth="1.5" />
      <rect x="78" y="70" width="6" height="3" rx="1" fill="rgba(251,248,241,0.7)" />

      {/* Path */}
      <path d="M46 114 L34 120 M74 114 L86 120" stroke="#171717" strokeWidth="2" strokeLinecap="round" opacity="0.2" />

      {/* Sunshine star */}
      <path d="M20 30 L21.5 35 L26 36 L21.5 37 L20 42 L18.5 37 L14 36 L18.5 35 Z" fill="#F5C547" stroke="#171717" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
