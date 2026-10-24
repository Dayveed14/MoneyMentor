import { useLang } from "../context/LanguageContext";

/** Switches the safety content between English and Pidgin. */
function LangToggle({ className = "" }) {
  const { lang, setLang, t } = useLang();
  return (
    <button
      type="button"
      className={`langToggle ${className}`}
      onClick={() => setLang(lang === "pcm" ? "en" : "pcm")}
      aria-label={t("lang.label")}
      aria-pressed={lang === "pcm"}>
      {t("lang.toggle")}
    </button>
  );
}
export default LangToggle;
