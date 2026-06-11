import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Lang = "en" | "es";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const stored = localStorage.getItem("ctl-lang");
      if (stored === "es" || stored === "en") return stored;
    } catch { /* ignore */ }
    return "en";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("ctl-lang", l); } catch { /* ignore */ }
    document.documentElement.lang = l === "es" ? "es" : "en";
  };

  useEffect(() => {
    document.documentElement.lang = lang === "es" ? "es" : "en";
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
