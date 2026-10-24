import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiChevronDown, HiSearch } from "react-icons/hi";
import { apiFetch } from "../config/api";
import { useAuth } from "../context/AuthContext";
import { QUESTION_TOPICS } from "../lib/questions";
import "./SafetyPages.css";

/** Answered "Ask an expert" questions that admins chose to share (no names). */
function Faq() {
  const { user } = useAuth();
  const [items, setItems] = useState(null);
  const [topic, setTopic] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const qs = new URLSearchParams();
    if (topic) qs.set("topic", topic);
    if (query) qs.set("search", query);
    apiFetch(`api/get_faq.php?${qs}`)
      .then((r) => setItems(r.success ? r.data : []))
      .catch(() => setItems([]));
  }, [topic, query]);

  return (
    <div className="safetyPage">
      <header className="verifyHero">
        <div className="wrap">
          <h1>Ask an expert</h1>
          <p>Real questions from MoneyMentor learners, answered by our team. Can&apos;t find yours? Ask it. We answer by email.</p>
          <Link to={user ? "/account/questions" : "/login"} state={user ? undefined : { from: "/account/questions" }} className="btn btn-solid">
            {user ? "Ask a question" : "Log in to ask a question"}
          </Link>
        </div>
      </header>

      <div className="wrap safetyBody narrow">
        <div className="faqTools">
          <label className="faqSearch">
            <HiSearch aria-hidden="true" />
            <span className="srOnly">Search questions</span>
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search, e.g. loan app, OTP, pension" />
          </label>
          <div className="chipRow" role="group" aria-label="Filter by topic">
            <button type="button" className={`chip ${topic === "" ? "on" : ""}`} onClick={() => setTopic("")}>All</button>
            {Object.entries(QUESTION_TOPICS).map(([id, label]) => (
              <button key={id} type="button" className={`chip ${topic === id ? "on" : ""}`} onClick={() => setTopic(id)}>{label}</button>
            ))}
          </div>
        </div>

        {items === null ? (
          <p className="muted">Loading…</p>
        ) : items.length === 0 ? (
          <p className="helpEmpty">No answered questions here yet. Be the first to ask.</p>
        ) : (
          <ul className="faqList">
            {items.map((q) => (
              <li key={q.id} className={open === q.id ? "open" : ""}>
                <button type="button" aria-expanded={open === q.id} onClick={() => setOpen(open === q.id ? null : q.id)}>
                  <span className="faqTopic">{QUESTION_TOPICS[q.topic] || "Other"}</span>
                  <span className="faqQ">{q.question}</span>
                  <HiChevronDown aria-hidden="true" />
                </button>
                {open === q.id && <div className="faqA">{q.answer.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}</div>}
              </li>
            ))}
          </ul>
        )}
        <p className="muted small faqNote">Answers are general guidance, not financial or legal advice for your situation.</p>
      </div>
    </div>
  );
}
export default Faq;
