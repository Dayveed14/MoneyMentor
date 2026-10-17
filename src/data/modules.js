import savingsImg from "../assets/images/savings.webp";
import budgetingImg from "../assets/images/budgeting.webp";
import finlitImg from "../assets/images/finlit.webp";

/*
 * Course content. Lesson ids must match LEARNING_MODULES in the API
 * (src/modules.php) — progress is only saved for ids listed there.
 * Each lesson: paragraphs (body) + takeaways (short bullet list).
 */

export const PASS_PERCENT = 80;

export const MODULES = [
  {
    id: "savings",
    title: "Saving strategy",
    page: "/savings",
    image: savingsImg,
    blurb: "Create a saving plan that adapts to your life goals and financial circumstances.",
    lessons: [
      {
        id: "why-save",
        title: "Why saving matters",
        minutes: 3,
        body: [
          "Saving is how you turn today's income into tomorrow's choices. Without savings, every surprise — a hospital bill, a broken phone, a late salary — becomes debt or stress.",
          "It can feel hard when money is tight, especially if you're living payday to payday. But the habit matters more than the amount. Small, regular savings grow, and they build the confidence to plan bigger.",
          "Savings also give you options: to take a course, start a side business, or leave a bad job without panic.",
        ],
        takeaways: [
          "Savings protect you from surprises",
          "The habit matters more than the amount",
          "Money saved is freedom to choose later",
        ],
      },
      {
        id: "set-goals",
        title: "Set clear savings goals",
        minutes: 3,
        body: [
          "What are you saving for? A rent deposit, a car, school fees, retirement? A goal gives your savings a job, and a job makes it easier to say no to impulse spending.",
          "Make each goal specific: how much, and by when. \"Save more\" is a wish. \"Save 300,000 for a rent deposit by December\" is a plan you can divide into monthly amounts.",
          "Keep different goals in different pots or accounts, so money for next year's rent isn't quietly spent on this weekend.",
        ],
        takeaways: [
          "Name the goal, the amount and the deadline",
          "Divide the total by the months you have",
          "Separate pots for separate goals",
        ],
      },
      {
        id: "emergency-fund",
        title: "Build an emergency fund",
        minutes: 4,
        body: [
          "An emergency fund is money kept aside only for real emergencies: job loss, medical costs, urgent repairs. It's the first savings goal for almost everyone.",
          "Aim for three to six months of essential expenses — rent, food, transport, bills. That sounds like a lot, so start with a first milestone of one month.",
          "Keep it somewhere easy to reach but not too easy to spend: a separate savings account, not your everyday account or your wallet.",
        ],
        takeaways: [
          "Start with one month of essentials",
          "Grow it to three to six months",
          "Keep it separate from everyday money",
        ],
      },
      {
        id: "pay-yourself-first",
        title: "Pay yourself first and automate",
        minutes: 3,
        body: [
          "Most people save whatever is left at the end of the month — which is often nothing. Paying yourself first flips that: the moment you're paid, set your savings aside before any other spending.",
          "The easiest way is automation. Set up a recurring transfer from your main account to your savings account on payday, so you save without having to think about it.",
          "Treat that transfer like a bill you can't skip. Then budget with what remains.",
        ],
        takeaways: [
          "Save first, spend what's left",
          "Automate a transfer on payday",
          "Treat savings like a fixed bill",
        ],
      },
      {
        id: "cut-costs",
        title: "Cut costs and earn extra",
        minutes: 4,
        body: [
          "Look closely at your spending and find leaks: subscriptions you don't use, frequent takeaway, data plans bigger than you need, or expensive brands where a cheaper one works just as well.",
          "Every amount you cut can go straight to your savings goal. Moving even a small saving each week adds up over a year.",
          "The other side is earning more: a side hustle, freelance work, or selling things you no longer use. Put extra income towards your goals before it blends into everyday spending.",
        ],
        takeaways: [
          "Hunt for small, regular leaks",
          "Send what you cut straight to savings",
          "Put side income to work immediately",
        ],
      },
      {
        id: "stay-on-track",
        title: "Start small and stay motivated",
        minutes: 3,
        body: [
          "Don't be afraid to start small. Saving $10 a week is $520 a year — and once the habit sticks, you can increase it.",
          "There will be months when you're tempted to dip into savings. Remind yourself what the goal is for, and if you do slip, restart the next payday rather than giving up.",
          "Celebrate milestones. Hitting your first month of emergency savings is worth marking — it keeps you motivated for the next one.",
        ],
        takeaways: [
          "Small amounts become big ones",
          "Slipped? Restart next payday",
          "Celebrate each milestone",
        ],
      },
    ],
    quiz: [
      {
        q: "What should be most people's first savings goal?",
        options: ["A new phone", "An emergency fund", "Stocks and shares", "A holiday"],
        answer: 1,
        why: "An emergency fund stops surprises from turning into debt, so it comes first.",
      },
      {
        q: "How big should a full emergency fund be?",
        options: ["One week of income", "Three to six months of essential expenses", "Exactly one year's salary", "Whatever is left each month"],
        answer: 1,
        why: "Three to six months of essentials covers most job losses and emergencies.",
      },
      {
        q: "What does \"pay yourself first\" mean?",
        options: ["Spend on yourself before bills", "Move money to savings as soon as you're paid", "Ask for a raise", "Pay off loans before anything else"],
        answer: 1,
        why: "Saving before spending means savings happen every month, not only when money is left over.",
      },
      {
        q: "Which goal is the most useful?",
        options: ["Save more this year", "Save something when I can", "Save 300,000 for a rent deposit by December", "Never spend on takeaway"],
        answer: 2,
        why: "A specific amount and deadline can be split into monthly targets.",
      },
      {
        q: "You slipped and used some savings this month. What's best?",
        options: ["Give up on saving", "Restart on your next payday", "Borrow to refill it", "Stop tracking your money"],
        answer: 1,
        why: "Consistency over time beats a perfect streak. Just restart.",
      },
    ],
  },
  {
    id: "budgeting",
    title: "Budgeting & expense tracking",
    page: "/budget",
    image: budgetingImg,
    blurb: "Unlock the power of smart money management and see where every payday goes.",
    lessons: [
      {
        id: "what-is-a-budget",
        title: "What a budget really is",
        minutes: 3,
        body: [
          "A budget is a plan for your money before you spend it. It isn't a punishment or a list of things you can't have — it's you deciding where your money goes instead of wondering where it went.",
          "At its simplest, a budget has two parts: what comes in (income) and what goes out (expenses, savings and debt payments).",
          "If what goes out is bigger than what comes in, the gap is filled by debt. A budget shows you that gap early, while you can still fix it.",
        ],
        takeaways: [
          "A budget is a plan, not a punishment",
          "Income in, expenses and savings out",
          "It reveals gaps before they become debt",
        ],
      },
      {
        id: "rule-50-30-20",
        title: "The 50/30/20 rule",
        minutes: 4,
        body: [
          "The 50/30/20 rule is a simple starting point. Split your take-home pay into three parts: 50% for needs, 30% for wants and 20% for savings and debt repayment.",
          "Needs are bills you can't skip: rent, food, transport, utilities, minimum loan payments. Wants make life enjoyable: eating out, entertainment, new clothes. Savings include your emergency fund, goals and extra debt payments.",
          "If your needs are above 50%, don't panic — in many cities rent alone can be more. Use the rule as a direction and shift a few percent at a time.",
        ],
        takeaways: [
          "50% needs, 30% wants, 20% savings",
          "It's a starting point, not a test",
          "Adjust gradually towards it",
        ],
      },
      {
        id: "track-spending",
        title: "Track where your money goes",
        minutes: 4,
        body: [
          "You can't improve what you don't measure. For one month, record every expense — in a notebook, a spreadsheet, or the Budget planner in your MoneyMentor dashboard.",
          "Group spending into categories like food, transport, data, rent and fun. Most people are surprised by at least one category.",
          "At the end of the month, compare what you planned with what actually happened. The difference tells you exactly where to adjust.",
        ],
        takeaways: [
          "Track every expense for a month",
          "Group spending into categories",
          "Compare plan with reality, then adjust",
        ],
      },
      {
        id: "needs-vs-wants",
        title: "Needs versus wants",
        minutes: 3,
        body: [
          "A need keeps you safe, healthy and able to work. A want makes life nicer. Transport to work is a need; a ride-hail instead of the bus is often a want.",
          "Wants aren't bad — a budget with no fun usually fails. The point is to choose them on purpose, within the amount you planned.",
          "When something feels urgent, wait 48 hours before buying. If you still want it at full price, and it fits your wants budget, enjoy it.",
        ],
        takeaways: [
          "Needs keep you safe; wants make life nicer",
          "Plan for wants so the budget lasts",
          "Use a 48-hour pause for big buys",
        ],
      },
      {
        id: "realistic-goals",
        title: "Set realistic money goals",
        minutes: 3,
        body: [
          "Big changes overnight rarely last. Pick one or two goals at a time, such as cutting takeaway in half or saving 10% of income.",
          "Write your goals down and check them at the end of each month. Small, consistent wins build a budget you'll actually keep.",
          "As income grows, raise your savings rate before your spending catches up. That's how people get ahead over time.",
        ],
        takeaways: [
          "One or two goals at a time",
          "Review monthly",
          "Raise savings before spending when income grows",
        ],
      },
    ],
    quiz: [
      {
        q: "Using 50/30/20, how much of a $1,000 payday goes to savings?",
        options: ["$100", "$200", "$300", "$500"],
        answer: 1,
        why: "20% goes to savings and debt repayment.",
      },
      {
        q: "Which of these is a need?",
        options: ["Streaming subscription", "Rent", "Eating out", "New sneakers"],
        answer: 1,
        why: "Rent keeps a roof over your head — you can't skip it.",
      },
      {
        q: "What's the main point of tracking expenses for a month?",
        options: ["To feel guilty", "To compare your plan with what actually happened", "To impress your bank", "It isn't useful"],
        answer: 1,
        why: "The gap between plan and reality shows you where to adjust.",
      },
      {
        q: "Your needs take 60% of your income. What should you do?",
        options: ["Give up on budgeting", "Treat 50/30/20 as a direction and adjust gradually", "Stop all saving", "Borrow to cover wants"],
        answer: 1,
        why: "The rule is a starting point; shift a few percent at a time.",
      },
      {
        q: "A good way to avoid impulse purchases is to…",
        options: ["Buy immediately before prices rise", "Wait 48 hours before buying", "Use a credit card", "Hide your receipts"],
        answer: 1,
        why: "A short pause separates real wants from passing urges.",
      },
    ],
  },
  {
    id: "finlit",
    title: "Financial literacy 101",
    page: "/finlit",
    image: finlitImg,
    blurb: "Gain the confidence to navigate money conversations, and to spot fraud early.",
    lessons: [
      {
        id: "foundations",
        title: "Interest, credit and loans",
        minutes: 4,
        body: [
          "Interest is the price of money. When you save, the bank pays you interest; when you borrow, you pay it. Compound interest means interest is earned on interest — it makes savings grow faster and debt grow faster too.",
          "Your credit history is how lenders judge whether you repay. Paying on time, borrowing only what you can afford and not maxing out credit all help.",
          "Before taking any loan, compare the total cost — interest plus fees — not just the monthly payment.",
        ],
        takeaways: [
          "Interest works for savers and against borrowers",
          "Repaying on time builds your credit history",
          "Compare the total cost of a loan",
        ],
      },
      {
        id: "spam",
        title: "Handling spam",
        minutes: 3,
        body: [
          "Spam emails and messages promise enticing offers or make urgent requests, luring people into traps.",
          "Be cautious with any unsolicited message. Don't click links or share personal information without verifying the source.",
          "Mark suspicious emails as spam and keep your email security settings up to date.",
        ],
        takeaways: [
          "Treat unsolicited offers with suspicion",
          "Don't click links you didn't expect",
          "Report and block spam",
        ],
      },
      {
        id: "scam-mail",
        title: "Scam mail",
        minutes: 3,
        body: [
          "Scam mail is fraudulent letters or notices that promise unrealistic rewards or demand urgent action in exchange for money.",
          "Be sceptical of unexpected correspondence, especially anything demanding payment.",
          "Contact your bank directly, using details you already trust, to confirm any request before acting.",
        ],
        takeaways: [
          "Unexpected rewards are a red flag",
          "Never pay because a letter says so",
          "Verify through official contacts",
        ],
      },
      {
        id: "phishing",
        title: "Phishing",
        minutes: 3,
        body: [
          "Phishing is when fraudsters pretend to be a trusted organisation, such as your bank, to trick you into revealing sensitive information.",
          "Always verify the sender. Check email addresses, domain names and phone numbers carefully — scammers use look-alikes.",
          "Avoid sharing personal or financial details through links you weren't expecting. Go to the official app or website yourself instead.",
        ],
        takeaways: [
          "Check the sender and the link",
          "Look-alike addresses are common",
          "Go to the official app yourself",
        ],
      },
      {
        id: "otp-fraud",
        title: "OTP fraud",
        minutes: 3,
        body: [
          "One-time password (OTP) fraud is when criminals trick you into sharing an OTP, usually through fake calls or messages, then use it to get into your account.",
          "Never share an OTP with anyone — by call, message or email. Legitimate organisations will never ask for it.",
          "If you're unsure, hang up and contact your bank using the number on your card or its official app.",
        ],
        takeaways: [
          "Your OTP is only for you",
          "Banks never ask for it",
          "Hang up and call the official number",
        ],
      },
      {
        id: "card-fraud",
        title: "ATM card fraud",
        minutes: 3,
        body: [
          "ATM card fraud includes skimming and cloning — devices or tricks that copy your card details to access your account.",
          "Inspect ATMs for unusual attachments, cover the keypad while entering your PIN and check your account regularly for transactions you don't recognise.",
          "If your card is lost or stolen, report it to your bank immediately so it can be blocked.",
        ],
        takeaways: [
          "Check ATMs for odd devices",
          "Cover your PIN",
          "Report lost cards immediately",
        ],
      },
    ],
    quiz: [
      {
        q: "You put $100 in savings at 10% a year. After 5 years you have…",
        options: ["Exactly $150", "More than $150", "Less than $150", "Still $100"],
        answer: 1,
        why: "Compound interest earns interest on interest, giving about $161.",
      },
      {
        q: "Someone calls from 'your bank' and asks for the OTP you just received. You…",
        options: ["Read it out quickly", "Hang up and call the bank's official number", "Send it by text instead", "Ask them to call back later"],
        answer: 1,
        why: "Banks never ask for your OTP. Anyone who does is attempting fraud.",
      },
      {
        q: "Which is a common sign of phishing?",
        options: ["A message you expected", "A look-alike email address and an urgent link", "A letter from a friend", "Your bank app's normal login screen"],
        answer: 1,
        why: "Urgency plus look-alike addresses are classic phishing tricks.",
      },
      {
        q: "What helps your credit history most?",
        options: ["Maxing out credit cards", "Paying back on time", "Taking many loans at once", "Avoiding your statements"],
        answer: 1,
        why: "On-time repayment is the strongest signal to lenders.",
      },
      {
        q: "Your ATM card is stolen. The first thing to do is…",
        options: ["Wait a few days", "Report it to your bank so it's blocked", "Post about it online", "Change your email password"],
        answer: 1,
        why: "Blocking the card quickly stops anyone using it.",
      },
    ],
  },
];

export const moduleById = (id) => MODULES.find((m) => m.id === id);
export const TOTAL_LESSONS = MODULES.reduce((n, m) => n + m.lessons.length, 0);
