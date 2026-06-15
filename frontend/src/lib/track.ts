// First-party, privacy-friendly funnel analytics. No cookies, no PII — just a
// per-session random id (sessionStorage) so we can see drop-off between steps.
let anon = "";
function getAnon(): string {
  if (anon) return anon;
  try {
    anon = sessionStorage.getItem("ctl-anon") || "";
    if (!anon) { anon = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem("ctl-anon", anon); }
  } catch { anon = "na"; }
  return anon;
}

export function track(name: string, meta?: Record<string, unknown>): void {
  try {
    let ref = "";
    try { ref = document.referrer ? new URL(document.referrer).host : ""; } catch { ref = ""; }
    const body = JSON.stringify({ name, anon: getAnon(), path: location.pathname, ref, meta });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/event", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/event", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
    }
  } catch { /* noop */ }
}
