import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiPhone, HiExternalLink, HiExclamationCircle } from "react-icons/hi";
import { apiFetch } from "../config/api";
import { useLang } from "../context/LanguageContext";
import LangToggle from "../components/LangToggle";
import ShareButtons from "../components/ShareButtons";
import "./SafetyPages.css";

// "#" must be encoded for tel: links, or the phone ignores everything after it
const telHref = (code) => `tel:${code.replace(/#/g, "%23")}`;

/** What to do in the first hour after sharing a code or sending money to a scammer. */
function HelpNow() {
  const { t } = useLang();
  const [contacts, setContacts] = useState(null);

  useEffect(() => {
    apiFetch("api/get_help_contacts.php")
      .then((r) => setContacts(r.success ? r.data : []))
      .catch(() => setContacts([]));
  }, []);

  const banks = (contacts || []).filter((c) => c.kind === "bank");
  const agencies = (contacts || []).filter((c) => c.kind === "agency");

  return (
    <div className="safetyPage">
      <header className="sosHero">
        <div className="wrap">
          <div className="sosTop">
            <span className="sosBadge"><HiExclamationCircle aria-hidden="true" /> Emergency steps</span>
            <LangToggle className="onLight" />
          </div>
          <h1>{t("help.title")}</h1>
          <p>{t("help.lead")}</p>
        </div>
      </header>

      <div className="wrap safetyBody">
        <ol className="sosSteps">
          {t("help").map(([title, text], i) => (
            <li key={i}>
              <span className="sosNum">{i + 1}</span>
              <div>
                <h2>{title}</h2>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>

        <section className="helpBlock" aria-labelledby="banks-h">
          <h2 id="banks-h">{t("help.banks")}</h2>
          <p className="muted">{t("help.banksNote")}</p>
          {contacts === null ? (
            <div className="contactGrid" aria-busy="true">
              {[0, 1, 2].map((i) => <div key={i} className="contactCard skeleton" />)}
            </div>
          ) : banks.length === 0 ? (
            <p className="helpEmpty">{t("help.noBanks")}</p>
          ) : (
            <ul className="contactGrid">
              {banks.map((b) => (
                <li key={b.id} className="contactCard">
                  <strong>{b.name}</strong>
                  {b.ussd && (
                    <a className="ussd" href={telHref(b.ussd)}>
                      <span>{t("help.dial")}</span> {b.ussd}
                    </a>
                  )}
                  {b.phone && (
                    <a className="contactLine" href={`tel:${b.phone.replace(/[^\d+]/g, "")}`}>
                      <HiPhone aria-hidden="true" /> {b.phone}
                    </a>
                  )}
                  {b.note && <span className="contactNote">{b.note}</span>}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="helpBlock" aria-labelledby="agencies-h">
          <h2 id="agencies-h">{t("help.agencies")}</h2>
          <ul className="agencyList">
            {agencies.map((a) => (
              <li key={a.id}>
                <div>
                  <strong>{a.name}</strong>
                  {a.note && <p>{a.note}</p>}
                </div>
                <div className="agencyActions">
                  {a.phone && <a href={`tel:${a.phone.replace(/[^\d+]/g, "")}`} className="btn btn-ghost btn-sm"><HiPhone aria-hidden="true" /> {t("help.call")}</a>}
                  {a.url && (
                    <a href={a.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                      {t("help.visit")} <HiExternalLink aria-hidden="true" />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="helpCta">
          <div>
            <h2>Tell us what happened</h2>
            <p>Your report helps us warn other people about the same scam. You can report without an account.</p>
          </div>
          <div className="helpCtaBtns">
            <Link to="/report?lost=1" className="btn btn-solid">Report the scam</Link>
            <Link to={`/contactUs?subject=${encodeURIComponent("I think I've been scammed")}`} className="btn btn-ghost">Ask us for help</Link>
          </div>
        </section>

        <div className="helpShare">
          <p>Save this page or send it to someone who needs it:</p>
          <ShareButtons share="page=help-now" text={`${t("help.title")} ${t("help.lead")}`} />
        </div>
      </div>
    </div>
  );
}
export default HelpNow;
