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

/** Modules in the learner's personal order (from the knowledge check), else the default order. */
export function orderedModules(path) {
  const order = path?.modules || [];
  return [...MODULES].sort((a, b) => {
    const ia = order.indexOf(a.id), ib = order.indexOf(b.id);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
}

/**
 * The next thing the learner should do: follows their path, and inside each
 * module starts with the key lessons the knowledge check flagged.
 */
export function nextStep(progress, path) {
  const keys = path?.key_lessons || [];
  for (const m of orderedModules(path)) {
    const s = moduleStats(m, progress);
    const key = keys.find((k) => k.module === m.id && !s.done.has(k.lesson));
    if (key) return { module: m, lesson: m.lessons.find((l) => l.id === key.lesson), type: "lesson", key: true };
    if (s.nextLesson) return { module: m, lesson: s.nextLesson, type: "lesson" };
    if (!s.quizPassed) return { module: m, type: "quiz" };
  }
  return null;
}
