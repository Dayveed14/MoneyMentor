import { MODULES, TOTAL_LESSONS } from "../data/modules";
import { moduleStats } from "../hooks/useProgress";

/** Badges are worked out from progress — nothing extra to store. */
export function achievements(progress, extras = {}) {
  const stats = MODULES.map((m) => ({ m, s: moduleStats(m, progress) }));
  const lessonsDone = stats.reduce((n, { s }) => n + s.completed, 0);
  const quizzes = Object.values(progress.quizzes || {});

  return [
    { id: "first-step", title: "First step", text: "Finish your first lesson", earned: lessonsDone >= 1 },
    ...stats.map(({ m, s }) => ({
      id: `done-${m.id}`,
      title: `${m.title} complete`,
      text: "Finish every lesson and pass the quiz",
      earned: s.finished,
    })),
    { id: "quiz-ace", title: "Quiz ace", text: "Score 100% on any module quiz", earned: quizzes.some((q) => q.best_percent === 100) },
    { id: "planner", title: "Planner", text: "Save your first budget", earned: Boolean(extras.hasBudget) },
    { id: "reader", title: "Curious reader", text: "Save an article to read later", earned: Boolean(extras.savedCount) },
    { id: "graduate", title: "MoneyMentor graduate", text: `Complete all ${TOTAL_LESSONS} lessons and every quiz`, earned: stats.every(({ s }) => s.finished) },
  ];
}
