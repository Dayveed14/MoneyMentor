import { useEffect, useState } from "react";
import { apiPost } from "../../config/api";
import { useAdmin, SectionState, Modal, shortDate } from "./adminShared";

const EMPTY = { name: "", kind: "bank", ussd: "", phone: "", url: "", note: "", sort_order: 0, status: "draft" };

function ContactForm({ initial, onClose, onDone }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await apiPost("api/admin_help_contacts.php", { action: initial ? "update" : "create", ...form, sort_order: Number(form.sort_order) || 0 });
      if (!res.success) throw new Error(res.message);
      onDone(res.message);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <Modal title={initial ? `Edit ${initial.name}` : "Add a help contact"} onClose={onClose}>
      <form className="modalForm" onSubmit={submit}>
        <div className="modalCols">
          <label><span>Name</span><input value={form.name} onChange={set("name")} maxLength={120} required /></label>
          <label>
            <span>Type</span>
            <select value={form.kind} onChange={set("kind")}>
              <option value="bank">Bank</option>
              <option value="agency">Agency / where to report</option>
            </select>
          </label>
        </div>
        <div className="modalCols">
          <label><span>USSD code to block account</span><input value={form.ussd} onChange={set("ussd")} maxLength={40} placeholder="*123*911#" /></label>
          <label><span>Phone number</span><input value={form.phone} onChange={set("phone")} maxLength={120} placeholder="0700 000 0000" /></label>
        </div>
        <label><span>Website</span><input value={form.url} onChange={set("url")} maxLength={300} placeholder="https://" /></label>
        <label><span>Note</span><input value={form.note} onChange={set("note")} maxLength={300} placeholder="Shown under the contact" /></label>
        <div className="modalCols">
          <label><span>Order (lower first)</span><input type="number" value={form.sort_order} onChange={set("sort_order")} /></label>
          <label>
            <span>Status</span>
            <select value={form.status} onChange={set("status")}>
              <option value="draft">Draft (hidden)</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>
        {error && <p className="formErr" role="alert">{error}</p>}
        <div className="modalActions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={busy}>{busy ? "Saving..." : "Save"}</button>
        </div>
      </form>
    </Modal>
  );
}

/** Bank fraud codes and agencies shown on the "Got scammed?" page. */
function AdminHelpContacts({ addTick }) {
  const { data, loading, error, reload } = useAdmin("api/admin_help_contacts.php");
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (addTick) setEditing("new");
  }, [addTick]);

  const quick = async (c, changes) => {
    const res = await apiPost("api/admin_help_contacts.php", { action: "update", ...c, ...changes }).catch(() => null);
    setNotice(res?.message || "");
    reload();
  };
  const remove = async (c) => {
    const res = await apiPost("api/admin_help_contacts.php", { action: "delete", id: c.id }).catch(() => null);
    setNotice(res?.message || "");
    reload();
  };

  const drafts = data?.data.filter((c) => c.kind === "bank" && c.status === "draft").length || 0;

  return (
    <div className="content-section">
      <p className="dash-muted alertsIntro">
        These appear on the <strong>Got scammed?</strong> page. Bank codes change and different sources disagree, so the starter bank
        codes are drafts. <strong>Confirm each one with the bank, then publish it.</strong>
      </p>
      {drafts > 0 && <p className="mailNote" role="note">{drafts} bank code{drafts === 1 ? " is" : "s are"} waiting to be confirmed and published.</p>}
      {notice && <p className="formOk" role="status">{notice}</p>}
      <SectionState loading={loading && !data} error={error} onRetry={reload} />
      {data && (
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Type</th><th>Code / phone / link</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {data.data.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong>{c.note && <div className="dash-muted small">{c.note}</div>}</td>
                  <td>{c.kind === "bank" ? "Bank" : "Agency"}</td>
                  <td className="contactCell">
                    {c.ussd && <code>{c.ussd}</code>}
                    {c.phone && <span>{c.phone}</span>}
                    {c.url && <a href={c.url} target="_blank" rel="noopener noreferrer">{c.url.replace(/^https?:\/\//, "").slice(0, 34)}</a>}
                  </td>
                  <td><span className={`badge ${c.status}`}>{c.status}</span><div className="dash-muted small">{shortDate(c.updated_at)}</div></td>
                  <td className="dash-actions">
                    <button type="button" className="action-btn" onClick={() => setEditing(c)}>Edit</button>
                    <button type="button" className={`action-btn ${c.status === "draft" ? "primary" : ""}`} onClick={() => quick(c, { status: c.status === "draft" ? "published" : "draft" })}>
                      {c.status === "draft" ? "Confirmed, publish" : "Unpublish"}
                    </button>
                    <button type="button" className="action-btn danger" onClick={() => remove(c)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editing && (
        <ContactForm initial={editing === "new" ? null : editing} onClose={() => setEditing(null)}
          onDone={(msg) => { setEditing(null); setNotice(msg); reload(); }} />
      )}
    </div>
  );
}
export default AdminHelpContacts;
