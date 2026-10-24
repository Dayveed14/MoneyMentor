import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiChevronDown } from "react-icons/hi";
import { apiFetch } from "../config/api";
import { useLang } from "../context/LanguageContext";
import ShareButtons from "./ShareButtons";
import "./ScamAlerts.css";

function AlertCard({ alert, open, onToggle }) {
  const { lang, t } = useLang();
  // Pidgin summary when the admin wrote one; everything else stays as written
  const summary = lang === "pcm" && alert.summary_pcm ? alert.summary_pcm : alert.summary;
  return (
    <li className={`alertCard sev-${alert.severity} ${open ? "open" : ""}`} id={`alert-${alert.id}`}>
      <button type="button" className="alertTop" aria-expanded={open} onClick={onToggle}>
        <span className={`alertSev s-${alert.severity}`}>{t(`sev.${alert.severity}`)}</span>
        <h3>{alert.title}</h3>
        <p>{summary}</p>
        <span className="alertMore">
          {open ? t("alerts.less") : t("alerts.more")} <HiChevronDown aria-hidden="true" />
        </span>
      </button>
      {open && (
        <div className="alertBody">
          <div>
            <h4>{t("alerts.flags")}</h4>
            <ul>{alert.red_flags.map((f) => <li key={f}>{f}</li>)}</ul>
          </div>
          <div>
            <h4>{t("alerts.todo")}</h4>
            <ol>{alert.what_to_do.map((s) => <li key={s}>{s}</li>)}</ol>
          </div>
          <div className="alertShare">
            <ShareButtons
              compact
              share={`alert=${alert.id}`}
              label={t("alerts.share")}
              text={`⚠️ Scam alert: ${alert.title}\n${summary}`}
            />
          </div>
        </div>
      )}
    </li>
  );
}

/** Scam alerts published by admins. `limit` for the home page, all on /alerts. */
function ScamAlerts({ limit = 20, showHeader = true }) {
  const [alerts, setAlerts] = useState(null);
  const [error, setError] = useState(false);
  const { hash } = useLocation();
  const { t } = useLang();
  // A shared link like /alerts#alert-3 opens that alert
  const linked = Number((hash.match(/^#alert-(\d+)$/) || [])[1]) || null;
  const [open, setOpen] = useState(linked);

  useEffect(() => {
    apiFetch(`api/get_scam_alerts.php?limit=${limit}`)
      .then((r) => (r.success ? setAlerts(r.data) : setError(true)))
      .catch(() => setError(true));
  }, [limit]);

  useEffect(() => {
    if (!alerts || !linked) return;
    setOpen(linked);
    requestAnimationFrame(() => document.getElementById(`alert-${linked}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, [alerts, linked]);

  if (error || (alerts && alerts.length === 0)) return null; // the rest of the page still helps

  return (
    <section className="alertsSection" id="alerts">
      <div className="wrap">
        {showHeader && (
          <div className="alertsHead">
            <div>
              <h2>{t("alerts.title")}</h2>
              <p>{t("alerts.lead")}</p>
            </div>
            <Link to="/alerts" className="btn btn-ghost">{t("alerts.all")}</Link>
          </div>
        )}
        {!alerts ? (
          <div className="alertsGrid" aria-busy="true">
            {Array.from({ length: Math.min(limit, 3) }).map((_, i) => <div key={i} className="alertSkeleton" />)}
          </div>
        ) : (
          <ul className="alertsGrid">
            {alerts.map((a) => (
              <AlertCard key={a.id} alert={a} open={open === a.id} onToggle={() => setOpen(open === a.id ? null : a.id)} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
export default ScamAlerts;
