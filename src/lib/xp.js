import { MODULES } from "../data/modules";
import { moduleStats } from "../hooks/useProgress";

/** Points for learning. Worked out from progress, so nothing extra is stored. */
export const XP = { lesson: 10, quiz: 50, perfect: 25 };

export function xpFrom(progress) {
  let xp = 0;
  for (const m of MODULES) {
    const s = moduleStats(m, progress);
    xp += s.completed * XP.lesson;
    if (s.quizPassed) xp += XP.quiz;
    if (s.quizBest === 100) xp += XP.perfect;
  }
  return xp;
}

/** Levels every 150 XP: returns the level, its name and progress to the next. */
const NAMES = ["Starter", "Learner", "Saver", "Planner", "Money smart", "Mentor"];
export function levelFrom(xp) {
  const level = Math.floor(xp / 150) + 1;
  return {
    level,
    name: NAMES[Math.min(level - 1, NAMES.length - 1)],
    into: xp % 150,
    need: 150,
  };
}

/** Consecutive days with learning, counting back from today (or yesterday). */
export function streakFrom(days = []) {
  if (!days.length) return 0;
  const set = new Set(days);
  const d = new Date();
  const key = (x) => x.toISOString().slice(0, 10);
  if (!set.has(key(d))) d.setUTCDate(d.getUTCDate() - 1); // yesterday still counts
  let n = 0;
  while (set.has(key(d))) {
    n++;
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return n;
}
