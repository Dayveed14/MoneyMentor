import { useState } from "react";
import { apiPost } from "../../config/api";
import { useAdmin, SectionState, Pager, timeAgo } from "./adminShared";

function AdminMessages({ onChange }) {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
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
                <span className="messageSubject">{m.subject || "(no subject)"}</span>
                <span className="messageTime">{timeAgo(m.created_at)}</span>
              </button>
              {open === m.id && (
                <div className="messageBody">
                  <p className="dash-muted">{m.email}</p>
                  <p className="messageText">{m.message}</p>
                  <div className="dash-actions">
                    <a className="action-btn" href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + (m.subject || "Your message to MoneyMentor"))}`}>Reply by email</a>
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
