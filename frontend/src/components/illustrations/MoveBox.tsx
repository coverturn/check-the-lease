export function MoveBox({ className = "", size = 140 }: { className?: string; size?: number }) {
  return (
    <div className={className} style={{ width: "100%" }}>
      <svg viewBox="0 0 140 140" style={{ display: "block", maxWidth: size, margin: "0 auto", width: "100%", height: "auto" }} className="ctl-illust-bob">
        <path d="M88,60 L108,45 L108,100 L88,115 Z" fill="#BFA070" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round"/>
        <path d="M28,60 L48,45 L108,45 L88,60 Z" fill="#E0CAA5" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round"/>
        <path d="M28,60 L88,60 L88,115 L28,115 Z" fill="#D4B896" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round"/>
        <line x1="38" y1="52" x2="98" y2="52" stroke="#5A8B7A" strokeWidth="3.5" strokeLinecap="round"/>
        <line x1="58" y1="60" x2="58" y2="115" stroke="#171717" strokeWidth="1.5" opacity="0.4" strokeDasharray="3,3"/>
        <path d="M48,90 c-3,-4 3,-8 6,-4 c3,-4 9,0 6,4 l-6,6 z" fill="#C97A4A" stroke="#171717" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
      <style>{`
        @keyframes ctl-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .ctl-illust-bob { animation: ctl-bob 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
