import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { STRINGS } from "../lib/i18n";

/*
 * English / Nigerian Pidgin switch for the safety content (safety bar, golden
 * rules, message checker, alerts and the "Got scammed?" page). Remembered per browser.
 */
const LanguageContext = createContext({ lang: "en", setLang: () => {}, t: (k) => k });
const KEY = "mm-lang";

function initial() {
  try {
    return localStorage.getItem(KEY) === "pcm" ? "pcm" : "en";
  } catch {
    return "en";
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(initial);

  const setLang = useCallback((l) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* private mode: just don't remember */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "pcm" ? "pcm" : "en";
  }, [lang]);

  // t("key") → string in the current language (falls back to English)
  const t = useCallback((key) => STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key, [lang]);

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLang = () => useContext(LanguageContext);
