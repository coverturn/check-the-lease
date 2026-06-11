"use client";

export function DocumentMagnifyingIllustration({ className = "" }: { className?: string }) {
  return (
    <div className={className} style={{ width: "100%" }}>
      <svg viewBox="0 0 140 140" style={{ display: "block", maxWidth: 220, margin: "0 auto", width: "100%", height: "auto" }}>
        <g transform="rotate(-6 70 70)">
          <rect x="30" y="28" width="76" height="94" fill="#FBF8F1" stroke="#171717" strokeWidth="2.5" rx="3" />
          <rect x="38" y="38" width="42" height="4" fill="#171717" />
          <line x1="38" y1="52" x2="98" y2="52" stroke="#171717" strokeWidth="1.5" />
          <line x1="38" y1="60" x2="92" y2="60" stroke="#171717" strokeWidth="1.5" />
          <line x1="38" y1="68" x2="98" y2="68" stroke="#171717" strokeWidth="1.5" />
          <rect x="38" y="74" width="58" height="6" fill="#C97A4A" opacity="0.45" />
          <line x1="38" y1="80" x2="58" y2="80" stroke="#171717" strokeWidth="1.5" />
          <line x1="38" y1="88" x2="98" y2="88" stroke="#171717" strokeWidth="1.5" />
          <line x1="38" y1="96" x2="80" y2="96" stroke="#171717" strokeWidth="1.5" />
          <line x1="38" y1="104" x2="98" y2="104" stroke="#171717" strokeWidth="1.5" />
          <line x1="38" y1="112" x2="76" y2="112" stroke="#171717" strokeWidth="1.5" />
        </g>
        <g className="ctl-magnify">
          <circle cx="92" cy="78" r="22" fill="rgba(30,58,95,0.08)" stroke="#1E3A5F" strokeWidth="3" />
          <line x1="108" y1="94" x2="124" y2="110" stroke="#1E3A5F" strokeWidth="4" strokeLinecap="round" />
        </g>
        <style>{`
          @keyframes ctl-magnify-pulse { 0%, 100% { transform: rotate(0) scale(1); } 50% { transform: rotate(2deg) scale(1.04); } }
          .ctl-magnify { animation: ctl-magnify-pulse 5s ease-in-out infinite; transform-origin: 92px 78px; }
        `}</style>
      </svg>
    </div>
  );
}
