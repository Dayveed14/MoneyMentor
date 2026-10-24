import investingImg from "../assets/images/invst.jpg";
import planningImg from "../assets/images/finplan.jpg";
import debtImg from "../assets/images/DnC.jpg";

/*
 * Debt & credit, Investing basics and Financial planning.
 * Lesson ids must match LEARNING_MODULES in the API (src/modules.php).
 */

export const DEBT = {
  id: "debt",
  title: "Debt & credit",
  page: "/module/debt",
  image: debtImg,
  blurb: "Borrow only when it helps you, know the true cost of a loan, and get out of debt with a plan.",
  quote: "“Debt is a tool. Learn to use it before it uses you.”",
  overview:
    "Loans can help you start a business, pay school fees or handle an emergency. They can also trap you for years. This module shows you how to tell good debt from bad, work out what a loan really costs, deal safely with loan apps, protect your credit history and pay off what you owe.",
  topics: ["True cost of a loan", "Loan apps and the FCCPC", "Paying debt off"],
  lessons: [
    {
      id: "good-vs-bad-debt",
      title: "Good debt and bad debt",
      minutes: 3,
      body: [
        "Not all debt is the same. Good debt helps you earn more or own something that keeps its value: a loan for equipment that grows your business, or a course that raises your income. Bad debt pays for things that are gone quickly, like parties, clothes or a new phone you didn't need.",
        "A simple test before borrowing: will this loan help me make or save more than it costs me? If the answer is no, wait and save instead.",
        "Even good debt becomes bad debt if the repayments are more than you can afford. Keep total monthly repayments below about a third of your take-home pay.",
      ],
      takeaways: [
        "Good debt helps you earn or keeps its value",
        "Ask: will this make me more than it costs?",
        "Keep repayments under a third of your pay",
      ],
    },
    {
      id: "true-cost",
      title: "The true cost of a loan",
      minutes: 4,
      body: [
        "The monthly payment is not the cost of a loan. The cost is everything you pay back minus what you borrowed: interest plus fees such as management, insurance or processing charges.",
        "Watch the period the rate is quoted for. 5% a month sounds small, but it is about 60% a year. Many short-term loans quote daily or weekly rates to make them look cheap. Borrow ₦100,000 at 10% a month for three months and you could pay back ₦130,000 or more.",
        "Before you sign, ask for the total amount you will repay, every fee, and what happens if you pay late. A lender that won't put this in writing is a lender to avoid.",
      ],
      takeaways: [
        "Cost = total repaid minus amount borrowed",
        "Turn monthly or daily rates into a yearly rate",
        "Get the total repayment and all fees in writing",
      ],
    },
    {
      id: "loan-apps",
      title: "Loan apps: stay safe",
      minutes: 4,
      body: [
        "Digital lenders in Nigeria must be approved by the Federal Competition and Consumer Protection Commission (FCCPC). Before installing a loan app, check that both the company and the app name are on the FCCPC's published list of approved digital lenders.",
        "Be careful with permissions. An app that wants access to your contacts, photos or call logs can use them to shame you if you repay late. Calling your friends, sending insulting messages or posting your picture is not a legal way to collect a debt, and you can report it to the FCCPC.",
        "Never pay an \"upfront fee\" to receive a loan. A real lender takes its charges from the loan or the repayment, never before you've received anything.",
      ],
      takeaways: [
        "Check the FCCPC approved list first",
        "Refuse access to contacts and photos",
        "Never pay a fee to receive a loan",
      ],
    },
    {
      id: "credit-history",
      title: "Your credit history",
      minutes: 3,
      body: [
        "Every loan linked to your BVN can be reported to Nigeria's licensed credit bureaus. Banks and lenders check these reports before lending to you, and sometimes so do landlords and employers.",
        "Paying on time builds a good history. Missed payments, even on a small loan app, can show up and make it harder to borrow later when it really matters, such as for a mortgage or a business loan.",
        "You can ask the credit bureaus for a copy of your own report. Check it for loans you don't recognise. They can be a sign that someone used your details.",
      ],
      takeaways: [
        "Loans linked to your BVN can be reported",
        "Late payments follow you",
        "Check your own credit report for surprises",
      ],
    },
    {
      id: "pay-it-off",
      title: "A plan to pay it off",
      minutes: 4,
      body: [
        "List every debt: who you owe, how much, the interest rate and the monthly payment. Seeing it all in one place is the first step to controlling it.",
        "Then pick a method. The avalanche method pays extra on the debt with the highest interest rate first, which saves the most money. The snowball method pays off the smallest debt first, which gives quick wins that keep you going. Both work if you stick with them.",
        "Keep paying the minimum on everything else, and don't take a new loan to pay an old one unless the new one is clearly cheaper. If you can't keep up, talk to the lender early. Many will agree a new plan before things get worse.",
      ],
      takeaways: [
        "List every debt in one place",
        "Avalanche saves most; snowball keeps you motivated",
        "Talk to lenders early if you're struggling",
      ],
    },
    {
      id: "before-you-borrow",
      title: "Before you borrow or guarantee",
      minutes: 3,
      body: [
        "Ask three questions before any loan: Do I really need this now? Can I afford the repayments if my income drops? Is there a cheaper option, such as a cooperative, a salary advance or waiting a few months?",
        "Be careful about standing as a guarantor. If the borrower doesn't pay, you are legally responsible for the debt. Only guarantee an amount you could afford to pay yourself.",
        "\"Buy now, pay later\" is still borrowing. Small instalments across several shops add up quickly. Count them in your budget like any other loan.",
      ],
      takeaways: [
        "Need it? Afford it? Cheaper option?",
        "A guarantor owes the debt if the borrower doesn't pay",
        "Buy now, pay later is a loan",
      ],
    },
  ],
  quiz: [
    {
      q: "Which loan is most likely to be \"good debt\"?",
      options: ["A loan for a birthday party", "A loan for equipment that grows your business", "A loan to buy the latest phone", "A loan to lend to a friend"],
      answer: 1,
      why: "Good debt helps you earn more than it costs. Party and phone loans pay for things that are gone quickly.",
    },
    {
      q: "A loan app charges 5% a month. Roughly what is that a year?",
      options: ["5%", "15%", "About 60%", "It depends on the app's adverts"],
      answer: 2,
      why: "5% × 12 months is about 60% a year, before any fees.",
    },
    {
      q: "A lender asks you to pay a ₦5,000 \"processing fee\" before it sends your loan. You should…",
      options: ["Pay it, it's normal", "Refuse. Real lenders never charge before you receive the loan", "Pay half now", "Pay with a friend's account"],
      answer: 1,
      why: "Upfront fees are a common loan scam.",
    },
    {
      q: "A loan app is calling your contacts to shame you about a late payment. This is…",
      options: ["Normal debt collection", "Not allowed, and you can report it to the FCCPC", "Your fault for being late", "Only a problem if you owe a lot"],
      answer: 1,
      why: "Shaming and harassing borrowers or their contacts is not a lawful way to collect a debt.",
    },
    {
      q: "Which method pays off the highest-interest debt first?",
      options: ["Snowball", "Avalanche", "Minimum-only", "Borrowing more"],
      answer: 1,
      why: "The avalanche method targets the most expensive debt first and saves the most interest.",
    },
  ],
};

export const INVESTING = {
  id: "investing",
  title: "Investing basics",
  page: "/module/investing",
  image: investingImg,
  blurb: "Make your money grow faster than prices rise, without falling for schemes that promise the impossible.",
  quote: "“Saving protects your money. Investing helps it grow.”",
  overview:
    "When prices rise faster than your savings, your money loses value even while it sits in the bank. This module explains why people invest, how risk and return work, the main options open to Nigerians, why spreading your money matters, and how to spot a Ponzi scheme before it takes your money.",
  topics: ["Inflation and real returns", "Treasury bills, funds and shares", "Spotting Ponzi schemes"],
  lessons: [
    {
      id: "why-invest",
      title: "Why invest at all",
      minutes: 3,
      body: [
        "Inflation is the rise in prices over time. If prices rise 20% in a year and your savings earn 5%, your money buys less at the end of the year than at the start.",
        "Investing means putting money into something that is expected to grow: lending to the government, owning part of a company, or owning property. The aim is a return higher than inflation.",
        "Investing comes after the basics. Build an emergency fund and clear expensive debt first. There is no point earning 15% on an investment while paying 60% on a loan.",
      ],
      takeaways: [
        "Inflation quietly shrinks idle money",
        "Investing aims to beat inflation",
        "Emergency fund and expensive debt come first",
      ],
    },
    {
      id: "risk-return",
      title: "Risk and return",
      minutes: 3,
      body: [
        "Higher possible returns come with higher risk. A government Treasury bill pays a modest, predictable return. Shares in a company can grow a lot, or fall, depending on how the company does.",
        "Time matters. Money you need next month should be somewhere safe and easy to reach. Money you won't need for five years or more can take more risk, because there is time to recover from bad years.",
        "Anyone who promises high returns with no risk is either mistaken or lying. Risk and return always travel together.",
      ],
      takeaways: [
        "More possible return = more risk",
        "Short-term money stays safe; long-term money can take risk",
        "\"High return, no risk\" doesn't exist",
      ],
    },
    {
      id: "options",
      title: "Where Nigerians can invest",
      minutes: 5,
      body: [
        "Treasury bills and FGN savings bonds are loans to the Federal Government. They are among the lowest-risk options and you can buy them through your bank or a licensed stockbroker. FGN savings bonds are designed for small investors.",
        "Money market and other mutual funds pool money from many people and are run by licensed fund managers. They let you start with small amounts and spread your risk. Shares listed on the Nigerian Exchange (NGX) give you part-ownership of companies and can pay dividends.",
        "Whatever you choose, use licensed institutions only, ask for every fee, and make sure the investment is registered with the Securities and Exchange Commission (SEC) Nigeria where it should be.",
      ],
      takeaways: [
        "Treasury bills and FGN bonds: low risk",
        "Mutual funds: small amounts, spread risk",
        "Use licensed, SEC-registered providers only",
      ],
    },
    {
      id: "diversify",
      title: "Don't put all your eggs in one basket",
      minutes: 3,
      body: [
        "Diversifying means spreading your money across different investments, so one bad result doesn't wipe you out. A mix might include a money market fund, some government securities and, for long-term money, shares.",
        "Don't put everything in one company, one property or one friend's business, however promising it sounds.",
        "Review your mix once or twice a year. As your goals get closer, move more money into safer options.",
      ],
      takeaways: [
        "Spread money across different investments",
        "Never bet everything on one thing",
        "Get safer as your goal gets closer",
      ],
    },
    {
      id: "ponzi",
      title: "Spotting a Ponzi scheme",
      minutes: 4,
      body: [
        "A Ponzi scheme pays early members with money from new members, not from real profits. It looks like it works until new money slows down, and then it collapses and most people lose everything. MMM in 2016 was one well-known example in Nigeria, and many \"crypto trading\" and \"investment club\" platforms have collapsed the same way since.",
        "Warning signs: guaranteed returns, especially more than a few percent a month; rewards for recruiting friends; pressure to invest before a deadline; vague explanations of how the money is made; and withdrawals that become \"delayed\".",
        "If early friends got paid, that proves nothing. That is exactly how these schemes spread.",
      ],
      takeaways: [
        "Guaranteed high returns = red flag",
        "Recruiting bonuses = red flag",
        "Friends being paid early proves nothing",
      ],
    },
    {
      id: "check-before",
      title: "Check before you invest",
      minutes: 3,
      body: [
        "Before you hand over any money, find out who is running the investment and whether they are licensed. SEC Nigeria regulates investment schemes and publishes warnings about unregistered ones.",
        "Ask for documents, read them, and ask someone you trust who understands investing. A real opportunity will still be there after you have checked. A scam will push you to hurry.",
        "Only invest money you can afford to leave alone, and never borrow to invest in something you don't fully understand.",
      ],
      takeaways: [
        "Check the provider with SEC Nigeria",
        "Real opportunities can wait for you to check",
        "Never borrow to invest",
      ],
    },
  ],
  quiz: [
    {
      q: "Prices rise 20% this year and your savings earn 5%. What happens to your money's buying power?",
      options: ["It grows", "It falls", "It stays the same", "It doubles"],
      answer: 1,
      why: "Your money grew 5% but prices grew 20%, so it buys less.",
    },
    {
      q: "Which is generally the lowest-risk option?",
      options: ["A new crypto token", "Federal Government Treasury bills", "A friend's new business", "An investment club promising 30% a month"],
      answer: 1,
      why: "Government securities are among the lowest-risk investments.",
    },
    {
      q: "What should come before investing?",
      options: ["A new car", "An emergency fund and clearing expensive debt", "Borrowing to invest more", "Nothing, invest first"],
      answer: 1,
      why: "Investing makes sense once you're protected from surprises and not paying high interest.",
    },
    {
      q: "Which is a strong sign of a Ponzi scheme?",
      options: ["Returns that change with the market", "Rewards for bringing in new members", "Being regulated by SEC Nigeria", "Annual reports you can read"],
      answer: 1,
      why: "Ponzi schemes need new money, so they pay people to recruit.",
    },
    {
      q: "Why diversify?",
      options: ["To guarantee profit", "So one bad investment doesn't wipe you out", "To pay more fees", "Because it's the law"],
      answer: 1,
      why: "Spreading money lowers the damage any single investment can do.",
    },
  ],
};

export const PLANNING = {
  id: "planning",
  title: "Financial planning",
  page: "/module/planning",
  image: planningImg,
  blurb: "Set goals for now, soon and later, protect what you have, and plan for retirement and family.",
  quote: "“A goal without a plan is just a wish.”",
  overview:
    "Financial planning ties everything together: knowing where you stand, setting goals for the short, medium and long term, protecting yourself with insurance, planning for retirement and supporting family without sinking your own future. This module helps you build a simple plan and keep it up to date.",
  topics: ["Goals and net worth", "Insurance and pension", "Planning with family"],
  lessons: [
    {
      id: "money-goals",
      title: "Goals for now, soon and later",
      minutes: 3,
      body: [
        "Split your goals by time. Short-term goals are within a year: an emergency fund, rent. Medium-term goals are one to five years away: a business, a car, a wedding. Long-term goals are five years or more: a house, your children's education, retirement.",
        "Each goal needs an amount and a date. \"Save ₦600,000 for rent by next December\" becomes ₦50,000 a month, a number you can plan around.",
        "Match where you keep the money to the timeline: short-term goals in safe, easy-to-reach savings, long-term goals in investments that can grow.",
      ],
      takeaways: [
        "Sort goals into short, medium and long term",
        "Give every goal an amount and a date",
        "Match where the money sits to when you need it",
      ],
    },
    {
      id: "net-worth",
      title: "Know where you stand",
      minutes: 3,
      body: [
        "Your net worth is everything you own minus everything you owe. Add up savings, investments, the value of property and business equipment, then subtract loans and money you owe people.",
        "Don't worry if the number is small or negative. It's a starting point, not a judgement. What matters is that it rises over time.",
        "Work it out once a year. Watching it grow is one of the best motivators there is.",
      ],
      takeaways: [
        "Net worth = what you own − what you owe",
        "It's a starting point, not a grade",
        "Check it every year",
      ],
    },
    {
      id: "insurance",
      title: "Protect what you have",
      minutes: 4,
      body: [
        "One accident, illness or fire can wipe out years of saving. Insurance lets you pay a small, known amount to avoid a large, unknown loss.",
        "Start with health cover. Many employers provide an HMO plan, and there are individual and community plans too. Then think about life cover if people depend on your income, and cover for your shop, goods or vehicle if you run a business.",
        "Buy only from licensed insurers, read what is and isn't covered, and keep your policy documents where your family can find them.",
      ],
      takeaways: [
        "Insurance swaps a big unknown loss for a small known cost",
        "Health cover first, then life and business cover",
        "Licensed insurers only; read the exclusions",
      ],
    },
    {
      id: "pension",
      title: "Plan for retirement",
      minutes: 4,
      body: [
        "Under Nigeria's Contributory Pension Scheme, employees in the scheme have part of their salary paid into a Retirement Savings Account (RSA) with a Pension Fund Administrator (PFA), and their employer contributes too. Check your payslip and your PFA statement to make sure the money is actually arriving.",
        "Self-employed and informal workers can open an RSA through the micro pension plan and contribute what they can, when they can.",
        "Retirement feels far away, but starting early matters more than starting big, because your contributions have longer to grow.",
      ],
      takeaways: [
        "Check your PFA statement regularly",
        "Self-employed? Look at micro pension",
        "Start early, even with small amounts",
      ],
    },
    {
      id: "family",
      title: "Planning with family",
      minutes: 4,
      body: [
        "Supporting parents, siblings and relatives is part of life for many Nigerians. Plan for it. Set a monthly amount for family support in your budget, so you can help without emptying your savings.",
        "Make sure your bank accounts, pension and insurance have an up-to-date next of kin or beneficiary. Tell someone you trust where your important documents are kept.",
        "A will makes sure what you own goes to the people you choose and can save your family a long and costly process. It's worth doing at any age once you own property or have dependants.",
      ],
      takeaways: [
        "Budget a fixed amount for family support",
        "Keep next of kin and beneficiaries up to date",
        "A will protects the people you love",
      ],
    },
    {
      id: "review",
      title: "Review and adjust",
      minutes: 3,
      body: [
        "A plan only works if you look at it. Once a year, or after a big change like a new job, marriage or a child, review your budget, goals, net worth, insurance and pension.",
        "Ask: Are my goals still right? Am I on track? What's changed? Adjust the amounts and dates rather than abandoning the plan.",
        "Small, steady progress beats a perfect plan you never follow.",
      ],
      takeaways: [
        "Review yearly and after big life changes",
        "Adjust; don't abandon",
        "Steady progress beats perfection",
      ],
    },
  ],
  quiz: [
    {
      q: "Which is a long-term goal?",
      options: ["Next month's rent", "An emergency fund this year", "Retirement", "Groceries"],
      answer: 2,
      why: "Long-term goals are five years or more away. Retirement is the biggest one.",
    },
    {
      q: "You own ₦2,000,000 in savings and equipment and owe ₦500,000. Your net worth is…",
      options: ["₦2,500,000", "₦1,500,000", "₦500,000", "₦2,000,000"],
      answer: 1,
      why: "Net worth = what you own minus what you owe: 2,000,000 − 500,000.",
    },
    {
      q: "What does insurance do?",
      options: ["Guarantees you make money", "Swaps a big unknown loss for a small known cost", "Replaces an emergency fund completely", "Only matters for rich people"],
      answer: 1,
      why: "You pay a small premium so one disaster doesn't wipe out your savings.",
    },
    {
      q: "Where do contributions under the Contributory Pension Scheme go?",
      options: ["Your current account", "A Retirement Savings Account with a PFA", "Your employer's account", "The tax office"],
      answer: 1,
      why: "Contributions go into your own Retirement Savings Account, managed by a Pension Fund Administrator.",
    },
    {
      q: "How often should you review your financial plan?",
      options: ["Never, once is enough", "At least once a year and after big life changes", "Every day", "Only when you're in trouble"],
      answer: 1,
      why: "A yearly review, plus one after big changes, keeps your plan realistic.",
    },
  ],
};
