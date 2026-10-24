import { Link } from "react-router-dom";
import { HiShieldCheck } from "react-icons/hi";
import { useLang } from "../context/LanguageContext";
import LangToggle from "./LangToggle";
import "./SafetyBar.css";

/** The one message every visitor should leave with, on every page. */
function SafetyBar() {
  const { t } = useLang();
  return (
    <div className="safetyBar" role="note">
      <HiShieldCheck aria-hidden="true" />
      <p>
        <strong>{t("safety.main")}</strong> <span className="safetyMore">{t("safety.more")}</span>
      </p>
      <div className="safetyLinks">
        <Link to="/verify#check">{t("safety.check")}</Link>
        <Link to="/help-now" className="safetyHelp">{t("safety.help")}</Link>
        <LangToggle />
      </div>
    </div>
  );
}
export default SafetyBar;
