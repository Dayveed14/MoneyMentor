// Sample content used only when VITE_USE_MOCKS=true (UI work without the backend).
const img = (id) => `https://images.unsplash.com/${id}?w=1200&h=800&fit=crop`;

export const MOCK_ARTICLES = [
  {
    id: 1, title: "Investing for beginners: where your first $100 should go", category: "Investing",
    summary: "Before picking stocks, build the base: an emergency fund, cleared high-interest debt, and a simple index fund habit.",
    body: "Investing feels like something for people who already have money. It isn't. The habit matters far more than the first amount.\n\nStart with the base. Keep three months of essential expenses in an easy-access savings account. Pay off any debt that charges more than about 10% a year — no investment reliably beats that.\n\nThen automate. A small amount moved on payday into a broad, low-cost index fund beats waiting for the perfect moment. Markets go up and down; time in the market is what compounds.\n\nFinally, keep fees low and don't check daily. The less you tinker, the better most beginners do.",
    image_path: img("photo-1579621970563-ebec7560ff3e"), view_count: 2431, published_date: "2026-09-28 10:00:00",
  },
  {
    id: 2, title: "The 50/30/20 budget, explained with a real payslip", category: "Budgeting",
    summary: "Needs, wants and savings — how to split your income without tracking every single purchase.",
    body: "The 50/30/20 rule splits take-home pay into three buckets: 50% for needs, 30% for wants and 20% for savings and debt repayment.\n\nNeeds are the bills you can't skip: rent, transport, food, utilities. Wants are everything else that makes life enjoyable. Savings include your emergency fund, investments and extra debt payments.\n\nIf your needs are above 50%, don't panic. Treat the rule as a direction, not a test. Shift a few percent at a time until the numbers work for you.",
    image_path: img("photo-1554224154-26032ffc0d07"), view_count: 1840, published_date: "2026-09-20 09:00:00",
  },
  {
    id: 3, title: "Why we spend more when we feel rich: a look at behavioural finance", category: "Financial Planning",
    summary: "Mental accounting, anchoring and the payday effect — the quiet biases behind most money mistakes.",
    body: "Behavioural finance studies why people make money choices that don't match their own goals.\n\nMental accounting is treating money differently depending on where it came from — a bonus feels like 'free' money, so it gets spent faster.\n\nAnchoring is judging a price against the first number you saw, which is why 'was $200, now $120' works so well.\n\nKnowing the biases doesn't make you immune, but it gives you a pause button. Before a big purchase, wait 48 hours and ask whether you'd still buy it at full price.",
    image_path: img("photo-1559526324-4b87b5e36e44"), view_count: 1312, published_date: "2026-09-12 12:00:00",
  },
  {
    id: 4, title: "How to build an emergency fund on an irregular income", category: "Savings",
    summary: "Freelancer, trader or side-hustler? Use a baseline month and a buffer account to smooth the ups and downs.",
    body: "When income changes every month, budgeting from your average is risky. Budget from your lowest normal month instead.\n\nIn good months, everything above that baseline goes into a buffer account first. Pay yourself a steady 'salary' from the buffer.\n\nOnce the buffer covers three lean months, start splitting the extra between savings goals and investing.",
    image_path: img("photo-1621981386829-9b458a2cdbde"), view_count: 980, published_date: "2026-09-05 08:30:00",
  },
  {
    id: 5, title: "Good debt, bad debt and the interest rate that decides", category: "Debt Management",
    summary: "Not all borrowing is equal. Learn to compare what a loan costs against what it helps you earn.",
    body: "Debt is a tool. Whether it helps or hurts depends on the interest rate and what you use it for.\n\nBorrowing at a low rate for something that grows in value or raises your income can make sense. Borrowing at a high rate for things that lose value rarely does.\n\nList your debts from highest rate to lowest and pay extra on the top one while paying the minimum on the rest.",
    image_path: img("photo-1563013544-824ae1b704d3"), view_count: 760, published_date: "2026-08-29 14:00:00",
  },
  {
    id: 6, title: "Spotting a phishing message before it costs you", category: "Financial Planning",
    summary: "Urgency, odd links and requests for your OTP — the three signs a 'bank' message is a scam.",
    body: "Fraudsters rely on panic. Messages that say your account will be blocked 'within 24 hours' are designed to stop you thinking.\n\nCheck the sender and the link before you tap. Banks will never ask for your PIN or one-time password.\n\nWhen in doubt, close the message and call your bank using the number on the back of your card.",
    image_path: img("photo-1614064641938-3bbee52942c7"), view_count: 655, published_date: "2026-08-22 11:00:00",
  },
  {
    id: 7, title: "Retirement maths for people in their twenties", category: "Retirement",
    summary: "Why starting at 25 instead of 35 can double what you retire with — even with smaller contributions.",
    body: "Compound growth rewards time more than amount. Ten extra years of growth can matter more than doubling what you put in later.\n\nStart with whatever your workplace scheme matches, then increase your contribution by one percent each time you get a raise.",
    image_path: img("photo-1434626881859-194d67b2b86f"), view_count: 540, published_date: "2026-08-15 10:00:00",
  },
];
