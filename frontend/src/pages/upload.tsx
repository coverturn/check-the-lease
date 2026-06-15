import { useState, useRef, useEffect, useMemo } from "react";
import { track } from "@/lib/track";
import { useLocation } from "wouter";
import { SkipLink } from "@/components/SkipLink";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useT } from "@/lib/translations";

type IntakeForm = {
  file: File | null;
  state: string | null;
  stage: "before" | "already";
  perspective: "renter" | "landlord" | "both";
  isParent: boolean;
  receivesHousingAid: boolean;
  isStudent: boolean;
  reviewingForSomeoneElse: boolean;
  language: "en" | "es";
};

function formatBytes(bytes: number, decimals = 1) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const STEP_COLORS = ["#5A8B7A", "#1E3A5F", "#C97A4A", "#7A2C3D"];

function StepBadge({ n, label }: { n: string; label: string }) {
  const idx = parseInt(n, 10) - 1;
  const color = STEP_COLORS[idx] ?? "#5A8B7A";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "2px 2px 0 0 #171717" }}>
        <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 11, fontWeight: 700, color: "white", lineHeight: 1 }}>{n}</span>
      </div>
      <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.14em", color }}>{label}</span>
    </div>
  );
}

export default function Upload() {
  const [, navigate] = useLocation();
  const { lang } = useLanguage();
  const t = useT(lang);
  const LOADING_MESSAGES = [t("loading_1"), t("loading_2"), t("loading_3"), t("loading_4")];
  const STEP_LABELS = [t("upload_step1"), t("upload_step2"), t("upload_step3"), t("upload_step4")];
  const [form, setForm] = useState<IntakeForm>({
    file: null,
    state: null,
    stage: "before",
    perspective: "renter",
    isParent: false,
    receivesHousingAid: false,
    isStudent: false,
    reviewingForSomeoneElse: false,
    language: lang,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isHoverSubmit, setIsHoverSubmit] = useState(false);
  const [isHoverSample, setIsHoverSample] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);
  const [clausesScanned, setClausesScanned] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const s = new URLSearchParams(window.location.search).get("state");
      const saved = s ? s.toUpperCase() : (localStorage.getItem("ctl-state") || "").toUpperCase() || null;
      if (saved) setForm((f) => ({ ...f, state: saved }));
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    if (!isAnalysing) { setMsgIdx(0); return; }
    const t = setInterval(() => setMsgIdx((i) => Math.min(i + 1, LOADING_MESSAGES.length - 1)), 2200);
    return () => clearInterval(t);
  }, [isAnalysing]);

  useEffect(() => {
    if (!isAnalysing) { setClausesScanned(0); return; }
    const t = setInterval(() => setClausesScanned((n) => (n < 32 ? n + 1 : n)), 280);
    return () => clearInterval(t);
  }, [isAnalysing]);

  const fileURL = useMemo(() => (form.file ? URL.createObjectURL(form.file) : null), [form.file]);
  useEffect(() => () => { if (fileURL) URL.revokeObjectURL(fileURL); }, [fileURL]);

  useEffect(() => { track("upload_view"); }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const validateFile = (file: File): string | null => {
    if (!file.type.includes("pdf") && !file.name.endsWith(".pdf")) {
      return "This file doesn't look like a PDF. Please upload a .pdf file.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return `That file is over the 25MB limit. Try compressing it first (Adobe, Smallpdf, ilovepdf are all free), then re-upload.`;
    }
    return null;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const err = validateFile(file);
      if (err) { setFileError(err); return; }
      setFileError(null);
      setForm((f) => ({ ...f, file }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const err = validateFile(file);
      if (err) { setFileError(err); return; }
      setFileError(null);
      setForm((f) => ({ ...f, file }));
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setForm((f) => ({ ...f, file: null }));
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const loadSampleLease = async () => {
    setIsAnalysing(true);
    setError(null);
    track("scan_started", { source: "sample" });
    try {
      const res = await fetch("/sample-lease.pdf");
      const blob = await res.blob();
      const file = new File([blob], "sample-lease-california.pdf", { type: "application/pdf" });
      const formData = new FormData();
      formData.append("lease", file);
      const sampleIntake = { state: "CA", stage: "before", perspective: "renter", isParent: form.isParent, receivesHousingAid: form.receivesHousingAid, isStudent: form.isStudent, reviewingForSomeoneElse: form.reviewingForSomeoneElse, language: lang };
      formData.append("intake", JSON.stringify(sampleIntake));
      const [response] = await Promise.all([
        fetch("/api/analyze", { method: "POST", body: formData }),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ]);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis failed.");
      sessionStorage.setItem("ctl-intake", JSON.stringify(sampleIntake));
      sessionStorage.setItem("ctl-analysis", JSON.stringify(data.analysis));
      sessionStorage.removeItem("ctl-paid"); sessionStorage.removeItem("ctl-saved-token"); // new scan = fresh report
      if (data.leaseText) sessionStorage.setItem("ctl-lease-text", data.leaseText);
      navigate("/results/demo");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not load the sample lease.";
      setError(msg);
      setIsAnalysing(false);
    }
  };

  const isFormValid = form.file !== null && form.state !== null;

  const handleSubmit = async () => {
    if (!isFormValid || !form.file || !form.state) return;
    setIsAnalysing(true);
    setError(null);
    track("scan_started", { source: "upload" });
    try {
      const formData = new FormData();
      formData.append("lease", form.file);
      const intake = { state: form.state, stage: form.stage, perspective: form.perspective, isParent: form.isParent, receivesHousingAid: form.receivesHousingAid, isStudent: form.isStudent, reviewingForSomeoneElse: form.reviewingForSomeoneElse, language: lang };
      formData.append("intake", JSON.stringify(intake));
      const response = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis failed.");
      sessionStorage.setItem("ctl-intake", JSON.stringify(intake));
      sessionStorage.setItem("ctl-analysis", JSON.stringify(data.analysis));
      sessionStorage.removeItem("ctl-paid"); sessionStorage.removeItem("ctl-saved-token"); // new scan = fresh report
      if (data.leaseText) sessionStorage.setItem("ctl-lease-text", data.leaseText);
      navigate(`/results/${Math.random().toString(36).slice(2, 10)}`);
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : "Something went wrong.";
      const msg = raw.toLowerCase().includes("pdf") || raw.toLowerCase().includes("parse")
        ? "We had trouble reading this PDF. If it's a scanned document, try running it through a free OCR tool (like ilovepdf.com) first, then re-upload."
        : raw.toLowerCase().includes("timeout") || raw.toLowerCase().includes("network")
          ? "The connection timed out. Check your network and try again."
          : raw;
      setError(msg);
      setIsAnalysing(false);
    }
  };

  if (isAnalysing) {
    return (
      <div className="ctl-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#1E3A5F", color: "var(--color-bone)" }}>
        <style>{`
          @keyframes ctl-scanline { 0% { top: 2%; } 100% { top: 98%; } }
          @keyframes ctl-pulse { 0%,100% { opacity: 0.45; } 50% { opacity: 1; } }
          .ctl-scanline { animation: ctl-scanline 2.2s cubic-bezier(0.45,0,0.55,1) infinite alternate; }
          @media (max-width: 800px) { .ctl-scan-grid { grid-template-columns: 1fr !important; } .ctl-scan-doc { max-width: 300px; margin: 0 auto; } }
          @media (prefers-reduced-motion: reduce) { .ctl-scanline { animation: none; opacity: 0; } }
        `}</style>
        <SkipLink />
        <Nav />
        <main id="main" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(32px,5vw,56px) clamp(24px,4vw,48px)" }} role="status" aria-live="polite" aria-atomic="true">
          <div className="ctl-scan-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 340px) minmax(0, 1fr)", gap: "clamp(28px,4vw,56px)", alignItems: "center", maxWidth: 880, width: "100%" }}>
            <div className="ctl-scan-doc" style={{ position: "relative", aspectRatio: "3 / 4", borderRadius: 14, overflow: "hidden", border: "2.5px solid #171717", boxShadow: "6px 6px 0 0 #F5C547", backgroundColor: "#FBF8F1" }}>
              {fileURL ? (
                <iframe src={fileURL + "#toolbar=0&navpanes=0&scrollbar=0&view=FitH"} title={lang === "es" ? "Tu contrato" : "Your lease"} style={{ width: "100%", height: "100%", border: "none", pointerEvents: "none" }} />
              ) : (
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, padding: 26, display: "flex", flexDirection: "column", gap: 9 }}>
                  {[92,80,86,70,88,60,84,76,90,64,82,72].map((w, i) => (
                    <div key={i} style={{ height: 7, width: `${w}%`, borderRadius: 3, backgroundColor: "rgba(23,23,23,0.12)" }} />
                  ))}
                </div>
              )}
              <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(30,58,95,0.05), rgba(30,58,95,0.16))", pointerEvents: "none" }} />
              <div className="ctl-scanline" aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, height: 3, background: "#F5C547", boxShadow: "0 0 18px 3px rgba(245,197,71,0.8)", pointerEvents: "none" }} />
              <div aria-hidden="true" style={{ position: "absolute", top: 12, left: 12, display: "inline-flex", alignItems: "center", gap: 7, backgroundColor: "rgba(23,23,23,0.82)", borderRadius: 999, padding: "5px 12px" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#F5C547", animation: "ctl-pulse 1.2s ease-in-out infinite" }} />
                <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#FBF8F1" }}>{lang === "es" ? "Escaneando" : "Scanning"}</span>
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--app-font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "#F5C547", marginBottom: 14 }}>
                {((form.state === "CA" || !form.state) ? "California" : form.state)}{lang === "es" ? " · revisión legal" : " · law check"}
              </div>
              <h1 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(28px,4vw,44px)", color: "var(--color-bone)", letterSpacing: "-0.03em", lineHeight: 1.08, margin: "0 0 26px" }}>
                {lang === "es" ? "Leyendo tu contrato." : "Reading your lease."}
              </h1>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
                {LOADING_MESSAGES.map((label, i) => {
                  const done = i < msgIdx; const active = i === msgIdx;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, opacity: done || active ? 1 : 0.4, transition: "opacity 0.3s ease" }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, border: `2px solid ${done || active ? "#F5C547" : "rgba(251,248,241,0.3)"}`, backgroundColor: done ? "#F5C547" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {done ? (
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 6.2L4.8 9L10 3" stroke="#1E3A5F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        ) : active ? (
                          <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#F5C547", animation: "ctl-pulse 1.2s ease-in-out infinite" }} />
                        ) : null}
                      </div>
                      <span style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(14px,1.7vw,16px)", fontWeight: active ? 600 : 400, color: "var(--color-bone)" }}>{label}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 22 }}>
                <span style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: 32, color: "#F5C547", letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>{clausesScanned}</span>
                <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "rgba(251,248,241,0.6)" }}>{lang === "es" ? "cláusulas revisadas" : "clauses scanned"}</span>
              </div>
              <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 12.5, color: "rgba(251,248,241,0.45)", lineHeight: 1.55, margin: 0 }}>
                {lang === "es" ? "Tu contrato nunca se guarda · unos 5–15 segundos" : "Your lease is never stored · about 5–15 seconds"}
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="ctl-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--color-bone)", color: "var(--color-ink)" }}>
      <SkipLink />
      <Nav />
      <main id="main" style={{ flex: 1, width: "100%" }} role="main">

        <div style={{ background: "#1E3A5F", padding: "clamp(28px,5vw,48px) clamp(24px,4vw,48px) clamp(24px,4vw,40px)", position: "relative", overflow: "hidden" }}>
          <svg aria-hidden="true" width="28" height="28" viewBox="0 0 28 28" style={{ position: "absolute", top: "12%", right: "7%", animation: "star-twinkle 4s ease-in-out infinite", pointerEvents: "none" }}>
            <path d="M14 2 L16 10 L24 13 L16 16 L14 26 L12 16 L4 13 L12 10 Z" fill="#F5C547" stroke="#171717" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" style={{ position: "absolute", bottom: "20%", left: "5%", animation: "blob-bob 9s ease-in-out infinite 2s", pointerEvents: "none" }}>
            <circle cx="10" cy="10" r="7" fill="#F4A480" stroke="#171717" strokeWidth="2"/>
          </svg>
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" style={{ position: "absolute", top: "55%", right: "15%", animation: "blob-bob 13s ease-in-out infinite 5s", pointerEvents: "none", opacity: 0.5 }}>
            <path d="M8 2 L8 14 M2 8 L14 8" stroke="rgba(251,248,241,0.2)" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr auto", gap: "clamp(24px,4vw,48px)", alignItems: "flex-end" }} className="ctl-upload-header-grid upload-header-grid">
            <div>
              <h1 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(26px,4vw,40px)", letterSpacing: "-0.03em", lineHeight: 1.08, color: "var(--color-bone)", margin: "0 0 10px" }}>
                Read it once. <em style={{ fontStyle: "italic", color: "rgba(251,248,241,0.4)" }}>Know it completely.</em>
              </h1>
              <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(13px,1.4vw,15px)", color: "rgba(251,248,241,0.5)", lineHeight: 1.65, maxWidth: 520, margin: 0 }}>
                Analyzed in seconds, then discarded — your lease is never stored. No account, no email, no payment. Free scan and full report.
              </p>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 720, margin: "0 auto", padding: "clamp(28px,5vw,48px) clamp(20px,4vw,40px) 72px" }}>

          {/* Sample lease button - primary style */}
          <button
            onClick={loadSampleLease}
            onMouseEnter={() => setIsHoverSample(true)}
            onMouseLeave={() => setIsHoverSample(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              borderRadius: 999,
              padding: "12px 22px",
              fontFamily: "var(--app-font-sans)",
              fontWeight: 600,
              fontSize: 15,
              letterSpacing: "-0.01em",
              textDecoration: "none",
              background: isHoverSample ? "#3D5F50" : "#5A8B7A",
              color: "#FBF8F1",
              border: "2.5px solid #171717",
              boxShadow: isHoverSample ? "2px 2px 0 0 #171717" : "4px 4px 0 0 #171717",
              transform: isHoverSample ? "translate(2px, 2px)" : "translate(0, 0)",
              transition: "background 0.2s, transform 0.12s ease, box-shadow 0.12s ease",
              minHeight: 48,
              cursor: "pointer",
              marginBottom: 28,
            }}
          >
            {lang === "es" ? "Prueba el contrato de muestra de California →" : "Try the sample California lease →"}
          </button>

          {error && (
            <div role="alert" aria-live="assertive" style={{ backgroundColor: "rgba(122,44,61,0.05)", border: "2.5px solid #7A2C3D", borderRadius: 16, padding: "20px 24px", marginBottom: 24, boxShadow: "4px 4px 0 0 #7A2C3D" }}>
              <h2 style={{ fontFamily: "var(--app-font-serif)", fontStyle: "italic", fontSize: 18, color: "#7A2C3D", marginBottom: 10, fontWeight: 500 }}>{lang === "es" ? "Algo salió mal." : "Something went wrong."}</h2>
              <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 15, color: "var(--color-ink-muted)", marginBottom: 20, lineHeight: 1.6 }}>{lang === "es" ? "Nuestro motor de análisis tuvo un problema. Intenta una vez más - generalmente funciona la segunda vez." : "Our analysis engine had a hiccup. Try once more - usually it works second time."}</p>
              <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "var(--color-ink)", lineHeight: 1.55, marginBottom: 12 }}>{error}</p>
              <button onClick={() => setError(null)} style={{ fontFamily: "var(--app-font-sans)", fontSize: 12, fontWeight: 600, color: "#7A2C3D", background: "transparent", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>{lang === "es" ? "Descartar" : "Dismiss"}</button>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* 01 Upload */}
            <div style={{ borderRadius: 20, padding: "clamp(22px,3vw,32px)", border: "2.5px solid #171717", backgroundColor: "var(--color-bone)", boxShadow: "6px 6px 0 0 #171717" }}>
              <StepBadge n="01" label={STEP_LABELS[0]} />
              <h2 style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(20px,3vw,28px)", letterSpacing: "-0.025em", color: "var(--color-ink)", marginBottom: 6 }}>{lang === "es" ? "Sube tu contrato." : "Drop your lease."}</h2>
              <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "var(--color-ink-muted)", marginBottom: 20 }}>{lang === "es" ? "Solo PDF · máx 25 MB · nunca se guarda en nuestros servidores." : "PDF only · up to 25 MB · never stored on our servers."}</p>
              <div
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                onClick={!form.file ? () => fileInputRef.current?.click() : undefined}
                role={!form.file ? "button" : undefined}
                aria-label={!form.file ? "Upload lease PDF - click or drag and drop" : undefined}
                tabIndex={!form.file ? 0 : undefined}
                onKeyDown={!form.file ? (e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); } : undefined}
                style={{
                  border: form.file ? "2.5px solid var(--color-ink-blue)" : dragActive ? "2.5px solid #5A8B7A" : "2.5px dashed rgba(23,23,23,0.18)",
                  borderRadius: 14,
                  padding: form.file ? 18 : "clamp(40px,6vw,60px) 24px",
                  cursor: form.file ? "default" : "pointer",
                  display: "flex",
                  flexDirection: form.file ? "row" : "column",
                  alignItems: "center",
                  justifyContent: form.file ? "space-between" : "center",
                  transition: "border 0.15s ease, background-color 0.15s ease",
                  backgroundColor: dragActive ? "rgba(90,139,122,0.06)" : form.file ? "rgba(30,58,95,0.04)" : "transparent",
                  boxShadow: form.file ? "4px 4px 0 0 var(--color-ink-blue)" : "none",
                }}
              >
                <input ref={fileInputRef} id="lease-upload" type="file" accept=".pdf,application/pdf" onChange={handleFileChange} style={{ display: "none" }} aria-label="Upload lease PDF" aria-describedby="file-upload-desc" />
                {!form.file ? (
                  <>
                    <svg viewBox="0 0 48 52" width="48" height="52" aria-hidden="true" style={{ marginBottom: 16, opacity: 0.8 }}>
                      <rect x="4" y="4" width="28" height="44" rx="3" fill="var(--color-bone)" stroke="#1E3A5F" strokeWidth="2.5"/>
                      <path d="M26 4 L26 16 L32 16" fill="none" stroke="#1E3A5F" strokeWidth="2.5" strokeLinejoin="round"/>
                      <path d="M16 32 L24 24 L32 32" fill="none" stroke="#5A8B7A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="24" y1="24" x2="24" y2="40" stroke="#5A8B7A" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 16, fontWeight: 600, color: "var(--color-ink)", marginBottom: 6, letterSpacing: "-0.01em" }}>{lang === "es" ? "Arrastra tu PDF aquí, o haz clic para buscar." : "Drop your PDF here, or click to browse."}</div>
                    <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 12, color: "var(--color-ink-muted)" }}>PDF · {lang === "es" ? "máx 25 MB" : "max 25 MB"}</div>
                  </>
                ) : (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, border: "2.5px solid var(--color-ink-blue)", backgroundColor: "rgba(30,58,95,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                          <path d="M6 3 L14 3 L18 7 L18 21 L6 21 Z" fill="none" stroke="#1E3A5F" strokeWidth="2" strokeLinejoin="round"/>
                          <path d="M14 3 L14 7 L18 7" fill="none" stroke="#1E3A5F" strokeWidth="2" strokeLinejoin="round"/>
                          <line x1="9" y1="11" x2="15" y2="11" stroke="#171717" strokeWidth="1.5" strokeLinecap="round"/>
                          <line x1="9" y1="14" x2="15" y2="14" stroke="#171717" strokeWidth="1.5" strokeLinecap="round"/>
                          <line x1="9" y1="17" x2="13" y2="17" stroke="#171717" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div>
                        <div style={{ fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 14, color: "var(--color-ink)" }}>{form.file.name}</div>
                        <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 12, color: "var(--color-ink-muted)", marginTop: 2 }}>{formatBytes(form.file.size)}</div>
                      </div>
                    </div>
                    <button onClick={clearFile} aria-label="Remove file" style={{ background: "transparent", border: "none", cursor: "pointer", padding: 8, minHeight: 44, minWidth: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                        <path d="M6 7 L17 18" stroke="#6B6B6B" strokeWidth="2.5" strokeLinecap="round"/>
                        <path d="M18 7 L7 18" stroke="#6B6B6B" strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </>
                )}
              </div>
              {fileError && (
                <p role="alert" style={{ fontFamily: "var(--app-font-sans)", fontSize: 12, color: "var(--color-wine)", marginTop: 10, lineHeight: 1.5 }}>{fileError}</p>
              )}
            </div>

            {/* 02 State */}
            <div style={{ borderRadius: 20, padding: "clamp(22px,3vw,32px)", border: "2.5px solid #171717", backgroundColor: "var(--color-bone)", boxShadow: "6px 6px 0 0 #1E3A5F" }}>
              <StepBadge n="02" label={STEP_LABELS[1]} />
              <label htmlFor="state-select" style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(20px,3vw,28px)", letterSpacing: "-0.025em", color: "var(--color-ink)", marginBottom: 6, display: "block" }}>{lang === "es" ? "¿Dónde está la propiedad?" : "Where's the property?"}</label>
              <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "var(--color-ink-muted)", marginBottom: 16 }}>{lang === "es" ? "Los 50 estados, Washington DC y territorios de EE. UU. - reglas reales, lenguaje claro." : "All 50 states, Washington DC, and US territories - real rules, plain English."}</p>
              <select
                id="state-select"
                value={form.state || ""}
                onChange={(e) => { const v = e.target.value || null; if (v) { try { localStorage.setItem("ctl-state", v); } catch { /* noop */ } } setForm((f) => ({ ...f, state: v })); }}
                style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "2px solid rgba(23,23,23,0.18)", backgroundColor: "var(--color-bone)", color: form.state ? "var(--color-ink)" : "var(--color-ink-muted)", fontFamily: "var(--app-font-sans)", fontSize: 15, appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B6B6B' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center", paddingRight: 44, cursor: "pointer", outline: "none", minHeight: 52 }}
              >
                <option value="">{lang === "es" ? "Elige tu estado o territorio" : "Choose your state or territory"}</option>
                <optgroup label="── States ──">
                  {["AL|Alabama","AK|Alaska","AZ|Arizona","AR|Arkansas","CA|California","CO|Colorado","CT|Connecticut","DE|Delaware","FL|Florida","GA|Georgia","HI|Hawaii","ID|Idaho","IL|Illinois","IN|Indiana","IA|Iowa","KS|Kansas","KY|Kentucky","LA|Louisiana","ME|Maine","MD|Maryland","MA|Massachusetts","MI|Michigan","MN|Minnesota","MS|Mississippi","MO|Missouri","MT|Montana","NE|Nebraska","NV|Nevada","NH|New Hampshire","NJ|New Jersey","NM|New Mexico","NY|New York","NC|North Carolina","ND|North Dakota","OH|Ohio","OK|Oklahoma","OR|Oregon","PA|Pennsylvania","RI|Rhode Island","SC|South Carolina","SD|South Dakota","TN|Tennessee","TX|Texas","UT|Utah","VT|Vermont","VA|Virginia","WA|Washington","WV|West Virginia","WI|Wisconsin","WY|Wyoming"].map(s => { const [v,l] = s.split("|"); return <option key={v} value={v}>{l}</option>; })}
                </optgroup>
                <optgroup label="── DC &amp; Territories ──">
                  {["DC|Washington DC","PR|Puerto Rico","GU|Guam","VI|US Virgin Islands","AS|American Samoa","MP|Northern Mariana Islands"].map(s => { const [v,l] = s.split("|"); return <option key={v} value={v}>{l}</option>; })}
                </optgroup>
              </select>
            </div>

            {/* ── Role Selection ── */}
            <div style={{ margin: 0 }}>
              <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
                <legend style={{ fontFamily: "var(--app-font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--color-ink-muted)", marginBottom: 14 }}>
                  {lang === "es" ? "¿Para quién es esta lectura?" : "Who is this read for?"}
                </legend>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="form-grid-2col">
                {([
                  {
                    v: "renter" as const,
                    l: lang === "es" ? "Soy Inquilino/a" : "I'm a Renter",
                    s: lang === "es" ? "Revisando un contrato que firmaré - o ya firmé." : "Reviewing a lease I'll sign - or have already signed.",
                    icon: (
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                        <rect x="6" y="16" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                        <path d="M3 18 L18 6 L33 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="14" y="22" width="8" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="18" cy="27" r="1.5" fill="currentColor"/>
                      </svg>
                    ),
                  },
                  {
                    v: "landlord" as const,
                    l: lang === "es" ? "Soy Propietario/a" : "I'm a Landlord",
                    s: lang === "es" ? "Revisando un contrato que emití o estoy emitiendo." : "Reviewing a lease I'm issuing or have issued.",
                    icon: (
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                        <rect x="4" y="12" width="28" height="20" rx="2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                        <rect x="10" y="18" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                        <rect x="21" y="18" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M4 17 L18 6 L32 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 32 L15 24 L21 24 L21 32" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                      </svg>
                    ),
                  },
                ] as const).map((opt) => {
                  const selected = form.perspective === opt.v;
                  return (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, perspective: opt.v }))}
                      aria-pressed={selected}
                      aria-describedby={`desc-${opt.v}`}
                      style={{
                        borderRadius: 20,
                        padding: "clamp(20px,3vw,28px) clamp(18px,2.5vw,26px)",
                        border: selected ? "2.5px solid var(--color-ink-blue)" : "2.5px solid rgba(23,23,23,0.15)",
                        backgroundColor: selected ? "rgba(30,58,95,0.07)" : "var(--color-bone)",
                        boxShadow: selected ? "6px 6px 0 0 var(--color-ink-blue)" : "6px 6px 0 0 rgba(23,23,23,0.07)",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 14,
                        textAlign: "left",
                        transition: "all 0.15s ease",
                        minHeight: 130,
                      }}
                    >
                      <span style={{ color: selected ? "var(--color-ink-blue)" : "rgba(23,23,23,0.32)", transition: "color 0.15s ease" }}>
                        {opt.icon}
                      </span>
                      <div>
                        <div style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(16px,2.5vw,20px)", color: selected ? "var(--color-ink-blue)" : "var(--color-ink)", letterSpacing: "-0.02em", marginBottom: 5, transition: "color 0.15s ease" }}>
                          {opt.l}
                        </div>
                        <div id={`desc-${opt.v}`} style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "var(--color-ink-muted)", lineHeight: 1.5 }}>
                          {opt.s}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              </fieldset>
            </div>

            {/* 03 Stage */}
            <fieldset style={{ borderRadius: 20, padding: "clamp(22px,3vw,32px)", border: "2.5px solid #171717", backgroundColor: "var(--color-bone)", boxShadow: "6px 6px 0 0 #C97A4A" }}>
              <StepBadge n="03" label={STEP_LABELS[2]} />
              <legend style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(20px,3vw,28px)", letterSpacing: "-0.025em", color: "var(--color-ink)", marginBottom: 20, display: "block", float: "left", width: "100%" }}>{lang === "es" ? "¿En qué etapa estás?" : "Where are you in the process?"}</legend>
              <div style={{ clear: "both", display: "flex", gap: 12, flexWrap: "wrap" }}>
                {(form.perspective === "landlord"
                ? lang === "es"
                  ? [{ v: "before", l: "Revisando un borrador", s: "Verificando antes de entregarlo al inquilino." }, { v: "already", l: "Ya emitido", s: "Revisando obligaciones que ya asumí." }]
                  : [{ v: "before", l: "Reviewing a draft", s: "Checking it before issuing to a tenant." }, { v: "already", l: "Already issued", s: "Checking obligations I've already committed to." }]
                : lang === "es"
                  ? [{ v: "before", l: "Antes de firmar", s: "Revisando antes de comprometerme." }, { v: "already", l: "Ya firmé", s: "Quiero saber qué acordé." }]
                  : [{ v: "before", l: "Before signing", s: "Reviewing before I agree to anything." }, { v: "already", l: "Already signed", s: "I want to know what I agreed to." }]
              ).map((opt) => (
                  <label key={opt.v}
                    style={{ flex: "1 1 200px", borderRadius: 16, padding: "20px 22px", border: form.stage === opt.v ? "2.5px solid var(--color-ink-blue)" : "2px solid rgba(23,23,23,0.18)", backgroundColor: form.stage === opt.v ? "rgba(30,58,95,0.06)" : "var(--color-bone)", cursor: "pointer", boxShadow: form.stage === opt.v ? "5px 5px 0 0 var(--color-ink-blue)" : "none", display: "flex", alignItems: "flex-start", gap: 14, minHeight: 44, transition: "all 0.15s ease" }}
                  >
                    <input type="radio" name="stage" value={opt.v} checked={form.stage === opt.v} onChange={() => setForm((f) => ({ ...f, stage: opt.v as "before" | "already" }))} style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
                    <div style={{ width: 22, height: 22, borderRadius: "50%", border: form.stage === opt.v ? "2px solid var(--color-ink-blue)" : "2px solid rgba(23,23,23,0.25)", backgroundColor: form.stage === opt.v ? "var(--color-ink-blue)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, transition: "all 0.15s ease" }}>
                      {form.stage === opt.v && (
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      )}
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 15, color: "var(--color-ink)", marginBottom: 5 }}>{opt.l}</div>
                      <div style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "var(--color-ink-muted)", lineHeight: 1.5 }}>{opt.s}</div>
                    </div>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* 04 Optional Context */}
            <fieldset style={{ borderRadius: 20, padding: "clamp(22px,3vw,32px)", border: "2.5px solid #171717", backgroundColor: "var(--color-bone)", boxShadow: "6px 6px 0 0 #7A2C3D" }}>
              <StepBadge n="04" label={STEP_LABELS[3]} />
              <legend style={{ fontFamily: "var(--app-font-serif)", fontWeight: 500, fontSize: "clamp(20px,3vw,28px)", letterSpacing: "-0.025em", color: "var(--color-ink)", marginBottom: 6, display: "block", float: "left", width: "100%" }}>{lang === "es" ? "¿Algo más que debamos saber?" : "Anything we should know?"}</legend>
              <p style={{ clear: "both", fontFamily: "var(--app-font-sans)", fontSize: 13, color: "var(--color-ink-muted)", marginBottom: 20 }}>{lang === "es" ? "Esto nos ayuda a personalizar el análisis. Puedes omitirlo." : "These help us tailor what we surface. Skip if you'd rather not say."}</p>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  { key: "isParent", label: lang === "es" ? "Soy padre/madre o tutor/a" : "I'm a parent or guardian", hint: lang === "es" ? "Nos ayuda a destacar protecciones especiales para familias" : "Helps us highlight family-specific protections" },
                  { key: "receivesHousingAid", label: lang === "es" ? "Recibo asistencia o beneficios de vivienda" : "I receive housing assistance or benefits", hint: lang === "es" ? "Nos ayuda a conectarte con programas de apoyo local" : "Helps us connect you to local support programs" },
                  { key: "isStudent", label: lang === "es" ? "Soy estudiante o inquilino/a joven" : "I'm a student or young renter", hint: lang === "es" ? "Nos ayuda a resaltar cláusulas comunes en vivienda de estudiantes" : "Helps us highlight common student housing clauses" },
                  { key: "reviewingForSomeoneElse", label: lang === "es" ? "Estoy revisando esto para otra persona" : "I'm reviewing this for someone else", hint: lang === "es" ? "Nos ayuda a personalizar el análisis para su situación" : "Helps us tailor the analysis to their situation" },
                ].map((opt) => (
                  <label key={opt.key} style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer", minHeight: 52, padding: "10px 0", borderBottom: "1px solid rgba(23,23,23,0.06)" }}>
                    <input
                      type="checkbox"
                      checked={!!(form as Record<string, unknown>)[opt.key]}
                      onChange={() => setForm((f) => ({ ...f, [opt.key]: !(f as Record<string, unknown>)[opt.key] }))}
                      style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                    />
                    <div
                      aria-hidden="true"
                      style={{ width: 22, height: 22, borderRadius: 6, border: (form as Record<string, unknown>)[opt.key] ? "2px solid var(--color-ink-blue)" : "2px solid rgba(23,23,23,0.2)", backgroundColor: (form as Record<string, unknown>)[opt.key] ? "var(--color-ink-blue)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s ease", flexShrink: 0 }}
                    >
                      {!!(form as Record<string, unknown>)[opt.key] && (
                        <svg width="11" height="8" viewBox="0 0 11 8" fill="none"><path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 14, color: "var(--color-ink)", lineHeight: 1.4, display: "block" }}>{opt.label}</span>
                      {opt.hint && <span style={{ fontFamily: "var(--app-font-sans)", fontSize: 12, color: "var(--color-ink-muted)", lineHeight: 1.3, display: "block", marginTop: 2 }}>{opt.hint}</span>}
                    </div>
                  </label>
                ))}
              </div>
            </fieldset>

          </div>

          {/* Submit */}
          <div style={{ paddingTop: 48, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              aria-disabled={!isFormValid}
              onMouseEnter={() => setIsHoverSubmit(true)}
              onMouseLeave={() => setIsHoverSubmit(false)}
              style={{
                borderRadius: 999,
                padding: "18px 56px",
                fontFamily: "var(--app-font-sans)",
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: "-0.01em",
                backgroundColor: !isFormValid ? "rgba(107,107,107,0.14)" : "var(--color-ink-blue)",
                color: !isFormValid ? "var(--color-ink-muted)" : "var(--color-bone)",
                border: !isFormValid ? "2.5px solid rgba(23,23,23,0.12)" : "2.5px solid #171717",
                boxShadow: !isFormValid ? "none" : isHoverSubmit ? "3px 3px 0 0 #171717" : "6px 6px 0 0 #171717",
                opacity: !isFormValid ? 0.5 : 1,
                cursor: !isFormValid ? "not-allowed" : "pointer",
                minHeight: 60,
                transition: "box-shadow 0.1s ease, transform 0.1s ease",
                transform: isFormValid && isHoverSubmit ? "translate(3px, 3px)" : "none",
              }}
            >
              {lang === "es"
                ? (form.perspective === "landlord" ? "Leer este contrato →" : "Leer mi contrato →")
                : (form.perspective === "landlord" ? "Read this lease →" : "Read my lease →")}
            </button>
            {!isFormValid && (
              <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 13, color: "var(--color-ink-muted)", marginTop: 14 }}>
                {lang === "es"
                ? (!form.file && !form.state ? "Sube un PDF y elige tu estado para continuar." : !form.file ? "Sube un PDF para continuar." : "Elige tu estado para continuar.")
                : (!form.file && !form.state ? "Upload a PDF and choose your state to continue." : !form.file ? "Upload a PDF to continue." : "Choose your state to continue.")}
              </p>
            )}
            <p style={{ fontFamily: "var(--app-font-sans)", fontSize: 11, color: "var(--color-ink-muted)", maxWidth: 420, lineHeight: 1.65, marginTop: 18, textAlign: "center" }}>
              {lang === "es" ? "Al continuar, aceptas que esto es solo para fines informativos. Check the Lease proporciona información legal, no asesoramiento legal." : "By continuing you agree this is for informational purposes only. Check the Lease provides legal information, not legal advice."}
            </p>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
