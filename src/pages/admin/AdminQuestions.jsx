import { useState } from "react";
import { apiPost } from "../../config/api";
import { QUESTION_TOPICS } from "../../lib/questions";
import { useAdmin, SectionState, Pager, timeAgo, MailModeNote } from "./adminShared";

function AnswerBox({ q, onDone }) {
  const [answer, setAnswer] = useState(q.answer || "");
  const [isPublic, setIsPublic] = useState(q.status === "answered" ? q.is_public : true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await apiPost("api/admin_questions.php", { action: "answer", id: q.id, answer, is_public: isPublic });
      if (!res.success) throw new Error(res.message);
      onDone(res.message);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <form className="replyBox" onSubmit={save}>
      <label htmlFor={`ans-${q.id}`}>{q.status === "answered" ? "Edit answer" : "Your answer"}</label>
      <textarea id={`ans-${q.id}`} rows={5} value={answer} maxLength={8000} onChange={(e) => setAnswer(e.target.value)}
        placeholder="Plain, practical guidance. It's emailed to the learner." />
      <label className="inlineCheck">
        <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
        Add to the public FAQ (their name is never shown)
      </label>
      {error && <p className="formErr" role="alert">{error}</p>}
      <button type="submit" className="btn-primary" disabled={busy || answer.trim().length < 10}>{busy ? "Saving..." : q.status === "answered" ? "Update and email" : "Send answer"}</button>
    </form>
  );
}

/** "Ask an expert" questions from learners. */
function AdminQuestions({ onChange }) {
  const [status, setStatus] = useState("pending");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(null);
  const [notice, setNotice] = useState("");
  const { data, loading, error, reload } = useAdmin(`api/admin_questions.php?status=${status}&page=${page}`);

  const act = async (action, id, extra = {}) => {
    const res = await apiPost("api/admin_questions.php", { action, id, ...extra }).catch(() => null);
    setNotice(res?.message || "");
    reload();
  };
  const done = (msg) => {
    setNotice(msg);
    setOpen(null);
    reload();
    onChange?.();
  };

  return (
    <div className="content-section">
      <div className="dash-toolbar">
        <div className="dash-filter" role="group" aria-label="Filter questions">
          {[["pending", "Waiting"], ["answered", "Answered"], ["all", "All"]].map(([v, label]) => (
            <button key={v} type="button" className={status === v ? "on" : ""} aria-pressed={status === v} onClick={() => { setStatus(v); setPage(1); }}>{label}</button>
          ))}
        </div>
        {data && <span className="dash-muted">{data.pending} waiting for an answer</span>}
      </div>
      {data && <MailModeNote enabled={data.mail_enabled} />}
      {notice && <p className="formOk" role="status">{notice}</p>}
      <SectionState loading={loading && !data} error={error} onRetry={reload} />
      {data && (data.data.length === 0 ? (
        <p className="table-empty">{status === "pending" ? "No questions waiting. Learners ask from their dashboard." : "Nothing here yet."}</p>
      ) : (
        <ul className="messageList">
          {data.data.map((q) => (
            <li key={q.id} className={q.status === "pending" ? "unread" : ""}>
              <button type="button" className="messageHead" aria-expanded={open === q.id} onClick={() => setOpen(open === q.id ? null : q.id)}>
                <span className="messageDot" aria-hidden="true" />
                <strong>{QUESTION_TOPICS[q.topic] || q.topic}</strong>
                <span className="messageSubject">
                  {q.question.slice(0, 100)}
                  {q.is_public && <em className="repliedTag">In FAQ</em>}
                </span>
                <span className="messageTime">{timeAgo(q.created_at)}</span>
              </button>
              {open === q.id && (
                <div className="messageBody">
                  <p className="dash-muted">{q.user_name || "Deleted user"}{q.user_email ? ` · ${q.user_email}` : ""}</p>
                  <p className="messageText">{q.question}</p>
                  <AnswerBox q={q} onDone={done} />
                  <div className="dash-actions">
                    {q.status === "answered" && (
                      <button type="button" className="action-btn" onClick={() => act("set_public", q.id, { is_public: !q.is_public })}>
                        {q.is_public ? "Remove from FAQ" : "Add to FAQ"}
                      </button>
                    )}
                    <button type="button" className="action-btn danger" onClick={() => act("delete", q.id)}>Delete</button>
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
export default AdminQuestions;
