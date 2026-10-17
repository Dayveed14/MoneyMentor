import { useAdmin, SectionState } from "./adminShared";
import { moduleById } from "../../data/modules";
import { TOPICS } from "../../data/assessment";

const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);

function AdminLearning() {
  const { data, loading, error, reload } = useAdmin("api/admin_learning.php");
  if (!data) return <div className="content-section"><SectionState loading={loading} error={error} onRetry={reload} /></div>;
  const a = data.assessment;
  const weakest = Object.entries(a.topic_average_percent).filter(([, v]) => v !== null).sort((x, y) => x[1] - y[1])[0];

  return (
    <div className="learningGrid">
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
      <p className="dash-muted">Lesson and quiz content lives in the frontend code (src/data/modules.js).</p>
    </div>
  );
}
export default AdminLearning;
