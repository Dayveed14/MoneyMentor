import { useState } from "react";
import { apiPost } from "../../config/api";
import { useAdmin, SectionState, Pager, timeAgo, MailModeNote } from "./adminShared";

/** Write a reply that's emailed to the sender and saved with the message. */
function ReplyBox({ message, onSent }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const send = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await apiPost("api/admin_messages.php", { action: "reply", id: message.id, reply: text });
      if (!res.success) throw new Error(res.message);
      setText("");
      onSent(res.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="replyBox" onSubmit={send}>
      <label htmlFor={`reply-${message.id}`}>{message.reply ? "Send another reply" : `Reply to ${message.name.split(" ")[0]}`}</label>
      <textarea id={`reply-${message.id}`} rows={4} value={text} onChange={(e) => setText(e.target.value)} maxLength={5000}
        placeholder="Your reply is emailed to them, with their message quoted underneath." />
      {error && <p className="formErr" role="alert">{error}</p>}
      <button type="submit" className="btn-primary" disabled={busy || text.trim().length < 2}>{busy ? "Sending..." : "Send reply"}</button>
    </form>
  );
}

function AdminMessages({ onChange }) {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [notice, setNotice] = useState("");
  const { data, loading, error, reload } = useAdmin(`api/admin_messages.php?page=${page}&filter=${filter}`);

  const act = async (action, id) => {
    await apiPost("api/admin_messages.php", { action, id }).catch(() => {});
    setConfirmId(null);
    reload();
    onChange?.();
  };

  const toggle = (m) => {
    setOpen(open === m.id ? null : m.id);
    if (!m.is_read) act("mark_read", m.id);
  };

  return (
    <div className="content-section">
      <div className="dash-toolbar">
        <div className="dash-filter" role="group" aria-label="Filter messages">
          {[["", "All"], ["unread", "Unread"]].map(([v, label]) => (
            <button key={v} type="button" className={filter === v ? "on" : ""} aria-pressed={filter === v}
              onClick={() => { setFilter(v); setPage(1); }}>{label}</button>
          ))}
        </div>
        {data && <span className="dash-muted">{data.unread} unread</span>}
      </div>
      {data && <MailModeNote enabled={data.mail_enabled} />}
      {notice && <p className="formOk" role="status">{notice}</p>}
      <SectionState loading={loading && !data} error={error} onRetry={reload} />
      {data && (data.data.length === 0 ? (
        <p className="table-empty">{filter ? "No unread messages." : "No messages yet. Messages from the contact form appear here."}</p>
      ) : (
        <ul className="messageList">
          {data.data.map((m) => (
            <li key={m.id} className={m.is_read ? "" : "unread"}>
              <button type="button" className="messageHead" aria-expanded={open === m.id} onClick={() => toggle(m)}>
                <span className="messageDot" aria-hidden="true" />
                <strong>{m.name}</strong>
                <span className="messageSubject">{m.subject || "(no subject)"}{m.replied_at && <em className="repliedTag">Replied</em>}</span>
                <span className="messageTime">{timeAgo(m.created_at)}</span>
              </button>
              {open === m.id && (
                <div className="messageBody">
                  <p className="dash-muted">{m.email}</p>
                  <p className="messageText">{m.message}</p>
                  {m.reply && (
                    <div className="sentReply">
                      <span className="dash-muted">Your reply, {timeAgo(m.replied_at)}</span>
                      <p>{m.reply}</p>
                    </div>
                  )}
                  <ReplyBox message={m} onSent={(msg) => { setNotice(msg); reload(); }} />
                  <div className="dash-actions">
                    <button type="button" className="action-btn" onClick={() => act(m.is_read ? "mark_unread" : "mark_read", m.id)}>
                      Mark as {m.is_read ? "unread" : "read"}
                    </button>
                    {confirmId === m.id ? (
                      <button type="button" className="action-btn danger" onClick={() => act("delete", m.id)}>Confirm delete</button>
                    ) : (
                      <button type="button" className="action-btn" onClick={() => setConfirmId(m.id)}>Delete</button>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      ))}
      {data && <Pager page={page} totalPages={data.pagination.total_pages} onChange={setPage} />}
    </div>
  );
}
export default AdminMessages;
