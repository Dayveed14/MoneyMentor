import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiCheck, HiLockClosed } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import { useProgress, moduleStats, nextStep } from "../../hooks/useProgress";
import { MODULES, TOTAL_LESSONS } from "../../data/modules";
import { achievements } from "../../lib/achievements";
import { apiFetch } from "../../config/api";
import { money, learnLink } from "../../lib/format";
import WelcomeBanner from "../../components/WelcomeBanner";
import ProgressRing from "./ProgressRing";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

function Overview() {
  const { user } = useAuth();
  const { progress, loading, error, reload } = useProgress();
  const [budget, setBudget] = useState(null);
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    apiFetch("api/budget.php").then((r) => r.success && setBudget(r.budget)).catch(() => {});
    apiFetch("api/saved_articles.php").then((r) => r.success && setSaved(r.data)).catch(() => {});
  }, []);

  const lessonsDone = MODULES.reduce((n, m) => n + moduleStats(m, progress).completed, 0);
  const step = nextStep(progress);
  const badges = achievements(progress, { hasBudget: Boolean(budget), savedCount: saved.length });
  const earned = badges.filter((b) => b.earned).length;

  const planned = budget ? budget.items.reduce((n, i) => n + Number(i.amount), 0) : 0;

  return (
    <>
      <WelcomeBanner />
      <header className="accHead">
        <div>
          <h1>{greeting()}, {user?.name?.split(" ")[0]}</h1>
          <p>Pick up where you left off, or try something new.</p>
        </div>
      </header>

      {error && (
        <div className="accError" role="alert">
          {error} <button type="button" onClick={reload}>Try again</button>
        </div>
      )}

      <section className="continueCard" aria-busy={loading}>
        <ProgressRing value={lessonsDone} total={TOTAL_LESSONS} label="lessons done" />
        <div className="continueText">
          {step ? (
            <>
              <p className="continueEyebrow">{lessonsDone === 0 ? "Start here" : "Up next"}</p>
              <h2>{step.type === "quiz" ? `${step.module.title} quiz` : step.lesson.title}</h2>
              <p>
                {step.type === "quiz"
                  ? "You've finished the lessons. Pass the quiz to complete the module."
                  : `${step.module.title}, ${step.lesson.minutes} min read`}
              </p>
              <Link to={learnLink(step)} className="btn btn-solid">
                {lessonsDone === 0 ? "Start your first lesson" : step.type === "quiz" ? "Take the quiz" : "Continue learning"}
              </Link>
            </>
          ) : (
            <>
              <p className="continueEyebrow">All done</p>
              <h2>You&apos;ve completed every module</h2>
              <p>Brilliant work. Keep your skills fresh with new articles.</p>
              <Link to="/articles" className="btn btn-solid">Read the latest articles</Link>
            </>
          )}
        </div>
      </section>

      <div className="accGrid">
        <section className="accPanel">
          <div className="panelHead">
            <h2>Your modules</h2>
            <Link to="/account/modules">See all lessons</Link>
          </div>
          <div className="modRows">
            {MODULES.map((m) => {
              const s = moduleStats(m, progress);
              return (
                <div className="modRow" key={m.id}>
                  <img src={m.image} alt="" />
                  <div className="modRowInfo">
                    <h3>{m.title}</h3>
                    <div className="bar" aria-label={`${s.percent}% complete`}>
                      <span style={{ width: `${s.percent}%` }} />
                    </div>
                    <p>
                      {s.completed} of {s.total} lessons
                      {s.quizPassed ? ", quiz passed" : s.quizBest !== null ? `, best quiz score ${s.quizBest}%` : ""}
                    </p>
                  </div>
                  <Link
                    to={s.nextLesson ? `/learn/${m.id}?lesson=${s.nextLesson.id}` : s.quizPassed ? `/learn/${m.id}` : `/learn/${m.id}?step=quiz`}
                    className="btn btn-ghost btn-sm">
                    {s.finished ? "Review" : s.completed === 0 ? "Start" : s.nextLesson ? "Continue" : "Take quiz"}
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="accSide">
          <section className="accPanel">
            <div className="panelHead">
              <h2>Budget</h2>
              <Link to="/account/budget">{budget ? "Edit" : "Set up"}</Link>
            </div>
            {budget ? (
              <dl className="miniStats num">
                <div><dt>Monthly income</dt><dd>{money(budget.income)}</dd></div>
                <div><dt>Planned</dt><dd>{money(planned)}</dd></div>
                <div>
                  <dt>{budget.income - planned >= 0 ? "Left to assign" : "Over budget"}</dt>
                  <dd className={budget.income - planned >= 0 ? "pos" : "neg"}>{money(Math.abs(budget.income - planned))}</dd>
                </div>
              </dl>
            ) : (
              <p className="muted">Plan your month with the 50/30/20 rule. It takes about five minutes.</p>
            )}
          </section>

          <section className="accPanel">
            <div className="panelHead">
              <h2>Saved articles</h2>
              <Link to="/account/saved">{saved.length ? "See all" : "Browse"}</Link>
            </div>
            {saved.length ? (
              <ul className="savedMini">
                {saved.slice(0, 3).map((a) => (
                  <li key={a.id}><Link to={`/article/${a.id}`}>{a.title}</Link></li>
                ))}
              </ul>
            ) : (
              <p className="muted">Tap “Save” on any article to keep it here for later.</p>
            )}
          </section>
        </aside>
      </div>

      <section className="accPanel">
        <div className="panelHead">
          <h2>Badges</h2>
          <span className="muted num">{earned} of {badges.length} earned</span>
        </div>
        <ul className="badges">
          {badges.map((b) => (
            <li key={b.id} className={b.earned ? "badge on" : "badge"}>
              <span className="badgeIcon" aria-hidden="true">{b.earned ? <HiCheck /> : <HiLockClosed />}</span>
              <strong>{b.title}</strong>
              <span>{b.text}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
export default Overview;
