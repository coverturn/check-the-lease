export function KeyHome({ className = "", size = 140 }: { className?: string; size?: number }) {
  return (
    <div className={className} style={{ width: "100%" }}>
      <svg viewBox="0 0 140 140" style={{ display: "block", maxWidth: size, margin: "0 auto", width: "100%", height: "auto" }}>
        <g className="ctl-key-swing">
          <circle cx="70" cy="40" r="22" fill="#5A8B7A" stroke="#171717" strokeWidth="2.5"/>
          <circle cx="70" cy="40" r="10" fill="#FBF8F1" stroke="#171717" strokeWidth="2"/>
          <rect x="65" y="58" width="10" height="44" fill="#5A8B7A" stroke="#171717" strokeWidth="2.5"/>
          <rect x="75" y="86" width="8" height="6" fill="#5A8B7A" stroke="#171717" strokeWidth="2.5"/>
          <rect x="75" y="96" width="12" height="6" fill="#5A8B7A" stroke="#171717" strokeWidth="2.5"/>
        </g>
        <line x1="70" y1="62" x2="78" y2="115" stroke="#171717" strokeWidth="1.5" strokeDasharray="2,3" opacity="0.5"/>
        <rect x="62" y="115" width="34" height="14" fill="#FBF8F1" stroke="#171717" strokeWidth="2" rx="2"/>
        <text x="79" y="125" textAnchor="middle" fill="#171717" fontFamily="Fraunces, Georgia, serif" fontSize="9" fontStyle="italic">apt 4B</text>
        <style>{`
          @keyframes ctl-key-swing { 0%,100% { transform: rotate(-12deg); } 50% { transform: rotate(-8deg); } }
          .ctl-key-swing { animation: ctl-key-swing 4s ease-in-out infinite; transform-origin: 70px 40px; }
        `}</style>
      </svg>
    </div>
  );
}
