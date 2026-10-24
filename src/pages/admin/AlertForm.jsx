import { useState } from "react";
import { apiPost } from "../../config/api";
import { Modal } from "./adminShared";

const EMPTY = { title: "", summary: "", summary_pcm: "", red_flags: "", what_to_do: "", severity: "high", status: "published" };

/**
 * Create or edit a scam alert. `initial` = an existing alert (edit) or a
 * prefilled draft from a scam report (has report_id, no id).
 */
function AlertForm({ initial, onClose, onDone }) {
  const editing = Boolean(initial?.id);
  const [form, setForm] = useState(() => {
    if (!initial) return EMPTY;
    const list = (v) => (Array.isArray(v) ? v.join("\n") : v || "");
    return { ...EMPTY, ...initial, summary_pcm: initial.summary_pcm || "", red_flags: list(initial.red_flags), what_to_do: list(initial.what_to_do) };
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await apiPost("api/admin_scam_alerts.php", {
        action: editing ? "update" : "create",
        id: initial?.id,
        report_id: initial?.report_id,
        ...form,
      });
      if (!res.success) throw new Error(res.message);
      onDone(res.message);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <Modal title={editing ? "Edit scam alert" : initial?.report_id ? "Publish report as an alert" : "New scam alert"} onClose={onClose} wide>
      <form className="modalForm" onSubmit={submit}>
        {initial?.report_id && !editing && (
          <p className="dash-muted">Prefilled from the report. Remove personal details (names, the reporter&apos;s number) before publishing.</p>
        )}
        <label><span>Title</span><input value={form.title} onChange={set("title")} maxLength={160} required placeholder="e.g. Fake loan apps that harass your contacts" /></label>
        <label><span>Summary</span><textarea value={form.summary} onChange={set("summary")} maxLength={400} rows={3} required placeholder="What's happening, in one or two sentences" /></label>
        <label>
          <span>Summary in Pidgin (optional, shown when visitors switch to Pidgin)</span>
          <textarea value={form.summary_pcm} onChange={set("summary_pcm")} maxLength={600} rows={2} placeholder="e.g. Dem go call you say na your bank, make you give dem OTP..." />
        </label>
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
              <option value="high">High: act now</option>
              <option value="medium">Medium: be careful</option>
              <option value="low">Low: good to know</option>
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
          <button type="submit" className="btn-primary" disabled={busy}>{busy ? "Saving..." : editing ? "Save changes" : "Save alert"}</button>
        </div>
      </form>
    </Modal>
  );
}
export default AlertForm;
