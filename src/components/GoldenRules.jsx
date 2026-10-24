import { HiKey, HiPhone, HiLink, HiClock, HiCash, HiUserGroup } from "react-icons/hi";
import { useLang } from "../context/LanguageContext";
import ShareButtons from "./ShareButtons";
import "./GoldenRules.css";

const ICONS = [HiKey, HiPhone, HiLink, HiClock, HiCash, HiUserGroup];

function GoldenRules() {
  const { t } = useLang();
  const rules = t("rules");
  const shareText = `${t("rules.title")}:\n${rules.map(([title], i) => `${i + 1}. ${title}`).join("\n")}`;

  return (
    <section className="rules" id="safety">
      <div className="wrap">
        <div className="rulesHead">
          <h2>{t("rules.title")}</h2>
          <p>{t("rules.lead")}</p>
        </div>
        <ul className="rulesGrid">
          {rules.map(([title, text], i) => {
            const Icon = ICONS[i];
            return (
              <li key={i}>
                <span className="ruleIcon"><Icon aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            );
          })}
        </ul>
        <div className="rulesShare">
          <ShareButtons share="page=alerts" text={shareText} label={t("rules.share")} />
        </div>
      </div>
    </section>
  );
}
export default GoldenRules;
