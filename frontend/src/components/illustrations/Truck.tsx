export function IllusTruck({ size = 160 }: { size?: number }) {
  const h = Math.round(size * 0.675);
  return (
    <svg
      viewBox="0 0 160 108"
      width={size}
      height={h}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Block shadow */}
      <rect x="6" y="26" width="100" height="58" rx="4" fill="#171717" />
      <rect x="103" y="44" width="49" height="40" rx="4" fill="#171717" />

      {/* Cargo box body */}
      <rect x="2" y="22" width="100" height="58" rx="4" fill="#5A8B7A" stroke="#171717" strokeWidth="2.5" />

      {/* Cargo door vertical line */}
      <line x1="52" y1="22" x2="52" y2="80" stroke="#171717" strokeWidth="2" />

      {/* CTL logo on cargo */}
      <rect x="12" y="36" width="32" height="20" rx="3" fill="#FBF8F1" stroke="#171717" strokeWidth="1.5" />
      <text x="28" y="50" textAnchor="middle" fontFamily="'Fraunces', Georgia, serif" fontStyle="italic" fontSize="9" fill="#171717" fontWeight="600">CTL</text>

      {/* Star accent on cargo */}
      <path d="M72 38 L73.3 42.5 L78 43.5 L73.3 44.5 L72 49 L70.7 44.5 L66 43.5 L70.7 42.5 Z" fill="#F5C547" stroke="#171717" strokeWidth="1.5" strokeLinejoin="round" />

      {/* Cab connector */}
      <rect x="99" y="40" width="8" height="40" fill="#3D5F50" />

      {/* Cab body */}
      <rect x="99" y="40" width="49" height="40" rx="4" fill="#1E3A5F" stroke="#171717" strokeWidth="2.5" />

      {/* Cab windshield */}
      <path d="M112 44 L146 44 L146 64 L120 64 Z" fill="#B8C8D9" stroke="#171717" strokeWidth="2" strokeLinejoin="round" />

      {/* Windshield glare */}
      <line x1="117" y1="48" x2="130" y2="48" stroke="rgba(251,248,241,0.5)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Cab door handle */}
      <rect x="106" y="62" width="8" height="3" rx="1.5" fill="#F5C547" stroke="#171717" strokeWidth="1" />

      {/* Headlight */}
      <rect x="143" y="52" width="8" height="8" rx="2" fill="#F5C547" stroke="#171717" strokeWidth="1.5" />
      <rect x="144" y="62" width="6" height="4" rx="1" fill="#C97A4A" stroke="#171717" strokeWidth="1" />

      {/* Exhaust pipe */}
      <rect x="145" y="36" width="4" height="8" rx="2" fill="#171717" stroke="#171717" strokeWidth="1" />
      <ellipse cx="147" cy="35" rx="4" ry="2" fill="rgba(23,23,23,0.3)" />

      {/* Ground line / road */}
      <line x1="2" y1="97" x2="150" y2="97" stroke="#171717" strokeWidth="2" strokeLinecap="round" opacity="0.15" />

      {/* Wheels */}
      {/* Rear wheel shadow */}
      <circle cx="34" cy="88" r="15" fill="#171717" />
      <circle cx="34" cy="86" r="15" fill="#2A2A2A" stroke="#171717" strokeWidth="2.5" />
      <circle cx="34" cy="86" r="8" fill="#3A3A3A" stroke="#171717" strokeWidth="2" />
      <circle cx="34" cy="86" r="3" fill="#F5C547" stroke="#171717" strokeWidth="1.5" />

      {/* Front wheel shadow */}
      <circle cx="124" cy="88" r="13" fill="#171717" />
      <circle cx="124" cy="86" r="13" fill="#2A2A2A" stroke="#171717" strokeWidth="2.5" />
      <circle cx="124" cy="86" r="7" fill="#3A3A3A" stroke="#171717" strokeWidth="2" />
      <circle cx="124" cy="86" r="2.5" fill="#F5C547" stroke="#171717" strokeWidth="1.5" />

      {/* Speed lines behind truck */}
      <line x1="0" y1="54" x2="-10" y2="54" stroke="#5A8B7A" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      <line x1="0" y1="62" x2="-14" y2="62" stroke="#5A8B7A" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <line x1="0" y1="70" x2="-8" y2="70" stroke="#5A8B7A" strokeWidth="2" strokeLinecap="round" opacity="0.25" />
    </svg>
  );
}
