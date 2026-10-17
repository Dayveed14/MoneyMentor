import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiCheck, HiX, HiArrowRight } from "react-icons/hi";
import { QUESTIONS, GOALS, TOPICS, LEVEL_TEXT, buildResult } from "../../data/assessment";
import { moduleById } from "../../data/modules";
import { apiPost } from "../../config/api";
import { getUser, updateStoredUser } from "../../utils/auth";
import WelcomeBanner from "../../components/WelcomeBanner";
import "../Learn.css"; // shares the quiz option styles

const lessonTitle = (k) => moduleById(k.module)?.lessons.find((l) => l.id === k.lesson)?.title;

function Assessment() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [stage, setStage] = useState("intro"); // intro → goals → questions → result
  const [goals, setGoals] = useState([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggleGoal = (id) => setGoals((g) => (g.includes(id) ? g.filter((x) => x !== id) : [...g, id]));

  const answer = (i) => {
    const next = [...answers];
    next[step] = i;
    setAnswers(next);
  };

  const finish = async () => {
    const r = buildResult(answers, goals);
    setResult(r);
    setStage("result");
    setSaving(true);
    setError("");
    try {
      const res = await apiPost("api/assessment.php", r);
      if (!res.success) throw new Error(res.message);
      const user = getUser();
      if (user) updateStoredUser({ ...user, assessed: true });
    } catch (err) {
      setError(err.message || "Your result couldn't be saved. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  const skip = () => navigate("/account", { replace: true });

  if (stage === "intro") {
    return (
      <>
        <WelcomeBanner />
        <section className="accPanel checkIntroPanel">
          <p className="continueEyebrow checkEyebrow">Two-minute knowledge check</p>
          <h1>Let&apos;s find the right starting point for you</h1>
          <p>
            Answer {QUESTIONS.length} quick questions about scams, saving, budgeting, credit and investing.
            There&apos;s no pass or fail. We use your answers to build a learning path around what you
            need most.
          </p>
          <ul className="checkFacts">
            <li><HiCheck aria-hidden="true" /> About two minutes</li>
            <li><HiCheck aria-hidden="true" /> Only you see your answers</li>
            <li><HiCheck aria-hidden="true" /> Retake it any time from your dashboard</li>
          </ul>
          <div className="checkActions">
            <button type="button" className="btn btn-solid" onClick={() => setStage("goals")}>
              Start the check <HiArrowRight aria-hidden="true" />
            </button>
            {state?.welcome && (
              <button type="button" className="linkBtn" onClick={skip}>Skip for now</button>
            )}
          </div>
        </section>
      </>
    );
  }

  if (stage === "goals") {
    return (
      <section className="accPanel checkPanel">
        <p className="checkStep num">Step 1 of 2</p>
        <h1>What would you like help with?</h1>
        <p className="muted">Pick as many as you like.</p>
        <div className="goalGrid" role="group" aria-label="Your goals">
          {GOALS.map((g) => (
            <button key={g.id} type="button" className={goals.includes(g.id) ? "goal on" : "goal"}
              aria-pressed={goals.includes(g.id)} onClick={() => toggleGoal(g.id)}>
              <span className="goalTick" aria-hidden="true">{goals.includes(g.id) && <HiCheck />}</span>
              {g.label}
            </button>
          ))}
        </div>
        <div className="checkActions">
          <button type="button" className="btn btn-solid" onClick={() => setStage("questions")}>
            {goals.length ? "Continue" : "Continue without choosing"} <HiArrowRight aria-hidden="true" />
          </button>
        </div>
      </section>
    );
  }

  if (stage === "questions") {
    const q = QUESTIONS[step];
    const picked = answers[step];
    const last = step === QUESTIONS.length - 1;
    return (
      <section className="accPanel checkPanel">
        <div className="quizMeta num">
          <span>Step 2 of 2: question {step + 1} of {QUESTIONS.length}</span>
          <span>{TOPICS[q.topic].label}</span>
        </div>
        <div className="quizTrack" aria-hidden="true">
          <span style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
        </div>
        <h2 className="checkQ">{q.q}</h2>
        <div className="quizOptions" role="radiogroup" aria-label="Answers">
          {q.options.map((opt, i) => (
            <button key={opt} type="button" role="radio" aria-checked={picked === i}
              className={`quizOpt ${picked === i ? "chosen" : ""}`} onClick={() => answer(i)}>
              <span>{opt}</span>
            </button>
          ))}
        </div>
        <div className="checkActions spread">
          <button type="button" className="btn btn-ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            Back
          </button>
          <button type="button" className="btn btn-solid" disabled={picked === undefined}
            onClick={() => (last ? finish() : setStep((s) => s + 1))}>
            {last ? "See my learning path" : "Next"} <HiArrowRight aria-hidden="true" />
          </button>
        </div>
      </section>
    );
  }

  // Result
  const { level, score, total, path } = result;
  const first = moduleById(path.modules[0]);
  const firstKey = path.key_lessons.find((k) => k.module === first.id);
  return (
    <div className="checkResultWrap">
      <section className="continueCard resultHero">
        <div className={`levelBadge level-${level.toLowerCase()}`}>
          <span className="num">{score}/{total}</span>
          <strong>{level}</strong>
        </div>
        <div className="continueText">
          <p className="continueEyebrow">Your learning path is ready</p>
          <h2>Start with {first.title}</h2>
          <p>{LEVEL_TEXT[level]}</p>
          {error && <p className="formErr">{error} <button type="button" className="linkBtn" onClick={finish}>Try again</button></p>}
          <Link to={firstKey ? `/learn/${first.id}?lesson=${firstKey.lesson}` : `/learn/${first.id}`}
            className={`btn btn-solid ${saving ? "isDisabled" : ""}`}>
            Start my path
          </Link>
        </div>
      </section>

      <div className="accGrid">
        <section className="accPanel">
          <div className="panelHead"><h2>Your path, in order</h2></div>
          <ol className="pathList">
            {path.modules.map((id, i) => {
              const m = moduleById(id);
              const tag = i === 0 ? "Start here" : path.priority[id] >= 2 ? "Recommended" : "Refresher";
              return (
                <li key={id}>
                  <span className="pathNum num">{i + 1}</span>
                  <img src={m.image} alt="" />
                  <div>
                    <strong>{m.title}</strong>
                    <span className={`pathTag tag-${tag.split(" ")[0].toLowerCase()}`}>{tag}</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <aside className="accSide">
          <section className="accPanel">
            <div className="panelHead"><h2>Key lessons for you</h2></div>
            {path.key_lessons.length ? (
              <ul className="keyLessons">
                {path.key_lessons.slice(0, 5).map((k) => (
                  <li key={k.lesson}>
                    <Link to={`/learn/${k.module}?lesson=${k.lesson}`}>{lessonTitle(k)}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">You answered everything correctly. Pick any module for a refresher.</p>
            )}
          </section>
          {path.article_categories.length > 0 && (
            <section className="accPanel">
              <div className="panelHead"><h2>Suggested reading</h2></div>
              <div className="chipRowWrap">
                {path.article_categories.map((c) => (
                  <Link key={c} className="chip" to={`/articles?category=${encodeURIComponent(c)}`}>{c}</Link>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>

      <section className="accPanel">
        <div className="panelHead"><h2>Your answers</h2></div>
        <ol className="answerReview">
          {QUESTIONS.map((q, i) => {
            const right = answers[i] === q.answer;
            return (
              <li key={i} className={right ? "right" : "wrong"}>
                <span className="answerIcon" aria-label={right ? "Correct" : "Incorrect"}>{right ? <HiCheck /> : <HiX />}</span>
                <div>
                  <strong>{q.q}</strong>
                  {!right && <p>Answer: {q.options[q.answer]}. {q.why}</p>}
                </div>
              </li>
            );
          })}
        </ol>
        <div className="checkActions">
          <Link to="/account" className="btn btn-ghost">Go to my dashboard</Link>
        </div>
      </section>
    </div>
  );
}
export default Assessment;
