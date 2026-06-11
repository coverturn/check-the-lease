export function IllusMovingBox({ size = 120 }: { size?: number }) {
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
      <rect x="22" y="53" width="76" height="56" rx="3" fill="#171717" />

      {/* Box body */}
      <rect x="18" y="50" width="76" height="56" rx="3" fill="#C97A4A" stroke="#171717" strokeWidth="2.5" />

      {/* Box vertical crease line */}
      <line x1="56" y1="50" x2="56" y2="106" stroke="#171717" strokeWidth="2" />

      {/* Box tape strip */}
      <rect x="48" y="50" width="16" height="14" fill="#F5C547" stroke="#171717" strokeWidth="1.5" />
      <line x1="56" y1="50" x2="56" y2="64" stroke="#171717" strokeWidth="1.5" />

      {/* Left flap */}
      <path d="M18 50 L18 30 L38 38 L38 50 Z" fill="#C97A4A" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />

      {/* Right flap */}
      <path d="M94 50 L94 30 L74 38 L74 50 Z" fill="#C97A4A" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />

      {/* Center flap left */}
      <path d="M38 50 L38 26 L56 32 L56 50 Z" fill="#E8894E" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />

      {/* Center flap right */}
      <path d="M74 50 L74 26 L56 32 L56 50 Z" fill="#E8894E" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />

      {/* CTL stamp on box */}
      <rect x="28" y="70" width="36" height="24" rx="4" fill="#FBF8F1" stroke="#171717" strokeWidth="1.5" />
      <text x="46" y="86" textAnchor="middle" fontFamily="'Fraunces', Georgia, serif" fontStyle="italic" fontSize="10" fill="#171717" fontWeight="600">FRAGILE</text>

      {/* Arrow up on right side */}
      <path d="M78 80 L78 68 M74 72 L78 68 L82 72" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
