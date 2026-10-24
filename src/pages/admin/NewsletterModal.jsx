import { useState } from "react";
import { apiPost } from "../../config/api";
import { Modal } from "./adminShared";

/** Compose an email to every subscriber. Send a test to yourself first. */
function NewsletterModal({ count, onClose, onSent }) {
  const [form, setForm] = useState({ subject: "", body: "" });
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState({ ok: true, text: "" });
  const [confirm, setConfirm] = useState(false);

  const run = async (action) => {
    setBusy(action);
    setMsg({ ok: true, text: "" });
    try {
      const res = await apiPost("api/admin_newsletter.php", { action, ...form });
      if (!res.success) throw new Error(res.message);
      if (action === "send") return onSent(res.message);
      setMsg({ ok: true, text: res.message });
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setBusy("");
      setConfirm(false);
    }
  };

  const ready = form.subject.trim() && form.body.trim().length >= 10;

  return (
    <Modal title="Email your subscribers" onClose={onClose} wide>
      <form className="modalForm" onSubmit={(e) => { e.preventDefault(); setConfirm(true); }}>
        <label><span>Subject</span><input value={form.subject} maxLength={150} required onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. 3 scams to watch for this month" /></label>
        <label>
          <span>Message (leave a blank line between paragraphs)</span>
          <textarea rows={10} value={form.body} maxLength={20000} required onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder={"Hi there,\n\nThis month we've seen..."} />
        </label>
        <p className="dash-muted">Every email includes the safety reminder and an unsubscribe link.</p>
        {msg.text && <p className={msg.ok ? "formOk" : "formErr"} role="status">{msg.text}</p>}
        <div className="modalActions">
          <button type="button" className="btn-secondary" onClick={() => run("test")} disabled={!ready || busy}>{busy === "test" ? "Sending..." : "Send me a test"}</button>
          {confirm ? (
            <>
              <button type="button" className="btn-secondary" onClick={() => setConfirm(false)}>Cancel</button>
              <button type="button" className="btn-primary" onClick={() => run("send")} disabled={busy}>{busy === "send" ? "Sending..." : `Yes, send to ${count}`}</button>
            </>
          ) : (
            <button type="submit" className="btn-primary" disabled={!ready || !count || busy}>Send to {count} subscriber{count === 1 ? "" : "s"}</button>
          )}
        </div>
      </form>
    </Modal>
  );
}
export default NewsletterModal;
