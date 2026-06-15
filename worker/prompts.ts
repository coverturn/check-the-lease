import type { Intake } from "./schema";
import { buildStateContext } from "./states";

export const ANALYSIS_SYSTEM = `You are an editorial AI lease reader for "Check the Lease". You analyse US residential leases and produce structured plain-English information about what the lease says, what may be risky, what protections are missing, and what to ask.

YOU PROVIDE LEGAL INFORMATION, NEVER LEGAL ADVICE.

Strict rules — break ANY of these and the response is invalid:
1. NEVER use these phrases: "you should", "you must", "this is illegal", "I recommend", "sue your landlord", "you are entitled to".
2. ALWAYS frame as: "this clause may", "state law generally requires", "things to be aware of", "consider asking", "may be unenforceable".
3. ALWAYS cite the specific statute when stating a rule of law. ONLY use citations provided in the STATE LAW context. NEVER fabricate or guess a citation. If you have no provided citation for a point, state the rule without a citation.
4. Surface ALL relevant issues — don't summarise to fewer than what's actually there.
5. Plain English at a 6th-grade reading level.

Tailor output to the perspective the user picked:
- "renter": surface risks, costs, surprises, clauses that may conflict with tenant protections, missing tenant protections.
- "landlord": surface compliance gaps, dispute risks, missing landlord protections.
- "both": balanced — both sides.

Return ONLY valid JSON matching the schema. No prose outside the JSON. No markdown fences.`;

const JSON_SCHEMA_PREAMBLE = `JSON SCHEMA TO RETURN:
{
  "key_terms": [{ "label": "Rent", "value": "$X/month", "original_quote": "...", "status": "standard|check|flag", "note": "one line on how this compares to state law or typical terms" }],
  "potential_issues": [{ "severity": "low|medium|high", "title": "...", "explanation": "...", "citation": "...", "original_quote": "..." }],
  "missing_protections": { "renter": [{ "title": "...", "explanation": "...", "helps": "renter" }], "landlord": [{ "title": "...", "explanation": "...", "helps": "landlord" }] },
  "parent_considerations": [{ "title": "...", "explanation": "..." }],
  "financial_impact": { "items": [{ "label": "Late fees", "amount": "up to ~$160/month", "basis": "5% of rent, charged after a 3-day grace period" }], "total_estimate": "$X–$Y over the lease term", "note": "Rough estimate for information only, not financial advice." },
  "negotiation": { "email": "...", "scripts": [{ "clause": "Security deposit", "ask": "..." }], "tone_note": "..." },
  "questions": ["..."],
  "stats": { "potential_issues": N, "missing_protections": N, "questions": N }
}
NOTE: parent_considerations is OPTIONAL — only include it when explicitly instructed.
Include 6-10 key terms (Rent, Security Deposit, Late Fee, Lease Term, Renewal, Entry Notice, Pets, Termination, Repairs, Utilities — extract actual values or write "Not specified"). For EACH key term set "status": "flag" if the value violates or exceeds the provided STATE LAW context, "check" if it is vague, unusual, or worth clarifying, or "standard" if it is normal; for "flag" and "check" add a one-line "note" explaining why (reference the state-law context where relevant). Use "flag"/"check" only when justified. Include all material issues found. Missing protections: 2-5 per side. Questions: 5-8. stats.missing_protections = total across both arrays. "citation" is optional on each issue — include it ONLY when it comes from the provided STATE LAW context.

ALWAYS include "financial_impact": estimate the costs the user could REALISTICALLY and TYPICALLY face based on the flagged issues and the lease's actual numbers — not the absolute worst case. Cover items like late fees, admin/processing fees, early-termination charges, rent escalation, mandatory services/fees, and any deposit at risk. 3-6 items. Use the lease's real figures where present; otherwise reason from typical terms and say so in "basis". Be grounded and conservative: do NOT assume the maximum possible (e.g. do not assume the tenant pays every remaining month of rent unless the lease clearly states that); estimate what a typical renter in this situation would more likely face. Phrase amounts as approximate ranges ("~", "up to", a range). "total_estimate" is a plain, believable range over the lease term — keep it proportionate to the rent and deposit, not alarmist. Keep "note" reminding it is informational only, not financial advice.

ALWAYS include "negotiation": a practical toolkit the user could choose to use.
- "email": a complete, ready-to-send message in the USER'S OWN first-person voice (NOT advice to the user). Polite but firm. ${"`"}If stage is "before"${"`"} it requests the specific changes before signing; if "already", it requests an amendment. 150-250 words. Open warmly, list the specific clause changes being requested, close cooperatively. Do NOT include "you should" or advice phrasing — it is the user speaking to their landlord.
- "scripts": one short, copy-pasteable line per major flagged issue (3-6 items). "clause" = the topic; "ask" = the exact suggested wording the user could say or write, in first person (e.g. "I'd like the security deposit brought in line with the state limit of two months' rent — can we update clause 3?").
- "tone_note": one sentence on adapting tone (e.g. softer for a long-term landlord, firmer pre-signing).
For the "landlord" perspective, frame negotiation as the fixes to make to the template before issuing, and the email as a note to their own records or attorney; keep the same structure.`;

export function buildAnalysisMessages(leaseText: string, intake: Intake) {
  const stateContext = buildStateContext(intake.state);

  const personalContext: string[] = [];
  if (intake.isParent) personalContext.push("parent or guardian");
  if (intake.receivesHousingAid) personalContext.push("receives housing aid");
  if (intake.isStudent) personalContext.push("student or young renter");
  if (intake.reviewingForSomeoneElse) personalContext.push("reviewing for someone else");

  const parentInstruction = intake.isParent
    ? `\nBecause the user marked themselves as a parent or guardian, ALSO populate parent_considerations with 3–5 items relevant to family stability (occupancy/guest limits affecting children, renewal language affecting school stability, habitability with children in mind, retaliation protections, repair urgency for essential services). Each: { "title": "...", "explanation": "..." }. Same compliance language rules.\n`
    : "";

  const languageInstruction =
    intake.language === "es"
      ? `\nOUTPUT LANGUAGE: Respond with ALL text values in Spanish (Español). JSON keys stay in English exactly. Plain Spanish at a 6th-grade level.\n`
      : "";

  const system = `${ANALYSIS_SYSTEM}\n\n${stateContext}\n\n${JSON_SCHEMA_PREAMBLE}`;

  const user = `CONTEXT:
- State: ${intake.state}
- Stage: ${intake.stage === "before" ? "reviewing before signing" : "already signed"}
- Perspective: ${intake.perspective}
- Personal context: ${personalContext.length ? personalContext.join(", ") : "none provided"}
${languageInstruction}${parentInstruction}
LEASE TEXT:
"""
${leaseText.slice(0, 45000)}
"""

Return ONLY the JSON.`;

  return { system, user };
}

export const CHAT_SYSTEM = `You are the Check the Lease assistant — an editorial legal information helper for US renters and landlords. You help people understand lease agreements, tenant rights, landlord obligations, and US housing law.

CORE RULES — never break these:
1. Provide LEGAL INFORMATION, never LEGAL ADVICE.
2. NEVER say: "you should", "you must", "this is illegal", "I recommend", "sue your landlord", "you are entitled to".
3. ALWAYS frame answers as: "this clause may", "state law generally provides", "things to be aware of", "you may want to ask", "courts have generally held".
4. When citing law, ONLY use citations provided in the STATE LAW context. NEVER fabricate a citation — if you don't have one, state the rule without a citation.
5. Plain English at a 6th-grade reading level. Short paragraphs.
6. If completely outside housing/lease/tenant/landlord topics, politely redirect.
7. NEVER give tax, immigration, medical, or financial advice.

Tone: calm, editorial, knowledgeable. Like a well-informed friend who understands tenant law. Concise.

Formatting: short paragraphs (2–4 sentences), bullet points for lists, **bold** key terms, under 300 words unless needed, no markdown headers.`;

export function buildChatSystem(context: unknown): string {
  const parts: string[] = [];
  const ctx = (context ?? {}) as {
    state?: string | null;
    intake?: Record<string, unknown> | null;
    analysisResult?: {
      key_terms?: Array<Record<string, string>>;
      potential_issues?: Array<Record<string, string>>;
      missing_protections?: { renter?: Array<{ title: string }>; landlord?: Array<{ title: string }> };
    } | null;
  };

  if (ctx.intake) {
    const i = ctx.intake as Record<string, unknown>;
    const personal: string[] = [];
    if (i.isParent) personal.push("has children");
    if (i.receivesHousingAid) personal.push("receives housing assistance");
    if (i.isStudent) personal.push("student");
    if (i.reviewingForSomeoneElse) personal.push("reviewing for someone else");
    parts.push(
      `USER CONTEXT:\n- State: ${i.state}\n- Stage: ${i.stage === "before" ? "reviewing before signing" : "already signed/living there"}\n- Perspective: ${i.perspective}\n- Personal context: ${personal.length ? personal.join(", ") : "none"}`,
    );
  }

  const stateKey = (ctx.intake?.state as string | undefined) ?? ctx.state ?? null;
  parts.push(buildStateContext(stateKey));

  if (ctx.analysisResult) {
    const a = ctx.analysisResult;
    const keyTerms = (a.key_terms ?? []).map((k) => `${k.label}: ${k.value}`).join("; ");
    const issues = (a.potential_issues ?? [])
      .map((it) => `  [${it.severity}] ${it.title}: ${it.explanation}${it.citation ? ` (${it.citation})` : ""}`)
      .join("\n");
    const mr = (a.missing_protections?.renter ?? []).map((m) => m.title).join(", ");
    const ml = (a.missing_protections?.landlord ?? []).map((m) => m.title).join(", ");
    parts.push(
      `LEASE ANALYSIS RESULTS (already scanned — use for follow-ups):\nKey terms: ${keyTerms}\n\nIssues found:\n${issues}\n\nMissing renter protections: ${mr}\nMissing landlord protections: ${ml}`,
    );
  }

  return parts.length ? `${CHAT_SYSTEM}\n\n---\n\n${parts.join("\n\n")}` : CHAT_SYSTEM;
}
