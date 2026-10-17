import { useCallback, useEffect, useState } from "react";
import { apiFetch, apiPost } from "../config/api";
import { MODULES, PASS_PERCENT } from "../data/modules";

const EMPTY = { lessons: { savings: [], budgeting: [], finlit: [] }, quizzes: {} };

/** Loads the learner's progress and exposes helpers to update it. */
export function useProgress() {
  const [progress, setProgress] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("api/progress.php");
      if (!res.success) throw new Error(res.message);
      setProgress({ lessons: { ...EMPTY.lessons, ...res.lessons }, quizzes: res.quizzes || {} });
    } catch (err) {
      setError(err.message || "Your progress didn't load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setLesson = useCallback(async (module, lesson, completed = true) => {
    // Update the screen straight away, then confirm with the server
    setProgress((p) => {
      const done = new Set(p.lessons[module] || []);
      completed ? done.add(lesson) : done.delete(lesson);
      return { ...p, lessons: { ...p.lessons, [module]: [...done] } };
    });
    try {
      const res = await apiPost("api/progress.php", { module, lesson, completed });
      if (res.success) setProgress({ lessons: { ...EMPTY.lessons, ...res.lessons }, quizzes: res.quizzes || {} });
    } catch {
      /* keep the optimistic update; it will resync on next load */
    }
  }, []);

  const saveQuiz = useCallback(
    async (module, score, total) => {
      const res = await apiPost("api/quiz_attempt.php", { module, score, total });
      await load();
      return res;
    },
    [load]
  );

  return { progress, loading, error, reload: load, setLesson, saveQuiz };
}

/** Derived numbers for one module. */
export function moduleStats(module, progress) {
  const done = new Set(progress.lessons[module.id] || []);
  const completed = module.lessons.filter((l) => done.has(l.id)).length;
  const quiz = progress.quizzes[module.id];
  const nextLesson = module.lessons.find((l) => !done.has(l.id)) || null;
  return {
    done,
    completed,
    total: module.lessons.length,
    percent: Math.round((completed / module.lessons.length) * 100),
    quizPassed: Boolean(quiz && quiz.best_percent >= PASS_PERCENT),
    quizBest: quiz ? quiz.best_percent : null,
    nextLesson,
    finished: completed === module.lessons.length && Boolean(quiz && quiz.best_percent >= PASS_PERCENT),
  };
}

/** The next thing the learner should do, across all modules. */
export function nextStep(progress) {
  for (const m of MODULES) {
    const s = moduleStats(m, progress);
    if (s.nextLesson) return { module: m, lesson: s.nextLesson, type: "lesson" };
    if (!s.quizPassed) return { module: m, type: "quiz" };
  }
  return null;
}
