import type { Lang } from "@/contexts/LanguageContext";

const T = {
  /* ── Nav ── */
  nav_renters:        { en: "For renters",       es: "Para inquilinos" },
  nav_landlords:      { en: "For landlords",     es: "Para propietarios" },
  nav_how_it_works:   { en: "How it works",      es: "Cómo funciona" },
  nav_cta:            { en: "Read my lease →",   es: "Leer mi contrato →" },
  nav_analyse_another:{ en: "Read another lease →", es: "Leer otro contrato →" },
  nav_about:          { en: "About",             es: "Acerca de" },
  nav_privacy:        { en: "Privacy",           es: "Privacidad" },
  nav_terms:          { en: "Terms",             es: "Términos" },

  /* ── Upload - step labels ── */
  upload_step1:       { en: "Upload",   es: "Subir" },
  upload_step2:       { en: "State",    es: "Estado" },
  upload_step3:       { en: "Stage",    es: "Etapa" },
  upload_step4:       { en: "Optional", es: "Opcional" },

  /* ── Upload - loading messages ── */
  loading_1:          { en: "Reading your lease.",       es: "Leyendo tu contrato." },
  loading_2:          { en: "Checking state law.",       es: "Verificando la ley estatal." },
  loading_3:          { en: "Finding what matters.",     es: "Encontrando lo que importa." },
  loading_4:          { en: "Almost there.",             es: "Casi listo." },

  /* ── Upload - section headers ── */
  upload_heading:     { en: "Your lease,\nin plain English.", es: "Tu contrato,\nen español claro." },
  upload_sub:         { en: "Upload your PDF. We'll read it, flag the issues, and cite the law. All in plain English.", es: "Sube tu PDF. Lo leeremos, señalaremos los problemas y citaremos la ley. Todo en español claro." },
  upload_step1_title: { en: "Upload your lease",     es: "Sube tu contrato" },
  upload_step1_body:  { en: "Drop in your lease PDF. We never store the file.", es: "Arrastra tu contrato en PDF. Nunca guardamos el archivo." },
  upload_step2_title: { en: "Pick your state",       es: "Elige tu estado" },
  upload_step2_body:  { en: "Laws vary. We check yours.", es: "Las leyes varían. Revisamos las tuyas." },
  upload_step3_title: { en: "Before or after signing?", es: "¿Antes o después de firmar?" },
  upload_step4_title: { en: "A few more details",    es: "Algunos detalles más" },
  upload_cta:         { en: "Analyse my lease →",    es: "Analizar mi contrato →" },
  upload_sample:      { en: "Try a sample lease →",  es: "Ver contrato de muestra →" },
  upload_sample_note: { en: "California sample, pre-signing, renter perspective.", es: "Muestra de California, antes de firmar, perspectiva de inquilino." },
  upload_drop_active: { en: "Drop it here",          es: "Suéltalo aquí" },
  upload_drop_idle:   { en: "Drop your lease PDF here, or",  es: "Arrastra tu contrato PDF aquí, o" },
  upload_browse:      { en: "browse",                es: "selecciona" },
  upload_requirements:{ en: "PDF only · max 25 MB", es: "Solo PDF · máximo 25 MB" },
  upload_selected:    { en: "Selected:",             es: "Seleccionado:" },
  upload_remove:      { en: "Remove",                es: "Quitar" },
  upload_state_label: { en: "Which state is the property in?", es: "¿En qué estado está la propiedad?" },
  upload_state_placeholder: { en: "- Select state -", es: "- Selecciona estado -" },
  upload_stage_before:{ en: "Reviewing before signing", es: "Revisando antes de firmar" },
  upload_stage_already:{ en: "Already signed",       es: "Ya firmé" },
  upload_persp_renter:{ en: "I'm a renter",          es: "Soy inquilino/a" },
  upload_persp_landlord:{ en: "I'm a landlord",      es: "Soy propietario/a" },
  upload_persp_both:  { en: "Both sides",            es: "Ambos lados" },
  upload_opt_parent:  { en: "I'm a parent or guardian", es: "Soy padre o tutor/a" },
  upload_opt_housing_aid: { en: "I receive housing aid or vouchers", es: "Recibo ayuda de vivienda o vales" },
  upload_opt_student: { en: "I'm a student or young renter", es: "Soy estudiante o inquilino/a joven" },
  upload_opt_someone_else: { en: "Reviewing for someone else", es: "Revisando para alguien más" },
  upload_error_pdf:   { en: "This file doesn't look like a PDF. Please upload a .pdf file.", es: "Este archivo no parece ser un PDF. Por favor sube un archivo .pdf." },
  upload_error_size:  { en: "This file is over the 25 MB limit. Try compressing the PDF first.", es: "Este archivo supera el límite de 25 MB. Intenta comprimir el PDF primero." },
  upload_loading_sub: { en: "law check · about 5–15 seconds", es: "verificación legal · unos 5–15 segundos" },

  /* ── Results - header ── */
  results_pre_label:  { en: "pre-signing review",   es: "revisión antes de firmar" },
  results_post_label: { en: "post-signing read",    es: "lectura post-firma" },
  results_renter_label:{ en: "renter",              es: "inquilino/a" },
  results_landlord_label:{ en: "landlord",          es: "propietario/a" },
  results_both_label: { en: "renter & landlord",    es: "inquilino/a y propietario/a" },

  results_verdict_bad:  { en: "Heads up.",              es: "¡Atención." },
  results_verdict_mid:  { en: "A few things to review.", es: "Algunas cosas a revisar." },
  results_verdict_good: { en: "Looks pretty clean.",    es: "Parece bastante limpio." },
  results_verdict_badge_bad:  { en: "Red flags found",   es: "Señales de alerta" },
  results_verdict_badge_mid:  { en: "Some issues found", es: "Algunos problemas" },
  results_verdict_badge_good: { en: "Looks clean",       es: "Se ve limpio" },
  results_verdict_sub_bad:  {
    en: (n: number) => `There ${n === 1 ? "is" : "are"} ${n} serious problem${n === 1 ? "" : "s"} with this lease. Read these carefully before you sign.`,
    es: (n: number) => `Hay ${n} problema${n === 1 ? "" : "s"} grave${n === 1 ? "" : "s"} en este contrato. Léelos detenidamente antes de firmar.`,
  },
  results_verdict_sub_mid:  {
    en: () => "Nothing deal-breaking, but a few things are worth asking about before you sign.",
    es: () => "Nada que rompa el trato, pero hay cosas que vale la pena preguntar antes de firmar.",
  },
  results_verdict_sub_good: {
    en: () => "We didn't find major issues. Read the notes below just to be sure.",
    es: () => "No encontramos problemas graves. Lee las notas abajo para estar seguro/a.",
  },

  results_stat_issues:    { en: "Red flags &\nthings to check",     es: "Alertas y\ncosas a revisar" },
  results_stat_missing:   { en: "Missing\nprotections",             es: "Protecciones\nfaltantes" },
  results_stat_q_before:  { en: "Questions to\nask before signing", es: "Preguntas para\nhacer antes de firmar" },
  results_stat_q_after:   { en: "Things to\nkeep track of",        es: "Cosas que\ndebe seguir" },

  results_photo_caption:  { en: "Now you know what's in it.",       es: "Ahora sabes lo que dice." },

  results_section01_eyebrow: { en: "The Basics",           es: "Lo Básico" },
  results_section01_heading: { en: "Here's what your lease actually says.", es: "Esto es lo que dice tu contrato." },
  results_section01_sub:     { en: "The most important numbers, pulled from your lease and explained in plain English.", es: "Los números más importantes, extraídos de tu contrato y explicados en español claro." },

  results_section02_eyebrow: { en: "Potential Issues",         es: "Problemas Potenciales" },
  results_section02_heading: { en: "Clauses that need your attention.", es: "Cláusulas que necesitan tu atención." },
  results_section02_sub_before: { en: "These are the parts of your lease that may create problems. Read each one carefully.", es: "Estas son las partes de tu contrato que pueden crear problemas. Lee cada una detenidamente." },
  results_section02_sub_after:  { en: "Here's what to keep an eye on, now that you've signed.", es: "Esto es lo que debes tener en cuenta ahora que ya firmaste." },
  results_section02_empty:      { en: "No flagged issues. That's a good sign.",     es: "Sin problemas marcados. Eso es una buena señal." },

  results_sev_high_label:    { en: "RED FLAG",     es: "ALERTA ROJA" },
  results_sev_high_sub:      { en: "This needs your attention.", es: "Esto necesita tu atención." },
  results_sev_med_label:     { en: "DOUBLE-CHECK", es: "VERIFICAR" },
  results_sev_med_sub:       { en: "Worth clarifying before you sign.", es: "Vale la pena aclarar antes de firmar." },
  results_sev_low_label:     { en: "MINOR NOTE",   es: "NOTA MENOR" },
  results_sev_low_sub:       { en: "Low priority, but worth knowing.", es: "Baja prioridad, pero vale saberlo." },

  results_quote_label:       { en: "From your lease",  es: "De tu contrato" },
  results_citation_show:     { en: "View legal citation", es: "Ver cita legal" },
  results_citation_hide:     { en: "Hide citation",      es: "Ocultar cita" },

  results_section03_eyebrow: { en: "Missing Protections",       es: "Protecciones Faltantes" },
  results_section03_heading: { en: "What your lease doesn't say.", es: "Lo que tu contrato no dice." },
  results_section03_sub:     { en: "Standard protections that are absent from this lease. Things worth asking about or adding.", es: "Protecciones estándar que faltan en este contrato. Cosas que vale la pena preguntar o agregar." },
  results_section03_empty:   { en: "No missing protections flagged.", es: "Sin protecciones faltantes marcadas." },

  results_section04_eyebrow_before: { en: "Questions to Ask",       es: "Preguntas Para Hacer" },
  results_section04_eyebrow_after:  { en: "Things to Track",        es: "Cosas a Seguir" },
  results_section04_heading_before: { en: "Before you sign, ask these.", es: "Antes de firmar, pregunta esto." },
  results_section04_heading_after:  { en: "Since you've already signed.", es: "Dado que ya firmaste." },
  results_section04_sub_before:     { en: "Use these questions to negotiate, clarify, or protect yourself.", es: "Usa estas preguntas para negociar, aclarar o protegerte." },
  results_section04_sub_after:      { en: "Things to document and keep track of throughout your tenancy.", es: "Cosas para documentar y seguir durante tu arrendamiento." },
  results_section04_checked:        { en: (n: number, total: number) => `${n} of ${total} done`, es: (n: number, total: number) => `${n} de ${total} hecho${n === 1 ? "" : "s"}` },

  results_parent_eyebrow: { en: "For Parents & Guardians", es: "Para Padres y Tutores" },
  results_parent_heading: { en: "Family considerations.", es: "Consideraciones familiares." },
  results_parent_sub:     { en: "Clauses that may affect household stability, school continuity, and children's wellbeing.", es: "Cláusulas que pueden afectar la estabilidad del hogar, la continuidad escolar y el bienestar de los niños." },

  results_resources_heading: { en: "California Resources",    es: "Recursos de California" },
  results_resources_sub:     { en: "Free programs and legal aid available in California.", es: "Programas gratuitos y asistencia legal disponibles en California." },
  results_resources_filter_all:       { en: "Show all",   es: "Ver todos" },
  results_resources_filter_parent:    { en: "Parent",     es: "Padre/Madre" },
  results_resources_filter_income:    { en: "Low-income", es: "Bajos ingresos" },
  results_resources_filter_senior:    { en: "Senior",     es: "Senior" },
  results_resources_filter_veteran:   { en: "Veteran",    es: "Veterano/a" },
  results_resources_link:             { en: "Learn more →", es: "Más información →" },
  results_no_resources:               { en: "No programs match this filter.", es: "Ningún programa coincide con este filtro." },
  results_disclaimer:                 { en: "We're not affiliated with these organizations. Just pointing you toward people who can help.", es: "No estamos afiliados a estas organizaciones. Solo te señalamos hacia personas que pueden ayudar." },

  /* ── Generic ── */
  lang_toggle_label: { en: "Language", es: "Idioma" },
} as const;

type TranslationKey = keyof typeof T;

type TranslationValue<K extends TranslationKey> = (typeof T)[K];

export function useT(lang: Lang) {
  return function t<K extends TranslationKey>(
    key: K,
    ...args: TranslationValue<K>[typeof lang] extends ((...a: infer A) => string) ? A : []
  ): string {
    const entry = T[key];
    const val = entry[lang] as unknown;
    if (typeof val === "function") {
      return (val as (...a: unknown[]) => string)(...(args as unknown[]));
    }
    return val as string;
  };
}
