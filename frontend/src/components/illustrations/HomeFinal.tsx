export function HomeFinal({ className = "", size = 140 }: { className?: string; size?: number }) {
  return (
    <div className={className} style={{ width: "100%" }}>
      <svg
        viewBox="0 0 140 140"
        style={{ display: "block", maxWidth: size, margin: "0 auto", width: "100%", height: "auto" }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Block shadow */}
        <rect x="22" y="68" width="98" height="62" rx="4" fill="#171717" />
        <path d="M22 72 L70 28 L118 72 Z" fill="#171717" />

        {/* Roof */}
        <path d="M18 70 L70 24 L122 70 Z" fill="#C97A4A" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />

        {/* Chimney */}
        <rect x="85" y="37" width="11" height="24" fill="#C97A4A" stroke="#171717" strokeWidth="2" />
        <rect x="83" y="34" width="15" height="6" rx="2" fill="#7A2C3D" stroke="#171717" strokeWidth="1.5" />

        {/* Smoke */}
        <circle cx="90" cy="26" r="4.5" fill="rgba(23,23,23,0.10)" />
        <circle cx="87" cy="19" r="3.5" fill="rgba(23,23,23,0.07)" />
        <circle cx="93" cy="14" r="2.5" fill="rgba(23,23,23,0.05)" />

        {/* Wall */}
        <rect x="18" y="66" width="104" height="62" rx="4" fill="#FBF8F1" stroke="#171717" strokeWidth="2.5" />

        {/* Door */}
        <rect x="52" y="88" width="30" height="40" rx="5" fill="#1E3A5F" stroke="#171717" strokeWidth="2" />
        <circle cx="77" cy="110" r="3" fill="#F5C547" stroke="#171717" strokeWidth="1.5" />
        <line x1="67" y1="88" x2="67" y2="128" stroke="#171717" strokeWidth="1.5" />

        {/* Left window */}
        <rect x="24" y="76" width="24" height="22" rx="3" fill="#B8C8D9" stroke="#171717" strokeWidth="2" />
        <line x1="36" y1="76" x2="36" y2="98" stroke="#171717" strokeWidth="1.5" />
        <line x1="24" y1="87" x2="48" y2="87" stroke="#171717" strokeWidth="1.5" />
        <rect x="26" y="78" width="7" height="4" rx="1" fill="rgba(251,248,241,0.75)" />

        {/* Right window */}
        <rect x="92" y="76" width="24" height="22" rx="3" fill="#B8C8D9" stroke="#171717" strokeWidth="2" />
        <line x1="104" y1="76" x2="104" y2="98" stroke="#171717" strokeWidth="1.5" />
        <line x1="92" y1="87" x2="116" y2="87" stroke="#171717" strokeWidth="1.5" />
        <rect x="94" y="78" width="7" height="4" rx="1" fill="rgba(251,248,241,0.75)" />

        {/* Sunshine star top-left */}
        <path d="M28 32 L29.8 38 L36 39.2 L29.8 40.4 L28 46 L26.2 40.4 L20 39.2 L26.2 38 Z" fill="#F5C547" stroke="#171717" strokeWidth="1.5" strokeLinejoin="round" />

        {/* Small circle accent */}
        <circle cx="112" cy="50" r="6" fill="#5A8B7A" stroke="#171717" strokeWidth="2" />
        <circle cx="112" cy="50" r="2.5" fill="none" stroke="rgba(251,248,241,0.6)" strokeWidth="1.5" />

        {/* Twinkle on window */}
        <style>{`
          @keyframes ctl-homefinal-twinkle { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }
          .ctl-hf-twinkle { animation: ctl-homefinal-twinkle 2.8s ease-in-out infinite; }
        `}</style>
        <circle className="ctl-hf-twinkle" cx="44" cy="82" r="2.5" fill="#F5C547" />
      </svg>
    </div>
  );
}
