import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch, apiPost } from "../../config/api";
import { QUESTION_TOPICS } from "../../lib/questions";

/** Ask the MoneyMentor team a money question; answers arrive here and by email. */
function MyQuestions() {
  const [items, setItems] = useState(null);
  const [topic, setTopic] = useState("scams");
  const [question, setQuestion] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [sending, setSending] = useState(false);

  const load = useCallback(() => {
    apiFetch("api/questions.php").then((r) => setItems(r.success ? r.data : [])).catch(() => setItems([]));
  }, []);
  useEffect(load, [load]);

  const ask = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const r = await apiPost("api/questions.php", { topic, question });
      if (!r.success) throw new Error(r.message);
      setMsg({ type: "ok", text: r.message });
      setQuestion("");
      load();
    } catch (err) {
      setMsg({ type: "err", text: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <header className="accHead">
        <div>
          <h1>Ask an expert</h1>
          <p>Not sure about a loan, an investment or a message you got? Ask us. We reply here and by email.</p>
        </div>
      </header>

      <div className="askGrid">
        <section className="accPanel">
          <form className="askForm" onSubmit={ask}>
            <label>
              <span>Topic</span>
              <select value={topic} onChange={(e) => setTopic(e.target.value)}>
                {Object.entries(QUESTION_TOPICS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
              </select>
            </label>
            <label>
              <span>Your question</span>
              <textarea rows={5} maxLength={2000} required value={question} onChange={(e) => { setQuestion(e.target.value); setMsg({ type: "", text: "" }); }}
                placeholder="e.g. A loan app is offering me ₦50,000 for 14 days at 1% a day. Is that a good deal?" />
            </label>
            <p className="muted small">Never include your PIN, OTP, password, card or account numbers. We will never ask for them.</p>
            <button type="submit" className="btn btn-solid" disabled={sending || question.trim().length < 15}>{sending ? "Sending..." : "Send question"}</button>
            {msg.text && <p className={msg.type === "ok" ? "formOk" : "formErr"} role="status">{msg.text}</p>}
          </form>
        </section>
        <aside className="accPanel">
          <h2 className="panelTitle">Already answered</h2>
          <p className="muted">Browse questions other learners asked in the <Link to="/questions">public FAQ</Link>. Your answer may already be there.</p>
          <p className="muted">Urgent? If you&apos;ve shared a code or sent money to a scammer, <Link to="/help-now">follow these steps now</Link>.</p>
        </aside>
      </div>

      <section className="accPanel">
        <div className="panelHead"><h2>Your questions</h2></div>
        {items === null ? (
          <p className="muted">Loading…</p>
        ) : items.length === 0 ? (
          <p className="muted">You haven&apos;t asked anything yet.</p>
        ) : (
          <ul className="myQs">
            {items.map((q) => (
              <li key={q.id}>
                <div className="myQTop">
                  <span className="faqTopic">{QUESTION_TOPICS[q.topic] || "Other"}</span>
                  <span className={`qStatus ${q.status}`}>{q.status === "answered" ? "Answered" : "Waiting for an answer"}</span>
                </div>
                <p className="myQ">{q.question}</p>
                {q.answer && <div className="myA">{q.answer.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}</div>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
export default MyQuestions;
