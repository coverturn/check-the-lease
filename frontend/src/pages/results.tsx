import { useState, useEffect } from "react";
import { SkipLink } from "@/components/SkipLink";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { HomeFinal } from "@/components/illustrations/HomeFinal";
import PhotoPacking from "@assets/DTS_Chicago_to_LA_Alex_Tan_Photos_ID2721_1777779569757.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { useT } from "@/lib/translations";
import { useChatContext } from "@/contexts/ChatContext";

type IntakeState = {
  state: string | null;
  stage: "before" | "already";
  perspective: "renter" | "landlord" | "both";
  isParent: boolean;
  receivesHousingAid: boolean;
  isStudent: boolean;
  reviewingForSomeoneElse: boolean;
};

type KeyTerm = { label: string; value: string; original_quote?: string };
type PotentialIssue = { severity: "low" | "medium" | "high"; title: string; explanation: string; citation?: string; original_quote?: string };
type MissingProtection = { title: string; explanation: string; helps: "renter" | "landlord" | "both" };
type ParentConsideration = { title: string; explanation: string };
type AnalysisResult = {
  key_terms: KeyTerm[];
  potential_issues: PotentialIssue[];
  missing_protections: { renter: MissingProtection[]; landlord: MissingProtection[] };
  parent_considerations?: ParentConsideration[];
  questions: string[];
  stats: { potential_issues: number; missing_protections: number; questions: number };
};

const DEFAULT_INTAKE: IntakeState = { state: "CA", stage: "before", perspective: "renter", isParent: false, receivesHousingAid: false, isStudent: false, reviewingForSomeoneElse: false };

const PLACEHOLDER_ANALYSIS: AnalysisResult = {
  key_terms: [
    { label: "RENT", value: "$3,200/month" }, { label: "SECURITY DEPOSIT", value: "$9,600" },
    { label: "LATE FEE", value: "Unspecified" }, { label: "LEASE TERM", value: "12 months" },
    { label: "RENEWAL", value: "Auto-renews · 90 days notice" }, { label: "ENTRY NOTICE", value: "None specified" },
    { label: "PETS", value: "$500/pet non-refundable" }, { label: "UTILITIES", value: "Tenant responsible" },
  ],
  potential_issues: [
    { severity: "high", title: "Security deposit exceeds the legal cap.", explanation: "California limits residential security deposits to two months' rent for unfurnished units. This lease asks for three months' rent. That's $3,200 over the legal maximum.", citation: "Cal. Civ. Code § 1950.5" },
    { severity: "high", title: "Self-help eviction language present.", explanation: "California requires a formal unlawful detainer process before excluding a tenant. Re-entry without a court order is illegal and could expose the landlord to significant liability.", citation: "Cal. Civ. Code § 789.3" },
    { severity: "medium", title: "Entry rights are broader than state law requires.", explanation: "California generally requires 24 hours' written notice for non-emergency entry. This clause says 'reasonable notice,' which is vague and may be used to enter without proper notice.", citation: "Cal. Civ. Code § 1954" },
    { severity: "medium", title: "Late fee amount is unspecified.", explanation: "California requires late fees to be a reasonable estimate of actual damages. 'As determined by Landlord' is likely unenforceable and open to abuse.", citation: "Cal. Civ. Code § 1671" },
  ],
  missing_protections: {
    renter: [
      { title: "21-day deposit return timeline.", explanation: "California requires the deposit to be returned with an itemised statement within 21 days. This lease does not mention a timeline.", helps: "renter" },
      { title: "Habitability statement.", explanation: "California implies a warranty of habitability. Putting it in writing reduces ambiguity and strengthens your position if issues arise.", helps: "both" },
      { title: "Clear repair response process.", explanation: "No timeline for how quickly the landlord will respond to repair requests. This matters when something breaks.", helps: "both" },
    ],
    landlord: [
      { title: "Written maintenance-request channel.", explanation: "Specifying email, app, or phone for repair requests reduces missed messages and creates a paper trail.", helps: "landlord" },
      { title: "Late-fee structure with specific amounts.", explanation: "A clear flat fee or percentage protects landlord rights and is more likely to be enforceable.", helps: "landlord" },
      { title: "Move-out condition expectations.", explanation: "Documenting expected condition at move-out reduces deposit-return disputes.", helps: "both" },
    ],
  },
  questions: [
    "Can you clarify how much notice is given before entry, and through what channel?",
    "Can the security deposit be reduced to two months' rent in line with California law?",
    "Can the late fee be specified as a fixed amount rather than 'as determined'?",
    "Can a clear repair-request channel and response timeline be added to the lease?",
    "Can the auto-renewal notice period be reduced from 90 days to 30 days?",
    "Can the one-sided attorney-fee clause be made reciprocal?",
    "Is there a written maintenance-response timeline you typically follow?",
  ],
  stats: { potential_issues: 4, missing_protections: 6, questions: 7 },
};

const STATE_NAMES: Record<string, string> = {
  CA: "California", TX: "Texas", FL: "Florida", NY: "New York", IL: "Illinois",
  PA: "Pennsylvania", OH: "Ohio", GA: "Georgia", NC: "North Carolina", MI: "Michigan",
};

const SEV_COLORS = {
  high: { color: "#7A2C3D", bg: "rgba(122,44,61,0.06)", border: "#7A2C3D", dot: "#7A2C3D", shadow: "5px 5px 0 0 #171717" },
  medium: { color: "#C97A4A", bg: "rgba(201,122,74,0.07)", border: "#C97A4A", dot: "#C97A4A", shadow: "5px 5px 0 0 #171717" },
  low: { color: "#5A8B7A", bg: "rgba(90,139,122,0.07)", border: "#5A8B7A", dot: "#5A8B7A", shadow: "5px 5px 0 0 #171717" },
};

function ComplianceScorePanel({ analysis, lang }: { analysis: AnalysisResult; lang: "en" | "es" }) {
  const highIssues = analysis.potential_issues.filter(i => i.severity === "high");
  const medIssues  = analysis.potential_issues.filter(i => i.severity === "medium");
  const lowIssues  = analysis.potential_issues.filter(i => i.severity === "low");
  const landlordGaps = analysis.missing_protections.landlord;
  
  const deductHigh = highIssues.length * 15;
  const deductMed  = medIssues.length * 8;
  const deductLow  = lowIssues.length * 3;
  const deductGaps = landlordGaps.length * 5;
  const score = Math.max(0, 100 - deductHigh - deductMed - deductLow - deductGaps);
  
  const grade: "A" | "B" | "C" | "D" | "F" =
    score >= 90 ? "A" :
    score >= 75 ? "B" :
    score >= 60 ? "C" :
    score >= 45 ? "D" : "F";

  const palette: Record<"A"|"B"|"C"|"D"|"F", { gradeColor: string; gradeBg: string; gradeShadow: string; summary: string }> = {
    A: { gradeColor: "#5A8B7A", gradeBg: "#F0F6F4", gradeShadow: "6px 6px 0 0 #5A8B7A", summary: "Legally solid. Minor tightening recommended but no critical exposure." },
    B: { gradeColor: "#1E3A5F", gradeBg: "#EEF3FA", gradeShadow: "6px 6px 0 0 #1E3A5F", summary: "Good foundation. A few gaps worth addressing before issuing." },
    C: { gradeColor: "#C97A4A", gradeBg: "#FDF6F0", gradeShadow: "6px 6px 0 0 #C97A4A", summary: "Needs attention. Some clauses may not hold up if enforced." },
    D: { gradeColor: "#C97A4A", gradeBg: "#FDF6F0", gradeShadow: "6px 6px 0 0 #C97A4A", summary: "Significant issues. Address flagged clauses before issuing this lease." },
    F: { gradeColor: "#7A2C3D", gradeBg: "#FDF0F2", gradeShadow: "6px 6px 0 0 #7A2C3D", summary: "High legal risk. This lease has clauses courts routinely void. Review before signing." },
  };

  const { gradeColor, gradeBg, gradeShadow, summary } = palette[grade];
  const deductions: { label: string; pts: number; color: string }[] = [];
  if (highIssues.length) deductions.push({ label: `${highIssues.length} high-risk clause${highIssues.length > 1 ? "s" : ""}`, pts: deductHigh, color: "#7A2C3D" });
  if (medIssues.length)  deductions.push({ label: `${medIssues.length} medium-risk clause${medIssues.length > 1 ? "s" : ""}`, pts: deductMed, color: "#C97A4A" });
  if (lowIssues.length)  deductions.push({ label: `${lowIssues.length} low-risk clause${lowIssues.length > 1 ? "s" : ""}`, pts: deductLow, color: "#5A8B7A" });
  if (landlordGaps.length) deductions.push({ label: `${landlordGaps.length} missing protection${landlordGaps.length > 1 ? "s" : ""}`, pts: deductGaps, color: "#1E3A5F" });

  return (
    <div style={{ border: "2.5px solid #171717", borderRadius: 20, overflow: "hidden", boxShadow: "6px 6px 0 0 #171717", marginBottom: "clamp(28px,4vw,44px)" }}>
      <div style={{ backgroundColor: "#171717", padding: "10px 24px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: gradeColor }} />
        <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(251,248,241,0.6)" }}>
          {lang === "es" ? "Puntuación de cumplimiento legal" : "Landlord compliance score"}
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", backgroundColor: "var(--color-bone)" }} className="compliance-score-grid">
        <div style={{ backgroundColor: gradeBg, borderRight: "2.5px solid #171717", padding: "clamp(28px,4vw,44px) clamp(24px,3vw,36px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, minWidth: 140 }}>
          <div style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(72px,10vw,96px)", lineHeight: 1, letterSpacing: "-0.05em", color: gradeColor }}>{grade}</div>
          <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 13, fontWeight: 700, color: gradeColor }}>{score}/100</div>
        </div>
        <div style={{ padding: "clamp(24px,3.5vw,36px)" }}>
          <p style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(16px,2vw,20px)", letterSpacing: "-0.02em", color: "var(--color-ink)", margin: "0 0 16px", lineHeight: 1.35 }}>
            {summary}
          </p>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-ink-muted)" }}>
                {lang === "es" ? "Puntuación" : "Score"}
              </span>
              <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 12, fontWeight: 700, color: gradeColor }}>{score}%</span>
            </div>
            <div style={{ height: 10, backgroundColor: "rgba(23,23,23,0.08)", borderRadius: 999, border: "1.5px solid rgba(23,23,23,0.12)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${score}%`, backgroundColor: gradeColor, borderRadius: 999, transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)" }} />
            </div>
          </div>
          {deductions.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {deductions.map(({ label, pts, color }) => (
                <div key={label} style={{ display: "inline-flex", alignItems: "center", gap: 4, backgroundColor: "rgba(23,23,23,0.04)", border: "1px solid rgba(23,23,23,0.1)", borderRadius: 6, padding: "4px 10px" }}>
                  <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 10, fontWeight: 700, color }}>{`−${pts}`}</span>
                  <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 11, color: "var(--color-ink-muted)" }}>{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getSev(sev: "high" | "medium" | "low", t: ReturnType<typeof useT>) {
  const c = SEV_COLORS[sev];
  const labels = {
    high: { label: t("results_sev_high_label"), sublabel: t("results_sev_high_sub") },
    medium: { label: t("results_sev_med_label"), sublabel: t("results_sev_med_sub") },
    low: { label: t("results_sev_low_label"), sublabel: t("results_sev_low_sub") },
  };
  return { ...c, ...labels[sev] };
}

function SevDot({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      backgroundColor: color,
      border: "2px solid #171717",
      flexShrink: 0,
    }} />
  );
}

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      style={{
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        border: `2px solid ${checked ? "#1E3A5F" : "#171717"}`,
        backgroundColor: checked ? "#1E3A5F" : "transparent",
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s ease",
      }}
    >
      {checked && (
        <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
          <path d="M1.5 5L5 8.5L11.5 1.5" stroke="#FBF8F1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
}

export default function Results() {
  const { lang } = useLanguage();
  const t = useT(lang);
  const { setChatCtx } = useChatContext();
  const [intake, setIntake] = useState<IntakeState>(DEFAULT_INTAKE);
  const [analysis, setAnalysis] = useState<AnalysisResult>(PLACEHOLDER_ANALYSIS);
  const [leaseText, setLeaseText] = useState<string>("");
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [expandedCitations, setExpandedCitations] = useState<Record<string, boolean>>({});
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState("section-action");

  useEffect(() => {
    const sectionIds = ["section-action", "section-terms", "section-issues", "section-protections"];
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-20% 0px -65% 0px" },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    try {
      const rawIntake = sessionStorage.getItem("ctl-intake");
      const parsedIntake: IntakeState = rawIntake ? { ...DEFAULT_INTAKE, ...JSON.parse(rawIntake) } : DEFAULT_INTAKE;
      setIntake(parsedIntake);
      const rawAnalysis = sessionStorage.getItem("ctl-analysis");
      const parsedAnalysis: AnalysisResult = rawAnalysis ? JSON.parse(rawAnalysis) : PLACEHOLDER_ANALYSIS;
      if (rawAnalysis) setAnalysis(parsedAnalysis);
      const rawLeaseText = sessionStorage.getItem("ctl-lease-text");
      if (rawLeaseText) {
        setLeaseText(rawLeaseText);
      } else if (parsedIntake.state === "CA") {
        // Fallback: show sample lease text for demo
        setLeaseText("RESIDENTIAL LEASE AGREEMENT Hollywood Heights Apartments Apex Property Management LLC 1247 Vine Street, Los Angeles, California 90028 LEASE AGREEMENT entered into this 1st day of March, 2026. LANDLORD: Apex Property Management LLC, a California limited liability company (\"Landlord\") TENANT: [Tenant Name] (\"Tenant\") PREMISES: Unit 4B, 1247 Vine Street, Los Angeles, California 90028 (\"Premises\") 1. TERM This Lease shall commence on March 1, 2026 and continue for a period of twelve (12) months, terminating on February 28, 2027. 2. RENT Tenant agrees to pay Landlord the sum of THREE THOUSAND TWO HUNDRED DOLLARS ($3,200.00) per month as rent for the Premises. 3. SECURITY DEPOSIT Upon execution of this Lease, Tenant shall deposit with Landlord the sum of NINE THOUSAND SIX HUNDRED DOLLARS ($9,600.00) as a security deposit.");
      }
      setChatCtx({
        state: parsedIntake.state,
        intake: parsedIntake.state ? {
          state: parsedIntake.state,
          stage: parsedIntake.stage,
          perspective: parsedIntake.perspective,
          isParent: parsedIntake.isParent,
          receivesHousingAid: parsedIntake.receivesHousingAid,
          isStudent: parsedIntake.isStudent,
          reviewingForSomeoneElse: parsedIntake.reviewingForSomeoneElse,
        } : null,
        analysisResult: rawAnalysis ? parsedAnalysis : null,
      });
    } catch { /* keep defaults */ }
  }, [setChatCtx]);

  const stateAbbr = intake.state || "CA";
  const stateLabel = STATE_NAMES[stateAbbr] || stateAbbr;
  const highCount = analysis.potential_issues.filter(i => i.severity === "high").length;
  const medCount = analysis.potential_issues.filter(i => i.severity === "medium").length;
  const verdictColor = highCount > 0 ? "#7A2C3D" : medCount > 0 ? "#C97A4A" : "#5A8B7A";
  const verdictBg = highCount > 0 ? "#FDF0F2" : medCount > 0 ? "#FDF6F0" : "#F0F6F4";
  const verdictLabel = highCount > 0 ? t("results_verdict_bad") : medCount > 0 ? t("results_verdict_mid") : t("results_verdict_good");
  const verdictBadge = highCount > 0 ? t("results_verdict_badge_bad") : medCount > 0 ? t("results_verdict_badge_mid") : t("results_verdict_badge_good");
  const verdictSub = highCount > 0 ? t("results_verdict_sub_bad", highCount) : medCount > 0 ? t("results_verdict_sub_mid") : t("results_verdict_sub_good");

  const AFTER_QUESTIONS_EN = [
    "Keep written copies of any maintenance requests and replies.",
    "Document the condition of the property with photos at move-in.",
    "Save copies of every rent payment receipt or bank confirmation.",
    "If the deposit is not returned within 21 days of move-out, an itemised statement may be due.",
    "Note any landlord entry events: date, time, and notice given (or not).",
    "Keep written communication on rent increases.",
    "If a clause is being enforced against you, consider speaking with a local tenant lawyer or legal aid.",
  ];
  const AFTER_QUESTIONS_ES = [
    "Guarda copias escritas de todas las solicitudes de mantenimiento y las respuestas.",
    "Documenta el estado de la propiedad con fotos al mudarte.",
    "Guarda copias de cada recibo de pago de renta o confirmación bancaria.",
    "Si el depósito no se devuelve en 21 días después de mudarte, es posible que se deba un estado de cuenta detallado.",
    "Anota cualquier entrada del arrendador: fecha, hora y aviso dado (o no).",
    "Mantén comunicación escrita sobre los aumentos de renta.",
    "Si se está aplicando una cláusula en tu contra, considera hablar con un abogado de inquilinos local o asistencia legal.",
  ];

  const questions = intake.stage === "before" ? analysis.questions : lang === "es" ? AFTER_QUESTIONS_ES : AFTER_QUESTIONS_EN;
  const allProts = intake.perspective === "landlord"
    ? analysis.missing_protections.landlord
    : [...analysis.missing_protections.renter, ...analysis.missing_protections.landlord.filter(p => p.helps === "both" && !analysis.missing_protections.renter.some(r => r.title === p.title))];

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const highIssues = analysis.potential_issues.filter(i => i.severity === "high");
  const medIssues = analysis.potential_issues.filter(i => i.severity === "medium");
  const lowIssues = analysis.potential_issues.filter(i => i.severity === "low");

  return (
    <div className="ctl-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--color-bone)", color: "var(--color-ink)" }}>
      <SkipLink />
      <Nav showAnalyseAnother={true} />

      <main id="main" style={{ flex: 1, width: "100%" }} role="main" aria-live="polite" aria-atomic="false">

        <div style={{ background: "#1E3A5F", position: "relative", overflow: "hidden" }}>
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" style={{ position: "absolute", top: "8%", right: "4%", animation: "star-twinkle 4s ease-in-out infinite", pointerEvents: "none" }}>
            <path d="M12 2 L14 9 L21 12 L14 15 L12 22 L10 15 L3 12 L10 9 Z" fill="#F5C547" stroke="#171717" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>

          <div style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(40px,6vw,64px) clamp(24px,4vw,48px) clamp(32px,5vw,48px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(251,248,241,0.5)" }}>
                {stateLabel} · {intake.stage === "before" ? t("results_pre_label") : t("results_post_label")} · {intake.perspective === "both" ? t("results_both_label") : intake.perspective === "renter" ? t("results_renter_label") : t("results_landlord_label")}
              </span>
            </div>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, backgroundColor: verdictBg, border: `2.5px solid ${verdictColor}`, borderRadius: 16, padding: "14px 20px", marginBottom: 20, boxShadow: `4px 4px 0 0 ${verdictColor}` }}>
              <SevDot color={verdictColor} size={16} />
              <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: verdictColor }}>
                {verdictBadge}
              </span>
            </div>

            <h1 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(34px, 5.5vw, 64px)", letterSpacing: "-0.03em", lineHeight: 1.0, color: "#FBF8F1", margin: "0 0 14px" }}>
              {verdictLabel}
            </h1>
            <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(14px,1.6vw,17px)", color: "rgba(251,248,241,0.65)", lineHeight: 1.6, margin: "0 0 clamp(28px,4vw,44px)", maxWidth: 560 }}>
              {verdictSub}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, maxWidth: 700 }} className="results-stats-grid">
              {[
                { n: analysis.stats.potential_issues, label: t("results_stat_issues"), color: analysis.stats.potential_issues > 0 ? "#7A2C3D" : "#5A8B7A" },
                { n: analysis.stats.missing_protections, label: t("results_stat_missing"), color: "#C97A4A" },
                { n: analysis.stats.questions, label: intake.stage === "before" ? t("results_stat_q_before") : t("results_stat_q_after"), color: "#1E3A5F" },
              ].map((statTile, i) => (
                <div key={i} style={{ background: "var(--color-bone)", border: "2.5px solid #171717", borderRadius: 16, padding: "clamp(16px,2.5vw,24px)", boxShadow: `4px 4px 0 0 ${statTile.color}` }}>
                  <div style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(42px,7vw,64px)", color: statTile.color, letterSpacing: "-0.04em", lineHeight: 1 }}>{statTile.n}</div>
                  <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 11, color: "var(--color-ink-muted)", marginTop: 6, lineHeight: 1.45, whiteSpace: "pre-line" }}>{statTile.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ width: "100%", height: "clamp(140px,16vw,220px)", overflow: "hidden", position: "relative", borderBottom: "2.5px solid #171717" }}>
          <img src={PhotoPacking} alt="Boxes and belongings mid-move, the moment of transition" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", display: "block" }} />
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(251,248,241,0.85) 0%, transparent 45%)" }} />
          <div style={{ position: "absolute", left: "clamp(24px,4vw,48px)", top: "50%", transform: "translateY(-50%)", fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: "clamp(14px,1.8vw,19px)", color: "var(--color-ink)", letterSpacing: "-0.02em", maxWidth: 360 }}>
            {t("results_photo_caption")}
          </div>
        </div>

        {leaseText && (
          <div style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(32px,5vw,48px) clamp(24px,4vw,48px)", borderBottom: "2.5px solid #171717" }}>
            <button
              onClick={() => setPreviewExpanded(!previewExpanded)}
              style={{
                width: "100%",
                padding: "18px 22px",
                backgroundColor: "#F0F6F4",
                border: "2.5px solid #5A8B7A",
                borderRadius: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: previewExpanded ? 14 : 0,
                transition: "all 0.2s ease",
                boxShadow: previewExpanded ? "4px 4px 0 0 #5A8B7A" : "2px 2px 0 0 #5A8B7A",
              }}
              aria-expanded={previewExpanded}
            >
              <span style={{ fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 15, color: "#5A8B7A", textAlign: "left" }}>
                {lang === "es" ? "Vista previa del contrato" : "Lease preview"}
              </span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ transform: previewExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>
                <path d="M5 8L10 13L15 8" stroke="#5A8B7A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {previewExpanded && (
              <div style={{ backgroundColor: "var(--color-bone)", border: "2.5px solid #5A8B7A", borderRadius: 14, padding: "22px 26px", boxShadow: "4px 4px 0 0 #5A8B7A" }}>
                <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#5A8B7A", marginBottom: 14 }}>
                  {lang === "es" ? "Primeras líneas del documento" : "First excerpt from your lease"}
                </div>
                <div style={{
                  fontFamily: "var(--app-font-sans)",
                  fontSize: 13,
                  color: "var(--color-ink)",
                  lineHeight: 1.7,
                  backgroundColor: "rgba(90,139,122,0.05)",
                  padding: "16px 18px",
                  borderRadius: 10,
                  border: "1px solid rgba(90,139,122,0.15)",
                  maxHeight: 280,
                  overflowY: "auto",
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  letterSpacing: "0.3px"
                }}>
                  {leaseText}
                </div>
                <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 11, color: "var(--color-ink-muted)", marginTop: 12, fontStyle: "italic" }}>
                  {lang === "es" ? "El análisis anterior se basó en este contenido. Usa esta vista previa para verificar cómo fueron interpretadas las cláusulas clave." : "The analysis above is based on this content. Use this preview to see how key clauses were interpreted."}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Sticky section nav ── */}
        <div style={{ position: "sticky", top: 62, zIndex: 30, backgroundColor: "rgba(251,248,241,0.97)", borderBottom: "1.5px solid rgba(23,23,23,0.08)", backdropFilter: "blur(8px)" }}>
          <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 clamp(24px,4vw,48px)", display: "flex", overflowX: "auto" }}>
            {[
              { id: "section-action", label: lang === "es" ? "Plan" : "Action plan" },
              { id: "section-terms", label: lang === "es" ? "Términos" : "Key terms" },
              { id: "section-issues", label: lang === "es" ? "Riesgos" : "Issues" },
              { id: "section-protections", label: lang === "es" ? "Vacíos" : "Gaps" },
            ].map(({ id, label }) => {
              const isActive = activeSection === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  style={{
                    fontFamily: "var(--app-font-sans)",
                    fontSize: 12,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "var(--color-ink)" : "var(--color-ink-muted)",
                    textDecoration: "none",
                    padding: "12px 16px",
                    borderBottom: `2px solid ${isActive ? "var(--color-ink)" : "transparent"}`,
                    transition: "color 0.12s, border-color 0.12s",
                    whiteSpace: "nowrap",
                    display: "block",
                  }}
                >
                  {label}
                </a>
              );
            })}
          </div>
        </div>

        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 clamp(24px,4vw,48px) clamp(48px,6vw,80px)" }}>

          <div id="section-action" style={{ scrollMarginTop: 110 }} />
          <section aria-labelledby="action-heading" style={{ marginBottom: "clamp(48px,7vw,80px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#1E3A5F", border: "2px solid #171717", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--app-font-mono)", fontWeight: 700, fontSize: 13, color: "#FBF8F1" }}>1</span>
              </div>
              <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--color-ink-muted)" }}>{lang === "es" ? "Empieza aquí" : "START HERE"}</span>
            </div>
            <h2 id="action-heading" style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(26px,3.5vw,36px)", color: "var(--color-ink)", letterSpacing: "-0.025em", margin: "0 0 6px" }}>
              {lang === "es" ? "Tu plan de acción" : "Your action plan"}
            </h2>
            <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "var(--color-ink-muted)", marginBottom: 24, lineHeight: 1.5 }}>
              {intake.stage === "before"
                ? (lang === "es" ? "Completa estos pasos antes de firmar." : "Complete these steps before you sign.")
                : (lang === "es" ? "Implementa estas prácticas mientras vives aquí." : "Implement these practices while you live here.")}
            </p>

            <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, height: 10, backgroundColor: "rgba(30,58,95,0.1)", borderRadius: 999, border: "1.5px solid rgba(30,58,95,0.2)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(checkedCount / questions.length) * 100}%`, backgroundColor: "#1E3A5F", borderRadius: 999, transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)" }} />
              </div>
              <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 11, fontWeight: 700, color: "#1E3A5F", flexShrink: 0, minWidth: 48, textAlign: "right" }}>
                {checkedCount}/{questions.length}
              </span>
            </div>

            <div style={{ border: "2.5px solid #171717", borderRadius: 18, overflow: "hidden", boxShadow: "6px 6px 0 0 #171717" }}>
              {questions.map((q, i) => {
                const done = checkedItems[i];
                return (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 18, padding: "22px 26px", backgroundColor: done ? "rgba(30,58,95,0.04)" : "var(--color-bone)", borderBottom: i === questions.length - 1 ? "none" : "1.5px solid rgba(23,23,23,0.08)", transition: "background-color 0.2s ease" }}>
                    <Checkbox checked={!!done} onChange={() => setCheckedItems(prev => ({ ...prev, [i]: !prev[i] }))} />
                    <div style={{ flex: 1, paddingTop: 2 }}>
                      <span style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(14px,1.7vw,16px)", color: done ? "var(--color-ink-muted)" : "var(--color-ink)", lineHeight: 1.6, textDecoration: done ? "line-through" : "none", opacity: done ? 0.55 : 1, transition: "all 0.2s ease" }}>
                        {q}
                      </span>
                    </div>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "rgba(23,23,23,0.05)", border: "1.5px solid rgba(23,23,23,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 10, fontWeight: 700, color: "var(--color-ink-muted)" }}>{i + 1}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {(intake.perspective === "landlord" || intake.perspective === "both") && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "clamp(32px,5vw,48px)", marginTop: "clamp(48px,7vw,80px)" }}>
                <div style={{ flex: 1, height: "1.5px", backgroundColor: "rgba(23,23,23,0.1)" }} />
                <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(23,23,23,0.25)", flexShrink: 0 }}>
                  {lang === "es" ? "para propietarios" : "for landlords"}
                </span>
                <div style={{ flex: 1, height: "1.5px", backgroundColor: "rgba(23,23,23,0.1)" }} />
              </div>
              <ComplianceScorePanel analysis={analysis} lang={lang} />
            </>
          )}

          <div id="section-terms" style={{ scrollMarginTop: 110 }} />
          <section aria-labelledby="terms-heading" style={{ marginBottom: "clamp(48px,7vw,80px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#1E3A5F", border: "2px solid #171717", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--app-font-mono)", fontWeight: 700, fontSize: 13, color: "#FBF8F1" }}>2</span>
              </div>
              <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--color-ink-muted)" }}>{t("results_section01_eyebrow")}</span>
            </div>
            <h2 id="terms-heading" style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(26px,3.5vw,36px)", color: "var(--color-ink)", letterSpacing: "-0.025em", margin: "0 0 6px" }}>
              {t("results_section01_heading")}
            </h2>
            <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "var(--color-ink-muted)", marginBottom: 24, lineHeight: 1.5 }}>
              {lang === "es" ? "Los números más importantes del contrato. Usa estos para comparar con la ley de tu estado." : "The key numbers from your lease. Use these to compare against state law and typical terms."}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 10 }} className="action-cards-grid">
              {analysis.key_terms.map((term, i) => (
                <div key={i} style={{ backgroundColor: "var(--color-bone)", border: "2.5px solid #171717", borderRadius: 14, padding: "20px 22px", boxShadow: "4px 4px 0 0 #171717", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", bottom: -6, right: 12, fontFamily: "var(--app-font-serif)", fontWeight: 900, fontSize: 80, color: "rgba(23,23,23,0.03)", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>{i + 1}</div>
                  <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--color-sage)", marginBottom: 10 }}>{term.label}</div>
                  <div style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(18px,2.5vw,22px)", color: "var(--color-ink)", letterSpacing: "-0.02em", lineHeight: 1.25 }}>{term.value}</div>
                </div>
              ))}
            </div>
          </section>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "clamp(32px,5vw,48px)" }}>
            <div style={{ flex: 1, height: "1.5px", backgroundColor: "rgba(23,23,23,0.1)" }} />
            <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(23,23,23,0.25)", flexShrink: 0 }}>
              {lang === "es" ? "riesgos encontrados" : "risks by severity"}
            </span>
            <div style={{ flex: 1, height: "1.5px", backgroundColor: "rgba(23,23,23,0.1)" }} />
          </div>

          <div id="section-issues" style={{ scrollMarginTop: 110 }} />
          <section aria-labelledby="issues-heading" style={{ marginBottom: "clamp(48px,7vw,80px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#7A2C3D", border: "2px solid #171717", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--app-font-mono)", fontWeight: 700, fontSize: 13, color: "#FBF8F1" }}>3</span>
              </div>
              <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--color-ink-muted)" }}>{t("results_section02_eyebrow")}</span>
            </div>
            <h2 id="issues-heading" style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(26px,3.5vw,36px)", color: "var(--color-ink)", letterSpacing: "-0.025em", margin: "0 0 6px" }}>
              {t("results_section02_heading")}
            </h2>
            <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "var(--color-ink-muted)", marginBottom: 28, lineHeight: 1.5 }}>
              {lang === "es" ? "Problemas agrupados por urgencia. Prioriza los riesgos altos primero." : "Problems grouped by urgency. Address high-risk issues first."}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { severity: "high" as const, issues: highIssues },
                { severity: "medium" as const, issues: medIssues },
                { severity: "low" as const, issues: lowIssues },
              ].map(({ severity, issues }) => issues.length > 0 && (
                <div key={severity}>
                  <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: SEV_COLORS[severity].color, marginBottom: 10 }}>
                    {severity === "high" && (lang === "es" ? "Riesgos altos. Act ahora" : "HIGH RISK. Address immediately")}
                    {severity === "medium" && (lang === "es" ? "Riesgos medianos. Aclarar" : "MEDIUM RISK. Clarify in writing")}
                    {severity === "low" && (lang === "es" ? "Riesgos bajos. Ten en mente" : "LOW RISK. Keep in mind")}
                  </div>
                  {issues.map((issue, i) => {
                    const s = getSev(severity, t);
                    const citationShown = expandedCitations[`${severity}-${i}`];
                    return (
                      <article key={i} style={{ backgroundColor: "var(--color-bone)", border: "2.5px solid #171717", borderTop: `7px solid ${s.border}`, borderRadius: 18, overflow: "hidden", boxShadow: s.shadow, marginBottom: 12 }}>
                        <div style={{ padding: "22px 26px 0" }}>
                          <h3 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(19px,2.8vw,24px)", color: "var(--color-ink)", letterSpacing: "-0.02em", lineHeight: 1.25, margin: "0 0 16px" }}>
                            {issue.title}
                          </h3>
                        </div>
                        <div style={{ margin: "0 26px 0", backgroundColor: s.bg, borderRadius: 12, padding: "14px 18px", border: `1.5px solid ${s.border}`, borderLeft: `4px solid ${s.border}` }}>
                          <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(13px,1.5vw,15px)", color: "var(--color-ink)", lineHeight: 1.65, margin: 0 }}>{issue.explanation}</p>
                        </div>
                        <div style={{ margin: "10px 26px 0", display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 14px", backgroundColor: s.bg, borderRadius: 8, border: `1px solid ${s.border}`, borderLeftWidth: 3 }}>
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }}>
                            <path d="M1.5 7L5 10.5L11.5 2.5" stroke={s.color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 12, fontWeight: 600, color: s.color, lineHeight: 1.55 }}>
                            {severity === "high"
                              ? (lang === "es" ? "Pide que el arrendador corrija esto antes de firmar." : "Ask the landlord to fix this before you sign.")
                              : severity === "medium"
                              ? (lang === "es" ? "Pide aclaración por escrito antes de firmar." : "Ask the landlord to clarify this in writing.")
                              : (lang === "es" ? "Tenlo en mente. Podría importar más adelante." : "Keep this in mind. It may matter later.")}
                          </span>
                        </div>
                        <div style={{ padding: "14px 26px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                          {issue.citation && (
                            <button
                              onClick={() => setExpandedCitations(prev => ({ ...prev, [`${severity}-${i}`]: !prev[`${severity}-${i}`] }))}
                              style={{ display: "inline-flex", alignItems: "center", gap: 7, backgroundColor: "rgba(23,23,23,0.05)", border: "1.5px solid rgba(23,23,23,0.15)", borderRadius: 8, padding: "7px 13px", cursor: "pointer", fontFamily: "var(--app-font-mono)", fontSize: 11, color: "var(--color-ink)", transition: "border-color 0.15s, background-color 0.15s" }}
                              aria-expanded={citationShown}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = s.border; (e.currentTarget as HTMLElement).style.backgroundColor = s.bg; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(23,23,23,0.15)"; (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(23,23,23,0.05)"; }}
                            >
                              <span aria-hidden="true" style={{ fontSize: 12, color: s.color }}>§</span>
                              {citationShown ? issue.citation : (lang === "es" ? "Ver la ley" : "See the law")}
                              <span aria-hidden="true" style={{ fontSize: 9, opacity: 0.45 }}>{citationShown ? "▲" : "▼"}</span>
                            </button>
                          )}
                          <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 11, color: "var(--color-ink-muted)", fontStyle: "italic" }}>
                            {lang === "es" ? "Solo información - no asesoría legal." : "Not legal advice - information only."}
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>

          {allProts.length > 0 && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "clamp(32px,5vw,48px)", marginTop: "clamp(48px,7vw,80px)" }}>
                <div style={{ flex: 1, height: "1.5px", backgroundColor: "rgba(23,23,23,0.1)" }} />
                <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(23,23,23,0.25)", flexShrink: 0 }}>
                  {lang === "es" ? "lo que falta" : "gaps to address"}
                </span>
                <div style={{ flex: 1, height: "1.5px", backgroundColor: "rgba(23,23,23,0.1)" }} />
              </div>

              <div id="section-protections" style={{ scrollMarginTop: 110 }} />
              <section aria-labelledby="protections-heading" style={{ marginBottom: "clamp(48px,7vw,80px)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#C97A4A", border: "2px solid #171717", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "var(--app-font-mono)", fontWeight: 700, fontSize: 13, color: "#FBF8F1" }}>4</span>
                  </div>
                  <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--color-ink-muted)" }}>{t("results_section03_eyebrow")}</span>
                </div>
                <h2 id="protections-heading" style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(26px,3.5vw,36px)", color: "var(--color-ink)", letterSpacing: "-0.025em", margin: "0 0 6px" }}>
                  {t("results_section03_heading")}
                </h2>
                <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "var(--color-ink-muted)", marginBottom: 28, lineHeight: 1.5 }}>
                  {t("results_section03_sub")}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {allProts.map((item, i) => (
                    <article key={i} style={{ backgroundColor: "var(--color-bone)", border: "2.5px solid #171717", borderTop: "6px solid #C97A4A", borderRadius: 16, padding: "20px 24px", boxShadow: "5px 5px 0 0 #171717", display: "flex", alignItems: "flex-start", gap: 16 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#C97A4A", border: "2px solid #171717", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                        <span style={{ fontFamily: "var(--app-font-mono)", fontWeight: 700, fontSize: 12, color: "#FBF8F1" }}>{i + 1}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(16px,2vw,19px)", color: "var(--color-ink)", letterSpacing: "-0.02em", margin: "0 0 7px" }}>{item.title}</h3>
                        <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "rgba(23,23,23,0.72)", lineHeight: 1.65, margin: 0 }}>{item.explanation}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </>
          )}

          {(analysis.parent_considerations?.length ?? 0) > 0 && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "clamp(32px,5vw,48px)", marginTop: "clamp(48px,7vw,80px)" }}>
                <div style={{ flex: 1, height: "1.5px", backgroundColor: "rgba(23,23,23,0.1)" }} />
                <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(23,23,23,0.25)", flexShrink: 0 }}>
                  {lang === "es" ? "para padres" : "for parents"}
                </span>
                <div style={{ flex: 1, height: "1.5px", backgroundColor: "rgba(23,23,23,0.1)" }} />
              </div>

              <section aria-labelledby="parent-heading" style={{ marginBottom: "clamp(48px,7vw,80px)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#5A8B7A", border: "2px solid #171717", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "var(--app-font-mono)", fontWeight: 700, fontSize: 11, color: "#FBF8F1" }}>+</span>
                  </div>
                  <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--color-ink-muted)" }}>{t("results_parent_eyebrow")}</span>
                </div>
                <h2 id="parent-heading" style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(26px,3.5vw,36px)", color: "var(--color-ink)", letterSpacing: "-0.025em", margin: "0 0 6px" }}>{t("results_parent_heading")}</h2>
                <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "var(--color-ink-muted)", marginBottom: 28, lineHeight: 1.5 }}>{t("results_parent_sub")}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {analysis.parent_considerations!.map((item, i) => (
                    <article key={i} style={{ backgroundColor: "var(--color-bone)", border: "2.5px solid #171717", borderTop: "6px solid #5A8B7A", borderRadius: 16, padding: "20px 24px", boxShadow: "5px 5px 0 0 #171717", display: "flex", alignItems: "flex-start", gap: 16 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#5A8B7A", border: "2px solid #171717", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                        <span style={{ fontFamily: "var(--app-font-mono)", fontWeight: 700, fontSize: 12, color: "#FBF8F1" }}>{i + 1}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(16px,2vw,19px)", color: "var(--color-ink)", letterSpacing: "-0.02em", margin: "0 0 7px" }}>{item.title}</h3>
                        <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "rgba(23,23,23,0.72)", lineHeight: 1.65, margin: 0 }}>{item.explanation}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* ── Resources teaser ── */}
          <div style={{ backgroundColor: "#1E3A5F", border: "2.5px solid #171717", borderRadius: 18, padding: "clamp(24px,3.5vw,36px)", boxShadow: "6px 6px 0 0 #171717", marginBottom: "clamp(48px,7vw,80px)", marginTop: "clamp(48px,7vw,80px)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "clamp(20px,3vw,40px)", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 200px" }}>
                <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.18em", color: "rgba(251,248,241,0.4)", marginBottom: 10 }}>
                  {lang === "es" ? "Recursos gratuitos" : "Free resources"}
                </div>
                <p style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(18px,2.5vw,24px)", color: "#FBF8F1", letterSpacing: "-0.025em", lineHeight: 1.25, margin: "0 0 10px" }}>
                  {stateLabel} legal aid - free and nearby.
                </p>
                <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "rgba(251,248,241,0.55)", lineHeight: 1.65, margin: 0 }}>
                  {lang === "es"
                    ? "Encuentra abogados de inquilinos y asistencia legal gratuita en tu área."
                    : "Find tenant lawyers and free legal aid organizations serving your area. No cost to browse."}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                <a href="/resources" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 13, textTransform: "uppercase" as const, letterSpacing: "0.06em", color: "#1E3A5F", backgroundColor: "#FBF8F1", border: "2.5px solid #FBF8F1", borderRadius: 999, padding: "12px 24px", textDecoration: "none", boxShadow: "4px 4px 0 0 rgba(251,248,241,0.2)", whiteSpace: "nowrap" as const }}>
                  {lang === "es" ? "Ver recursos →" : "Find legal help →"}
                </a>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0 clamp(32px,5vw,56px)", borderTop: "2.5px solid #171717", marginTop: "clamp(48px,7vw,80px)" }}>
            <p style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: "clamp(24px,3.5vw,36px)", color: "var(--color-ink)", letterSpacing: "-0.025em", marginBottom: 24, textAlign: "center" }}>
              {lang === "es" ? "ahora ve a hacer de ese lugar tu hogar." : "now go make it home."}
            </p>
            <div aria-hidden="true"><HomeFinal size={140} /></div>
            <a href="/upload" style={{ marginTop: 28, display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.08em", color: "#FBF8F1", backgroundColor: "#1E3A5F", border: "2.5px solid #171717", borderRadius: 999, padding: "16px 32px", textDecoration: "none", boxShadow: "4px 4px 0 0 #171717", transition: "transform 0.1s ease" }}>
              {lang === "es" ? "Analizar otro contrato →" : "Check another lease →"}
            </a>
          </div>

        </div>
      </main>

      {!bannerDismissed && (
        <div role="complementary" aria-label="Legal disclaimer" style={{ backgroundColor: "rgba(23,23,23,0.04)", borderTop: "1.5px solid rgba(23,23,23,0.1)", padding: "14px 24px" }}>
          <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 12, color: "var(--color-ink-muted)", lineHeight: 1.5, flex: 1 }}>
              {lang === "es"
                ? <><strong>No es asesoría legal.</strong> Check the Lease solo proporciona información legal. No somos un bufete de abogados. Para asesoramiento sobre tu situación específica, consulta a un abogado calificado.</>
                : <><strong>Not legal advice.</strong> Check the Lease provides legal information only. We are not a law firm. For advice on your specific situation, consult a qualified attorney.</>}
            </p>
            <button onClick={() => setBannerDismissed(true)} aria-label="Dismiss" style={{ fontFamily: "var(--app-font-sans)", fontSize: 20, color: "var(--color-ink-muted)", backgroundColor: "transparent", border: "none", cursor: "pointer", padding: "4px 8px", minHeight: 44, minWidth: 44, lineHeight: 1 }}>×</button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
