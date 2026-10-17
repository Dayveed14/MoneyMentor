import { Link } from "react-router-dom";
import { HiCheckCircle } from "react-icons/hi";
import { useProgress, moduleStats, orderedModules } from "../../hooks/useProgress";
import { useAssessment } from "../../hooks/useAssessment";
import { PASS_PERCENT } from "../../data/modules";

function MyModules() {
  const { progress, error, reload } = useProgress();
  const { assessment } = useAssessment();
  const keySet = new Set((assessment?.path?.key_lessons || []).map((k) => k.lesson));

  return (
    <>
      <header className="accHead">
        <div>
          <h1>My modules</h1>
          <p>
            Short lessons, then a quiz. Pass with {PASS_PERCENT}% or more to complete a module.
            {assessment && " Shown in the order your knowledge check recommended."}
          </p>
        </div>
      </header>
      {error && (
        <div className="accError" role="alert">
          {error} <button type="button" onClick={reload}>Try again</button>
        </div>
      )}

      <div className="moduleList">
        {orderedModules(assessment?.path).map((m) => {
          const s = moduleStats(m, progress);
          return (
            <section className="accPanel moduleBlock" key={m.id}>
              <div className="moduleBlockHead">
                <img src={m.image} alt="" />
                <div>
                  <h2>{m.title}</h2>
                  <p>{m.blurb}</p>
                  <div className="bar"><span style={{ width: `${s.percent}%` }} /></div>
                  <p className="muted num">
                    {s.completed} of {s.total} lessons done
                    {s.finished && <span className="donePill">Completed</span>}
                  </p>
                </div>
              </div>
              <ol className="lessonList">
                {m.lessons.map((l, i) => (
                  <li key={l.id} className={s.done.has(l.id) ? "done" : ""}>
                    <Link to={`/learn/${m.id}?lesson=${l.id}`}>
                      <span className="lessonNum num">{s.done.has(l.id) ? <HiCheckCircle aria-label="Done" /> : i + 1}</span>
                      <span className="lessonTitle">
                        {l.title}
                        {keySet.has(l.id) && !s.done.has(l.id) && <span className="keyPill">Key for you</span>}
                      </span>
                      <span className="lessonMin num">{l.minutes} min</span>
                    </Link>
                  </li>
                ))}
                <li className={s.quizPassed ? "done quizItem" : "quizItem"}>
                  <Link to={`/learn/${m.id}?step=quiz`}>
                    <span className="lessonNum">{s.quizPassed ? <HiCheckCircle aria-label="Passed" /> : "?"}</span>
                    <span className="lessonTitle">Module quiz</span>
                    <span className="lessonMin num">
                      {s.quizBest !== null ? `Best ${s.quizBest}%` : `${m.quiz.length} questions`}
                    </span>
                  </Link>
                </li>
              </ol>
            </section>
          );
        })}
      </div>
    </>
  );
}
export default MyModules;
