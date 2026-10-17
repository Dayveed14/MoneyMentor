import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiChevronDown } from "react-icons/hi";
import { apiFetch } from "../config/api";
import "./ScamAlerts.css";

const SEVERITY = { high: "Act now", medium: "Be careful", low: "Good to know" };

function AlertCard({ alert, open, onToggle }) {
  return (
    <li className={`alertCard sev-${alert.severity} ${open ? "open" : ""}`}>
      <button type="button" className="alertTop" aria-expanded={open} onClick={onToggle}>
        <span className={`alertSev s-${alert.severity}`}>{SEVERITY[alert.severity]}</span>
        <h3>{alert.title}</h3>
        <p>{alert.summary}</p>
        <span className="alertMore">
          {open ? "Hide details" : "How to spot it"} <HiChevronDown aria-hidden="true" />
        </span>
      </button>
      {open && (
        <div className="alertBody">
          <div>
            <h4>Red flags</h4>
            <ul>{alert.red_flags.map((f) => <li key={f}>{f}</li>)}</ul>
          </div>
          <div>
            <h4>What to do</h4>
            <ol>{alert.what_to_do.map((s) => <li key={s}>{s}</li>)}</ol>
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
  const [open, setOpen] = useState(null);

  useEffect(() => {
    apiFetch(`api/get_scam_alerts.php?limit=${limit}`)
      .then((r) => (r.success ? setAlerts(r.data) : setError(true)))
      .catch(() => setError(true));
  }, [limit]);

  if (error || (alerts && alerts.length === 0)) return null; // the rest of the page still helps

  return (
    <section className="alertsSection" id="alerts">
      <div className="wrap">
        {showHeader && (
          <div className="alertsHead">
            <div>
              <h2>Scams going around right now</h2>
              <p>Updated by the MoneyMentor team. Tap an alert to learn the signs.</p>
            </div>
            <Link to="/alerts" className="btn btn-ghost">See all alerts</Link>
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
