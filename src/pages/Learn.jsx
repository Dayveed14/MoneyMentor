import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { HiCheckCircle, HiArrowLeft, HiArrowRight, HiCheck, HiX } from "react-icons/hi";
import { moduleById, MODULES, PASS_PERCENT } from "../data/modules";
import { useProgress, moduleStats } from "../hooks/useProgress";
import NotFound from "./NotFound";
import "./Learn.css";

function Quiz({ module, onSave, best }) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(null);
  const [saveError, setSaveError] = useState("");
  const total = module.quiz.length;
  const item = module.quiz[step];

  const choose = (i) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === item.answer) setScore((s) => s + 1);
  };

  const next = async () => {
    if (step < total - 1) {
      setStep((s) => s + 1);
      setPicked(null);
      return;
    }
    const pct = Math.round((score / total) * 100);
    setResult({ score, pct, passed: pct >= PASS_PERCENT });
    try {
      await onSave(score, total);
    } catch {
      setSaveError("Your score couldn't be saved. Check your connection and try again.");
    }
  };

  const restart = () => {
    setStep(0);
    setPicked(null);
    setScore(0);
    setResult(null);
    setSaveError("");
  };

  if (result) {
    const nextModule = MODULES[MODULES.findIndex((m) => m.id === module.id) + 1];
    return (
      <div className="quizResult" aria-live="polite">
        <p className={`quizScore num ${result.passed ? "pass" : "fail"}`}>{result.pct}%</p>
        <h2>{result.passed ? "You passed this module" : "Not quite there yet"}</h2>
        <p>
          You got {result.score} of {total} right.{" "}
          {result.passed
            ? "Nicely done. Your progress is saved."
            : `You need ${PASS_PERCENT}% to pass. Review the lessons and try again.`}
        </p>
        {saveError && <p className="formErr">{saveError}</p>}
        <div className="quizActions">
          {result.passed ? (
            nextModule ? (
              <Link to={`/learn/${nextModule.id}`} className="btn btn-solid">Start {nextModule.title}</Link>
            ) : (
              <Link to="/account" className="btn btn-solid">Back to my dashboard</Link>
            )
          ) : (
            <button type="button" className="btn btn-solid" onClick={restart}>Try the quiz again</button>
          )}
          <Link to="/account/modules" className="btn btn-ghost">All modules</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="quizBox">
      <div className="quizMeta num">
        <span>Question {step + 1} of {total}</span>
        {best !== null && <span>Your best: {best}%</span>}
      </div>
      <div className="quizTrack" aria-hidden="true">
        <span style={{ width: `${((step + (picked !== null ? 1 : 0)) / total) * 100}%` }} />
      </div>
      <h2>{item.q}</h2>
      <div className="quizOptions">
        {item.options.map((opt, i) => {
          const state = picked === null ? "" : i === item.answer ? "right" : i === picked ? "wrong" : "dim";
          return (
            <button key={opt} type="button" className={`quizOpt ${state}`} onClick={() => choose(i)} disabled={picked !== null}>
              <span>{opt}</span>
              {state === "right" && <HiCheck aria-label="Correct" />}
              {state === "wrong" && <HiX aria-label="Incorrect" />}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="quizWhy">
          <p>{item.why}</p>
          <button type="button" className="btn btn-solid" onClick={next}>
            {step < total - 1 ? "Next question" : "See my result"}
          </button>
        </div>
      )}
    </div>
  );
}

function Learn() {
  const { moduleId } = useParams();
  const [params, setParams] = useSearchParams();
  const module = moduleById(moduleId);
  const { progress, setLesson, saveQuiz } = useProgress();

  const stats = module ? moduleStats(module, progress) : null;
  const isQuiz = params.get("step") === "quiz";
  const lessonIndex = module ? Math.max(0, module.lessons.findIndex((l) => l.id === params.get("lesson"))) : 0;
  const lesson = module?.lessons[lessonIndex];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [moduleId, lessonIndex, isQuiz]);

  if (!module) return <NotFound />;

  const go = (q) => setParams(q);
  const isDone = stats.done.has(lesson.id);
  const isLast = lessonIndex === module.lessons.length - 1;

  const completeAndContinue = () => {
    if (!isDone) setLesson(module.id, lesson.id, true);
    go(isLast ? { step: "quiz" } : { lesson: module.lessons[lessonIndex + 1].id });
  };

  return (
    <div className="learn">
      <div className="wrap learnGrid">
        <aside className="learnSide">
          <Link to="/account/modules" className="learnBack"><HiArrowLeft aria-hidden="true" /> My modules</Link>
          <h1>{module.title}</h1>
          <div className="bar"><span style={{ width: `${stats.percent}%` }} /></div>
          <p className="muted num">{stats.completed} of {stats.total} lessons done</p>
          <ol className="learnLessons">
            {module.lessons.map((l, i) => (
              <li key={l.id}>
                <button type="button"
                  className={`${!isQuiz && i === lessonIndex ? "current" : ""} ${stats.done.has(l.id) ? "done" : ""}`}
                  aria-current={!isQuiz && i === lessonIndex ? "step" : undefined}
                  onClick={() => go({ lesson: l.id })}>
                  <span className="lNum num">{stats.done.has(l.id) ? <HiCheckCircle aria-label="Done" /> : i + 1}</span>
                  {l.title}
                </button>
              </li>
            ))}
            <li>
              <button type="button" className={`${isQuiz ? "current" : ""} ${stats.quizPassed ? "done" : ""}`}
                aria-current={isQuiz ? "step" : undefined} onClick={() => go({ step: "quiz" })}>
                <span className="lNum">{stats.quizPassed ? <HiCheckCircle aria-label="Passed" /> : "?"}</span>
                Module quiz
              </button>
            </li>
          </ol>
          <Link to={module.page} className="learnOverview">About this module</Link>
        </aside>

        <main className="learnMain">
          {isQuiz ? (
            <>
              <p className="learnEyebrow">Module quiz</p>
              {stats.completed < stats.total && (
                <p className="quizHint">
                  Tip: you&apos;ve finished {stats.completed} of {stats.total} lessons. The quiz covers all of them.
                </p>
              )}
              <Quiz key={module.id} module={module} best={stats.quizBest} onSave={(s, t) => saveQuiz(module.id, s, t)} />
            </>
          ) : (
            <article key={lesson.id} className="lesson">
              <p className="learnEyebrow num">
                Lesson {lessonIndex + 1} of {module.lessons.length}, {lesson.minutes} min read
              </p>
              <h2>{lesson.title}</h2>
              {lesson.body.map((p, i) => <p key={i}>{p}</p>)}
              <div className="takeaways">
                <h3>Key takeaways</h3>
                <ul>
                  {lesson.takeaways.map((t) => <li key={t}><HiCheck aria-hidden="true" /> {t}</li>)}
                </ul>
              </div>

              <div className="lessonNav">
                <button type="button" className="btn btn-ghost" disabled={lessonIndex === 0}
                  onClick={() => go({ lesson: module.lessons[lessonIndex - 1].id })}>
                  <HiArrowLeft aria-hidden="true" /> Previous
                </button>
                <div className="lessonNavRight">
                  {isDone && (
                    <button type="button" className="linkBtn" onClick={() => setLesson(module.id, lesson.id, false)}>
                      Mark as not done
                    </button>
                  )}
                  <button type="button" className="btn btn-solid" onClick={completeAndContinue}>
                    {isDone ? (isLast ? "Go to the quiz" : "Next lesson") : isLast ? "Complete and take the quiz" : "Complete and continue"}
                    <HiArrowRight aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          )}
        </main>
      </div>
    </div>
  );
}
export default Learn;
