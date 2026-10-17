import { useEffect, useState } from "react";
import { apiPost } from "../../config/api";
import { useAdmin, SectionState, Modal, shortDate } from "./adminShared";

const EMPTY = { title: "", summary: "", red_flags: "", what_to_do: "", severity: "high", status: "published" };

function AlertForm({ initial, onClose, onDone }) {
  const [form, setForm] = useState(
    initial
      ? { ...initial, red_flags: initial.red_flags.join("\n"), what_to_do: initial.what_to_do.join("\n") }
      : EMPTY
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await apiPost("api/admin_scam_alerts.php", { action: initial ? "update" : "create", id: initial?.id, ...form });
      if (!res.success) throw new Error(res.message);
      onDone(res.message);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <Modal title={initial ? "Edit scam alert" : "New scam alert"} onClose={onClose} wide>
      <form className="modalForm" onSubmit={submit}>
        <label><span>Title</span><input value={form.title} onChange={set("title")} maxLength={160} required placeholder="e.g. Fake loan apps that harass your contacts" /></label>
        <label><span>Summary</span><textarea value={form.summary} onChange={set("summary")} maxLength={400} rows={3} required placeholder="What's happening, in one or two sentences" /></label>
        <div className="modalCols">
          <label>
            <span>Red flags (one per line)</span>
            <textarea value={form.red_flags} onChange={set("red_flags")} rows={5} required placeholder={"Asks for your OTP\nThreatens to block your account"} />
          </label>
          <label>
            <span>What to do (one per line)</span>
            <textarea value={form.what_to_do} onChange={set("what_to_do")} rows={5} required placeholder={"Hang up\nCall your bank on the number on your card"} />
          </label>
        </div>
        <div className="modalCols">
          <label>
            <span>How serious</span>
            <select value={form.severity} onChange={set("severity")}>
              <option value="high">High — act now</option>
              <option value="medium">Medium — be careful</option>
              <option value="low">Low — good to know</option>
            </select>
          </label>
          <label>
            <span>Status</span>
            <select value={form.status} onChange={set("status")}>
              <option value="published">Published (shown on the site)</option>
              <option value="draft">Draft (hidden)</option>
            </select>
          </label>
        </div>
        {error && <p className="formErr" role="alert">{error}</p>}
        <div className="modalActions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={busy}>{busy ? "Saving..." : initial ? "Save changes" : "Save alert"}</button>
        </div>
      </form>
    </Modal>
  );
}

function AdminAlerts({ addTick }) {
  const { data, loading, error, reload } = useAdmin("api/admin_scam_alerts.php");
  const [editing, setEditing] = useState(null); // null | "new" | alert
  const [confirmId, setConfirmId] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (addTick) setEditing("new");
  }, [addTick]);

  const remove = async (id) => {
    const res = await apiPost("api/admin_scam_alerts.php", { action: "delete", id }).catch(() => null);
    setNotice(res?.message || "");
    setConfirmId(null);
    reload();
  };

  return (
    <div className="content-section">
      <p className="dash-muted alertsIntro">
        Scam alerts appear on the home page and the Scam alerts page. Publish one whenever a new scam is doing the rounds.
      </p>
      {notice && <p className="formOk" role="status">{notice}</p>}
      <SectionState loading={loading && !data} error={error} onRetry={reload} />
      {data && (data.data.length === 0 ? (
        <p className="table-empty">No alerts yet. Click <strong>Add New</strong> to publish one.</p>
      ) : (
        <ul className="adminAlerts">
          {data.data.map((a) => (
            <li key={a.id}>
              <div className="adminAlertHead">
                <span className={`sev sev-${a.severity}`}>{a.severity}</span>
                <strong>{a.title}</strong>
                <span className={`badge ${a.status}`}>{a.status}</span>
              </div>
              <p>{a.summary}</p>
              <p className="dash-muted">{a.red_flags.length} red flags, {a.what_to_do.length} steps. Updated {shortDate(a.updated_at)}.</p>
              <div className="dash-actions">
                <button type="button" className="action-btn" onClick={() => setEditing(a)}>Edit</button>
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
          onDone={(msg) => { setEditing(null); setNotice(msg); reload(); }} />
      )}
    </div>
  );
}
export default AdminAlerts;
