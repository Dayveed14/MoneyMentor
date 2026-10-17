import { CURRENCY } from "../components/SavingsGrowth";

export const money = (n) => `${CURRENCY}${Math.round(Number(n) || 0).toLocaleString()}`;

/** Link to the learner's next step (a lesson or a module quiz). */
export function learnLink(step) {
  if (!step) return "/account/modules";
  return step.type === "quiz" ? `/learn/${step.module.id}?step=quiz` : `/learn/${step.module.id}?lesson=${step.lesson.id}`;
}
