import { useState } from "react";
import { FiDownload } from "react-icons/fi";
import { useAdmin, SectionState, downloadCsv } from "./adminShared";
import LessonVideos from "./LessonVideos";
import { moduleById } from "../../data/modules";
import { TOPICS } from "../../data/assessment";

const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);

/** Before/after knowledge check for learners who took it at least twice. */
function KnowledgeGainPanel({ gain }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const exportResearch = async () => {
    setBusy(true);
    setErr("");
    try {
      await downloadCsv("research");
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };
  const change = gain.retested ? gain.latest_average - gain.first_average : 0;

  return (
    <section className="content-section">
      <div className="sectionHeadRow">
        <h2 className="sectionTitle">Knowledge gain</h2>
        <button type="button" className="btn-secondary" onClick={exportResearch} disabled={busy}>
          <FiDownload size={14} aria-hidden="true" /> {busy ? "Preparing..." : "Research data (CSV)"}
        </button>
      </div>
      <p className="dash-muted">
        Compares each learner&apos;s first knowledge check with their latest. Learners are prompted to retake the check once they finish their key lessons.
        The CSV has one anonymous row per learner (no names or emails): first and latest scores per topic, lessons completed and quizzes passed.
      </p>
      {err && <p className="formErr">{err}</p>}
      {gain.retested === 0 ? (
        <p className="table-empty">No one has retaken the check yet.</p>
      ) : (
        <>
          <div className="funnel">
            <div><strong className="num">{gain.retested}</strong><span>learners retested</span></div>
            <div><strong className="num">{gain.first_average}% → {gain.latest_average}%</strong><span>average score, first → latest</span></div>
            <div><strong className={`num ${change > 0 ? "pos" : change < 0 ? "neg" : ""}`}>{change > 0 ? "+" : ""}{change} pts</strong><span>average change</span></div>
            <div><strong className="num">{gain.improved} / {gain.same} / {gain.declined}</strong><span>improved / same / lower</span></div>
          </div>
          <h3>By topic (first → latest)</h3>
          <div className="topicBars">
            {Object.entries(gain.topics).filter(([, t]) => t.learners > 0).map(([id, t]) => (
              <div className="topicBar gainRow" key={id}>
                <span>{TOPICS[id]?.label || id}</span>
                <div className="gainPair">
                  <div className="hbar before"><span style={{ width: `${t.first}%` }} /></div>
                  <div className="hbar"><span style={{ width: `${t.latest}%` }} /></div>
                </div>
                <span className="num">{t.first}% → {t.latest}%</span>
              </div>
            ))}
          </div>
          {gain.average_days_between !== null && <p className="dash-muted">Average time between first and latest check: {gain.average_days_between} days.</p>}
        </>
      )}
    </section>
  );
}

function AdminLearning() {
  const { data, loading, error, reload } = useAdmin("api/admin_learning.php");
  if (!data) return <div className="content-section"><SectionState loading={loading} error={error} onRetry={reload} /></div>;
  const a = data.assessment;
  const weakest = Object.entries(a.topic_average_percent).filter(([, v]) => v !== null).sort((x, y) => x[1] - y[1])[0];

  return (
    <div className="learningGrid">
      {data.gain && <KnowledgeGainPanel gain={data.gain} />}
      <section className="content-section">
        <h2 className="sectionTitle">Knowledge check</h2>
        {a.learners === 0 ? (
          <p className="dash-muted">No one has taken the knowledge check yet.</p>
        ) : (
          <>
            <p className="dash-muted">
              Based on the latest result from {a.learners} learner{a.learners === 1 ? "" : "s"}.
              {weakest && <> Weakest area: <strong>{TOPICS[weakest[0]]?.label}</strong> ({weakest[1]}% correct). Consider an article or scam alert on it.</>}
            </p>
            <div className="learnCols">
              <div>
                <h3>Levels</h3>
                <div className="topicBars">
                  {Object.entries(a.levels).map(([lvl, n]) => (
                    <div className="topicBar" key={lvl}>
                      <span>{lvl}</span>
                      <div className="hbar"><span style={{ width: `${pct(n, a.learners)}%` }} /></div>
                      <span className="num">{n}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3>Average score by topic</h3>
                <div className="topicBars">
                  {Object.entries(a.topic_average_percent).map(([t, v]) => (
                    <div className="topicBar" key={t}>
                      <span>{TOPICS[t]?.label || t}</span>
                      <div className={`hbar ${v !== null && v < 60 ? "warn" : ""}`}><span style={{ width: `${v ?? 0}%` }} /></div>
                      <span className="num">{v === null ? "—" : `${v}%`}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3>What learners want help with</h3>
                <div className="topicBars">
                  {Object.entries(a.goals).sort((x, y) => y[1] - x[1]).map(([t, n]) => (
                    <div className="topicBar" key={t}>
                      <span>{TOPICS[t]?.label || t}</span>
                      <div className="hbar goal"><span style={{ width: `${pct(n, a.learners)}%` }} /></div>
                      <span className="num">{n}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      {data.modules.map((m) => {
        const mod = moduleById(m.module);
        const max = Math.max(1, ...m.lessons.map((l) => l.completions));
        return (
          <section className="content-section" key={m.module}>
            <h2 className="sectionTitle">{mod?.title || m.module}</h2>
            <div className="funnel">
              <div><strong className="num">{m.learners_started}</strong><span>started</span></div>
              <div><strong className="num">{m.learners_finished_lessons}</strong><span>finished all lessons</span></div>
              <div><strong className="num">{m.quiz_passed_learners}</strong><span>passed the quiz</span></div>
              <div><strong className="num">{m.quiz_average === null ? "—" : `${m.quiz_average}%`}</strong><span>average quiz score ({m.quiz_attempts} attempts)</span></div>
            </div>
            <h3>Completions per lesson</h3>
            <div className="topicBars">
              {m.lessons.map((l) => (
                <div className="topicBar" key={l.lesson}>
                  <span>{mod?.lessons.find((x) => x.id === l.lesson)?.title || l.lesson}</span>
                  <div className="hbar"><span style={{ width: `${pct(l.completions, max)}%` }} /></div>
                  <span className="num">{l.completions}</span>
                </div>
              ))}
            </div>
          </section>
        );
      })}
      <LessonVideos />
      <p className="dash-muted">Lesson and quiz text lives in the frontend code (src/data/modules.js and modulesMore.js).</p>
    </div>
  );
}
export default AdminLearning;
