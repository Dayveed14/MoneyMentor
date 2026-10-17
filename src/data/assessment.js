/*
 * The knowledge check shown to new learners. Two questions per topic; each
 * question points at the lesson that teaches it, so wrong answers become
 * "key lessons" on the learner's path.
 */

export const TOPICS = {
  security: { label: "Scams & fraud", modules: ["finlit"], articles: ["Financial Planning"] },
  saving: { label: "Saving", modules: ["savings"], articles: ["Savings"] },
  budgeting: { label: "Budgeting", modules: ["budgeting"], articles: ["Budgeting"] },
  credit: { label: "Debt & credit", modules: ["finlit", "budgeting"], articles: ["Debt Management", "Credit Cards"] },
  investing: { label: "Investing", modules: ["savings", "finlit"], articles: ["Investing", "Retirement"] },
};

export const GOALS = [
  { id: "security", label: "Avoid scams and fraud" },
  { id: "saving", label: "Build my savings" },
  { id: "budgeting", label: "Control my spending" },
  { id: "credit", label: "Understand loans and debt" },
  { id: "investing", label: "Start investing" },
];

export const QUESTIONS = [
  {
    topic: "security",
    q: "Someone calls saying they're from your bank and asks for the OTP just sent to your phone. What do you do?",
    options: ["Give it so they can fix my account", "Hang up and call the number on my card", "Give only the first three digits", "Ask them to email me instead"],
    answer: 1,
    why: "Your bank will never ask for your OTP. Anyone who does is trying to get into your account.",
    lesson: { module: "finlit", lesson: "otp-fraud" },
  },
  {
    topic: "security",
    q: "You get an SMS: \"Your account will be blocked today. Click this link to verify your BVN.\" What's the safest move?",
    options: ["Tap the link quickly before the deadline", "Reply with my BVN", "Ignore the link and check through my bank's official app or number", "Forward it to friends to ask"],
    answer: 2,
    why: "Threats plus a link are classic phishing. Go to your bank's app or call the official number yourself.",
    lesson: { module: "finlit", lesson: "phishing" },
  },
  {
    topic: "saving",
    q: "What is an emergency fund for?",
    options: ["Holidays and treats", "Unexpected costs like medical bills or losing your job", "Buying shares", "Everyday shopping"],
    answer: 1,
    why: "An emergency fund stops surprises from turning into debt.",
    lesson: { module: "savings", lesson: "emergency-fund" },
  },
  {
    topic: "saving",
    q: "Which way of saving usually works best?",
    options: ["Saving whatever is left at the end of the month", "Moving a set amount to savings as soon as I'm paid", "Keeping cash at home", "Only saving when I get a bonus"],
    answer: 1,
    why: "Paying yourself first means saving happens every month, not just when money is left over.",
    lesson: { module: "savings", lesson: "pay-yourself-first" },
  },
  {
    topic: "budgeting",
    q: "Under the 50/30/20 rule, what share of your take-home pay goes to needs?",
    options: ["20%", "30%", "50%", "70%"],
    answer: 2,
    why: "50% for needs, 30% for wants and 20% for savings and debt repayment.",
    lesson: { module: "budgeting", lesson: "rule-50-30-20" },
  },
  {
    topic: "budgeting",
    q: "If you regularly spend more than you earn, the gap is usually filled by…",
    options: ["Savings that keep growing", "Debt", "Interest from the bank", "Nothing, it balances out"],
    answer: 1,
    why: "Spending more than you earn has to be paid for somehow, usually with borrowing.",
    lesson: { module: "budgeting", lesson: "what-is-a-budget" },
  },
  {
    topic: "credit",
    q: "When comparing two loans, what matters most?",
    options: ["Only the monthly payment", "The total cost, including interest and fees", "How fast it's approved", "Which lender has better adverts"],
    answer: 1,
    why: "A low monthly payment can hide a much higher total cost.",
    lesson: { module: "finlit", lesson: "foundations" },
  },
  {
    topic: "credit",
    q: "What usually happens if you only pay the minimum on a high-interest debt?",
    options: ["The debt disappears quickly", "You pay much more in interest over time", "The bank cancels the interest", "Nothing changes"],
    answer: 1,
    why: "Interest keeps building on what's left, so minimum payments make debt last much longer.",
    lesson: { module: "budgeting", lesson: "realistic-goals" },
  },
  {
    topic: "investing",
    q: "An investment promises to double your money in 30 days, guaranteed. It's most likely…",
    options: ["A great opportunity", "A scam", "Normal for the stock market", "A government bond"],
    answer: 1,
    why: "Real investments never guarantee big, fast returns. This is how Ponzi schemes recruit people.",
    lesson: { module: "finlit", lesson: "scam-mail" },
  },
  {
    topic: "investing",
    q: "Why do people spread their money across different investments?",
    options: ["To lower their risk", "To pay more fees", "To guarantee returns", "Because the law requires it"],
    answer: 0,
    why: "If one investment does badly, the others can cushion the loss.",
    lesson: { module: "savings", lesson: "set-goals" },
  },
];

export function levelFor(score, total) {
  const pct = score / total;
  return pct >= 0.8 ? "Confident" : pct >= 0.5 ? "Developing" : "Beginner";
}

export const LEVEL_TEXT = {
  Beginner: "You're at the start of your money journey. Your path begins with the basics that protect you most.",
  Developing: "You know some of the basics. Your path focuses on the gaps the check found.",
  Confident: "You know your stuff. Your path is a quick refresher plus deeper reading.",
};

/**
 * Turns answers + goals into a personal path:
 *  - each topic's need = questions missed + 1 if it's a goal
 *  - modules are ordered by the total need of the topics they teach
 *  - lessons for missed questions become key lessons
 */
export function buildResult(answers, goals) {
  const topicScores = Object.fromEntries(Object.keys(TOPICS).map((t) => [t, 0]));
  const keyLessons = [];
  let score = 0;

  QUESTIONS.forEach((q, i) => {
    if (answers[i] === q.answer) {
      score++;
      topicScores[q.topic]++;
    } else if (!keyLessons.some((k) => k.lesson === q.lesson.lesson)) {
      keyLessons.push(q.lesson);
    }
  });

  const need = Object.fromEntries(
    Object.keys(TOPICS).map((t) => [t, 2 - topicScores[t] + (goals.includes(t) ? 1 : 0)])
  );

  const modulePriority = { savings: 0, budgeting: 0, finlit: 0 };
  Object.entries(TOPICS).forEach(([t, info]) => info.modules.forEach((m) => (modulePriority[m] += need[t])));
  // Scams first when tied — protecting people is the platform's first job
  const tieOrder = ["finlit", "savings", "budgeting"];
  const modules = Object.keys(modulePriority).sort(
    (a, b) => modulePriority[b] - modulePriority[a] || tieOrder.indexOf(a) - tieOrder.indexOf(b)
  );

  const weakTopics = Object.keys(TOPICS).filter((t) => need[t] >= 2).sort((a, b) => need[b] - need[a]);
  const articleCategories = [...new Set(weakTopics.flatMap((t) => TOPICS[t].articles))].slice(0, 4);

  // Missing a scam question is too risky to call anyone "Confident"
  let level = levelFor(score, QUESTIONS.length);
  if (level === "Confident" && topicScores.security < 2) level = "Developing";

  return {
    score,
    total: QUESTIONS.length,
    level,
    topic_scores: topicScores,
    goals,
    path: { modules, key_lessons: keyLessons, article_categories: articleCategories, priority: modulePriority },
  };
}
