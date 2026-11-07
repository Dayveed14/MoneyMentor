import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { HiCheckCircle, HiArrowLeft, HiArrowRight, HiCheck, HiX, HiStar, HiFire } from "react-icons/hi";
import { moduleById, MODULES, PASS_PERCENT } from "../data/modules";
import { useProgress, moduleStats } from "../hooks/useProgress";
import { apiFetch } from "../config/api";
import { useCountUp, buzz, prefersReducedMotion } from "../motion/hooks";
import Confetti from "../motion/Confetti";
import Reveal from "../motion/Reveal";
import { LESSON_WIDGETS } from "../widgets";
import { XP } from "../lib/xp";
import NotFound from "./NotFound";
import "./Learn.css";

const STAR_LEVELS = [80, 90, 100];

/** Circular score that counts up. */
function ScoreRing({ pct, passed }) {
  const v = useCountUp(pct, { duration: 1200 });
  const r = 54;
  const c = 2 * Math.PI * r;
  return (
    <div className={`scoreRing ${passed ? "pass" : "fail"}`}>
      <svg viewBox="0 0 128 128" aria-hidden="true">
        <circle cx="64" cy="64" r={r} className="srTrack" />
        <circle cx="64" cy="64" r={r} className="srFill" strokeDasharray={c} strokeDashoffset={c * (1 - v / 100)} transform="rotate(-90 64 64)" />
      </svg>
      <strong className="num">{Math.round(v)}%</strong>
    </div>
  );
}

function Quiz({ module, onSave, best }) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState(null);
  const [answers, setAnswers] = useState([]); // true/false per question
  const [streak, setStreak] = useState(0);
  const [result, setResult] = useState(null);
  const [saveError, setSaveError] = useState("");
  const total = module.quiz.length;
  const item = module.quiz[step];
  const score = answers.filter(Boolean).length;

  const choose = (i) => {
    if (picked !== null || result) return;
    const right = i === item.answer;
    setPicked(i);
    setAnswers((a) => [...a, right]);
    setStreak((n) => (right ? n + 1 : 0));
    buzz(right ? 12 : [25, 50, 25]);
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
    setAnswers([]);
    setStreak(0);
    setResult(null);
    setSaveError("");
  };

  // Keyboard: 1-4 to answer, Enter for next
  useEffect(() => {
    const onKey = (e) => {
      if (result || e.target.closest?.("input, textarea, select")) return;
      const n = Number(e.key);
      if (picked === null && n >= 1 && n <= item.options.length) choose(n - 1);
      else if (picked !== null && e.key === "Enter") {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (result) {
    const nextModule = MODULES[MODULES.findIndex((m) => m.id === module.id) + 1];
    const stars = STAR_LEVELS.filter((l) => result.pct >= l).length;
    const missed = module.quiz.map((q, i) => ({ ...q, i })).filter((q) => !answers[q.i]);
    return (
      <div className="quizResult" aria-live="polite">
        {result.passed && <Confetti />}
        <ScoreRing pct={result.pct} passed={result.passed} />
        {result.passed && (
          <div className="stars" aria-label={`${stars} of 3 stars`}>
            {[0, 1, 2].map((i) => <HiStar key={i} className={i < stars ? "on" : ""} style={{ animationDelay: `${0.9 + i * 0.25}s` }} aria-hidden="true" />)}
          </div>
        )}
        <h2>{result.passed ? (result.pct === 100 ? "Perfect score!" : "You passed this module") : "Not quite there yet"}</h2>
        <p>
          You got {result.score} of {total} right.{" "}
          {result.passed
            ? "Nicely done. Your progress is saved."
            : `You need ${PASS_PERCENT}% to pass. Have a look at what you missed, then try again.`}
        </p>
        {result.passed && <p className="xpGain">+{XP.quiz} XP</p>}
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
        {missed.length > 0 && (
          <div className="quizReview">
            <h3>{result.passed ? "The ones you missed" : "Review before you retry"}</h3>
            <ol className="stagger">
              {missed.map((q) => (
                <li key={q.i}>
                  <strong>{q.q}</strong>
                  <span><HiCheck aria-hidden="true" /> {q.options[q.answer]}</span>
                  <p>{q.why}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    );
  }

  const right = picked !== null && picked === item.answer;
  return (
    <div className="quizBox">
      <div className="quizMeta num">
        <span>Question {step + 1} of {total}</span>
        {streak >= 2 && <span key={streak} className="streakChip"><HiFire aria-hidden="true" /> {streak} in a row</span>}
        {best !== null && <span>Your best: {best}%</span>}
      </div>
      <div className="quizDots" aria-hidden="true">
        {module.quiz.map((_, i) => (
          <span key={i} className={i < answers.length ? (answers[i] ? "right" : "wrong") : i === step ? "current" : ""} />
        ))}
      </div>
      <div key={step} className="quizCard">
        <h2>{item.q}</h2>
        <div className={`quizOptions stagger ${picked !== null && !right ? "missed" : ""}`}>
          {item.options.map((opt, i) => {
            const state = picked === null ? "" : i === item.answer ? "right" : i === picked ? "wrong" : "dim";
            return (
              <button key={opt} type="button" className={`quizOpt ${state}`} onClick={() => choose(i)} disabled={picked !== null}>
                <span className="optKey num" aria-hidden="true">{i + 1}</span>
                <span>{opt}</span>
                {state === "right" && <HiCheck className="optIcon" aria-label="Correct" />}
                {state === "wrong" && <HiX className="optIcon" aria-label="Incorrect" />}
                {state === "right" && i === picked && <span className="floatScore">+1</span>}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className={`quizWhy ${right ? "good" : "bad"}`}>
            <p><strong>{right ? PRAISE[step % PRAISE.length] : "Not quite."}</strong> {item.why}</p>
            <button type="button" className="btn btn-solid" onClick={next} autoFocus>
              {step < total - 1 ? "Next question" : "See my result"} <HiArrowRight aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      <p className="quizKeys muted small">Tip: press 1–{item.options.length} to answer and Enter to continue.</p>
    </div>
  );
}

const PRAISE = ["Correct!", "Spot on.", "Exactly right.", "Nice one.", "You got it."];

/** Short celebration when a lesson is completed. */
function LessonDone({ last }) {
  return (
    <div className="lessonDone" role="status">
      <div className="ldCard">
      <svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24" /><path d="M15 27l7 7 15-16" /></svg>
      <strong>Lesson complete</strong>
      <span className="xpGain">+{XP.lesson} XP</span>
      <span className="small">{last ? "On to the quiz…" : "Next lesson…"}</span>
      </div>
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
  const [videos, setVideos] = useState({});
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [moduleId, lessonIndex, isQuiz]);

  // Optional YouTube videos that admins attach to lessons
  useEffect(() => {
    if (!module) return;
    let live = true;
    apiFetch(`api/get_lesson_videos.php?module=${module.id}`)
      .then((r) => live && r.success && setVideos(r.data || {}))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [module]);

  if (!module) return <NotFound />;

  const go = (q) => setParams(q);
  const isDone = stats.done.has(lesson.id);
  const isLast = lessonIndex === module.lessons.length - 1;

  const target = isLast ? { step: "quiz" } : { lesson: module.lessons[lessonIndex + 1].id };
  const completeAndContinue = () => {
    if (celebrating) return;
    if (isDone) return go(target);
    setLesson(module.id, lesson.id, true);
    buzz(15);
    if (prefersReducedMotion()) return go(target);
    setCelebrating(true);
    setTimeout(() => {
      setCelebrating(false);
      go(target);
    }, 1100);
  };
  const Widget = LESSON_WIDGETS[`${module.id}/${lesson.id}`];

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
                  <span className="lNum num">{stats.done.has(l.id) ? <HiCheckCircle className="popIn" aria-label="Done" /> : i + 1}</span>
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
              {videos[lesson.id] && (
                <div className="lessonVideo">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${videos[lesson.id]}?rel=0`}
                    title={`Video: ${lesson.title}`}
                    loading="lazy"
                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              <div className="lessonBody stagger">
                {lesson.body.map((p, i) => <p key={i}>{p}</p>)}
              </div>
              {Widget && <Widget />}
              <Reveal className="takeaways">
                <h3>Key takeaways</h3>
                <ul>
                  {lesson.takeaways.map((t, i) => (
                    <li key={t} style={{ "--d": `${200 + i * 160}ms` }}><HiCheck aria-hidden="true" /> {t}</li>
                  ))}
                </ul>
              </Reveal>

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
                  <button type="button" className="btn btn-solid" onClick={completeAndContinue} disabled={celebrating}>
                    {isDone ? (isLast ? "Go to the quiz" : "Next lesson") : isLast ? "Complete and take the quiz" : "Complete and continue"}
                    <HiArrowRight aria-hidden="true" />
                  </button>
                </div>
              </div>
              {celebrating && <LessonDone last={isLast} />}
            </article>
          )}
        </main>
      </div>
    </div>
  );
}
export default Learn;
