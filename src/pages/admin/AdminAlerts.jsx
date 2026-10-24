import { useEffect, useState } from "react";
import { apiPost } from "../../config/api";
import { useAdmin, SectionState, shortDate, MailModeNote } from "./adminShared";
import AlertForm from "./AlertForm";

function AdminAlerts({ addTick }) {
  const { data, loading, error, reload } = useAdmin("api/admin_scam_alerts.php");
  const [editing, setEditing] = useState(null); // null | "new" | alert
  const [confirmId, setConfirmId] = useState(null);
  const [confirmEmail, setConfirmEmail] = useState(null);
  const [emailing, setEmailing] = useState(null);
  const [notice, setNotice] = useState({ ok: true, text: "" });

  useEffect(() => {
    if (addTick) setEditing("new");
  }, [addTick]);

  const remove = async (id) => {
    const res = await apiPost("api/admin_scam_alerts.php", { action: "delete", id }).catch(() => null);
    setNotice({ ok: Boolean(res?.success), text: res?.message || "" });
    setConfirmId(null);
    reload();
  };

  const email = async (id) => {
    setEmailing(id);
    setConfirmEmail(null);
    try {
      const res = await apiPost("api/admin_scam_alerts.php", { action: "email", id });
      setNotice({ ok: res.success, text: res.message });
    } catch (err) {
      setNotice({ ok: false, text: err.message });
    } finally {
      setEmailing(null);
      reload();
    }
  };

  return (
    <div className="content-section">
      <p className="dash-muted alertsIntro">
        Scam alerts appear on the home page and the Scam alerts page. Publish one whenever a new scam is doing the rounds,
        then email it to your {data?.subscribers ?? 0} subscriber{data?.subscribers === 1 ? "" : "s"}.
      </p>
      {data && <MailModeNote enabled={data.mail_enabled} />}
      {notice.text && <p className={notice.ok ? "formOk" : "formErr"} role="status">{notice.text}</p>}
      <SectionState loading={loading && !data} error={error} onRetry={reload} />
      {data && (data.data.length === 0 ? (
        <p className="table-empty">No alerts yet. Click <strong>New alert</strong> to publish one.</p>
      ) : (
        <ul className="adminAlerts">
          {data.data.map((a) => (
            <li key={a.id}>
              <div className="adminAlertHead">
                <span className={`sev sev-${a.severity}`}>{a.severity}</span>
                <strong>{a.title}</strong>
                <span className={`badge ${a.status}`}>{a.status}</span>
                {a.summary_pcm && <span className="badge pcm">Pidgin</span>}
              </div>
              <p>{a.summary}</p>
              <p className="dash-muted">
                {a.red_flags.length} red flags, {a.what_to_do.length} steps. Updated {shortDate(a.updated_at)}.
                {a.emailed_at ? ` Emailed ${shortDate(a.emailed_at)}.` : ""}
              </p>
              <div className="dash-actions">
                <button type="button" className="action-btn" onClick={() => setEditing(a)}>Edit</button>
                {a.status === "published" && (
                  confirmEmail === a.id ? (
                    <>
                      <button type="button" className="action-btn primary" onClick={() => email(a.id)}>Send to {data.subscribers}</button>
                      <button type="button" className="action-btn" onClick={() => setConfirmEmail(null)}>Cancel</button>
                    </>
                  ) : (
                    <button type="button" className="action-btn" disabled={emailing === a.id || !data.subscribers} onClick={() => setConfirmEmail(a.id)}>
                      {emailing === a.id ? "Sending..." : a.emailed_at ? "Email again" : "Email subscribers"}
                    </button>
                  )
                )}
                {confirmId === a.id ? (
                  <>
                    <button type="button" className="action-btn danger" onClick={() => remove(a.id)}>Confirm delete</button>
                    <button type="button" className="action-btn" onClick={() => setConfirmId(null)}>Keep</button>
                  </>
                ) : (
                  <button type="button" className="action-btn" onClick={() => setConfirmId(a.id)}>Delete</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ))}
      {editing && (
        <AlertForm initial={editing === "new" ? null : editing} onClose={() => setEditing(null)}
          onDone={(msg) => { setEditing(null); setNotice({ ok: true, text: msg }); reload(); }} />
      )}
    </div>
  );
}
export default AdminAlerts;
