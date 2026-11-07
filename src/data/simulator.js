/*
 * Scam simulator scenarios. Each scenario is a small story:
 *   nodes[id] = { msgs: [{ from: "them" | "me" | "system", text }], choices: [...] }
 *   choice   = { label, reply?, goto?: nodeId, end?: "win" | "lose", lost?: amount, story }
 * Names and numbers are made up. Banks are never named on purpose.
 */

export const START_BALANCE = 254300;

export const SCENARIOS = [
  {
    id: "bank-call",
    title: "The \"bank\" call",
    teaser: "Someone from your bank's fraud desk says your account is under attack.",
    channel: "call",
    contact: "0700 225 5000",
    contactNote: "Says: Customer Care",
    flags: [
      "They called you, not the other way round",
      "Panic: \"your account is being emptied right now\"",
      "They asked for a code sent to your phone",
      "A real bank never needs your OTP to \"reverse\" anything",
    ],
    lesson: { module: "finlit", lesson: "otp-fraud" },
    nodes: {
      start: {
        msgs: [{ from: "system", text: "Incoming call from 0700 225 5000…" }],
        choices: [
          { label: "Answer the call", goto: "answered" },
          { label: "Ignore it. I'll call my bank myself if I'm worried", end: "win", story: "Unknown callers can't scam you if you don't engage. If you're worried, you call the number on your card." },
        ],
      },
      answered: {
        msgs: [
          { from: "them", text: "Good afternoon, this is Chinedu from your bank's fraud department. We've noticed three suspicious transfers leaving your account right now." },
          { from: "them", text: "To stop them, I'm sending a reversal code to your phone. Please read it back to me quickly before the money is gone." },
          { from: "system", text: "SMS: Your OTP is 482 913. Do not share this code with anyone." },
        ],
        choices: [
          { label: "Read him the code. He's trying to help", reply: "It's 482 913.", end: "lose", lost: START_BALANCE, story: "The \"reversal code\" was the OTP that approved a transfer of everything in your account. The caller was the thief." },
          { label: "Ask for his staff ID first", reply: "Can I have your staff ID number?", goto: "staffid" },
          { label: "Hang up and call the number on my card", reply: "I'll call my bank directly. Goodbye.", end: "win", story: "Perfect. Your bank would never ask for an OTP. Calling the number on your card is always safe." },
        ],
      },
      staffid: {
        msgs: [
          { from: "them", text: "Of course, it's FD-20417. Madam/sir, we don't have time, the money is leaving NOW. Read me the code or you lose everything." },
        ],
        choices: [
          { label: "OK, he gave an ID. Read the code", reply: "Fine, it's 482 913.", end: "lose", lost: START_BALANCE, story: "Scammers happily give fake names and IDs. An ID proves nothing. The OTP was all they needed." },
          { label: "Hang up. The pressure is a red flag", reply: "I'm hanging up and calling my bank.", end: "win", story: "Right call. Urgency plus a request for a code is the classic OTP scam." },
        ],
      },
    },
  },
  {
    id: "bvn-sms",
    title: "BVN update text",
    teaser: "A text says your account will be blocked unless you update your BVN today.",
    channel: "sms",
    contact: "BVN-UPDATE",
    flags: [
      "A threat to block your account",
      "A link to a website that isn't your bank's",
      "The page asked for your card PIN, which no website ever needs",
    ],
    lesson: { module: "finlit", lesson: "phishing" },
    nodes: {
      start: {
        msgs: [
          { from: "them", text: "Dear customer, your account has been restricted due to incomplete BVN details. Update within 24hrs to avoid permanent block: http://bvn-update-ng.info" },
        ],
        choices: [
          { label: "Tap the link", goto: "site" },
          { label: "Open my bank's own app to check", end: "win", story: "Your app showed no problem with your account. The text was fake. Checking through the official app beats any link." },
          { label: "Reply asking if it's real", reply: "Is this message real?", goto: "reply" },
        ],
      },
      reply: {
        msgs: [{ from: "them", text: "Yes it is official. Kindly use the link now, your account will be blocked at 6pm." }],
        choices: [
          { label: "OK, tap the link", goto: "site" },
          { label: "Delete it and check in my bank's app", end: "win", story: "Scammers will always say they're real. The only safe check is your bank's own app, website or number." },
        ],
      },
      site: {
        msgs: [
          { from: "system", text: "Website: \"BVN Verification Portal\". Enter BVN, card number, expiry date and 4-digit card PIN." },
        ],
        choices: [
          { label: "Fill it in. It looks official", end: "lose", lost: 180000, story: "With your card number and PIN they emptied your account at ATMs and online. Logos are easy to copy." },
          { label: "Close it. No site needs my PIN", end: "win", story: "Exactly. Your PIN is for ATMs and POS machines only. Closing the page early means no harm done." },
        ],
      },
    },
  },
  {
    id: "wrong-transfer",
    title: "\"I sent it to you by mistake\"",
    teaser: "A stranger says they sent you money by mistake and begs for it back.",
    channel: "whatsapp",
    contact: "+234 813 004 7781",
    flags: [
      "A stranger contacting you about \"your\" money",
      "A screenshot or forwarded alert instead of a real credit in your account",
      "Emotional pressure and urgency",
    ],
    lesson: { module: "finlit", lesson: "scam-mail" },
    nodes: {
      start: {
        msgs: [
          { from: "them", text: "Good evening please 🙏 I mistakenly transferred ₦50,000 to your account instead of my sister's. Please help me send it back, it's for my mum's hospital bill." },
          { from: "system", text: "Forwarded: \"Credit Alert! Amt: NGN50,000.00 Desc: TRF Bal: NGN304,300.00\"" },
        ],
        choices: [
          { label: "Send it back right away", reply: "So sorry, sending it now.", end: "lose", lost: 50000, story: "There was never any ₦50,000. The \"alert\" was typed up and forwarded. You sent your own money." },
          { label: "Check my balance in my bank app first", goto: "check" },
        ],
      },
      check: {
        msgs: [
          { from: "system", text: "Your bank app: Balance ₦254,300. No new credit today." },
          { from: "them", text: "Please it can take time to show 🙏 my mum is in the theatre, I beg you, send it now" },
        ],
        choices: [
          { label: "Send it anyway, just in case", reply: "OK, sending.", end: "lose", lost: 50000, story: "If it isn't in your account, it doesn't exist. Real transfers show up straight away in your app." },
          { label: "Tell them to ask their bank to reverse it, then block", reply: "Please ask your bank to reverse it through mine.", end: "win", story: "Correct. Genuine mistakes are reversed bank-to-bank. You never need to send anything yourself." },
        ],
      },
    },
  },
  {
    id: "loan-fee",
    title: "Instant loan, small fee",
    teaser: "A loan agent says ₦200,000 is approved. Just pay a processing fee first.",
    channel: "whatsapp",
    contact: "QuickCash Loans",
    contactNote: "Business account",
    flags: [
      "A fee before you receive the loan",
      "One fee becomes another fee",
      "No sign of FCCPC approval",
    ],
    lesson: { module: "debt", lesson: "loan-apps" },
    nodes: {
      start: {
        msgs: [
          { from: "them", text: "Congrats! 🎉 Your loan of ₦200,000 is APPROVED. No collateral. To release the funds, pay a one-time processing fee of ₦7,500 to the account below." },
        ],
        choices: [
          { label: "Pay the ₦7,500. It's small compared to ₦200,000", reply: "Done, I've paid.", goto: "paid" },
          { label: "Check the company on the FCCPC list first", goto: "check" },
        ],
      },
      check: {
        msgs: [{ from: "system", text: "You search the FCCPC list of approved digital lenders. \"QuickCash Loans\" isn't on it." }],
        choices: [
          { label: "Block and report them", end: "win", story: "Smart. Unapproved lender plus an upfront fee: you avoided a scam before losing a naira." },
          { label: "Pay anyway, maybe they're new", reply: "OK I've paid the ₦7,500.", goto: "paid" },
        ],
      },
      paid: {
        msgs: [
          { from: "them", text: "Payment received ✅ One more step: pay ₦15,000 for loan insurance and the ₦200,000 drops in 10 minutes." },
        ],
        choices: [
          { label: "Pay it, I'm almost there", reply: "Sent the ₦15,000.", end: "lose", lost: 22500, story: "There is no loan. They'll keep inventing fees until you stop paying. Real lenders take fees from the loan, never before." },
          { label: "Stop and report them", end: "lose", lost: 7500, story: "You stopped the bleeding, but the first ₦7,500 is gone. Rule: never pay anything to receive a loan." },
        ],
      },
    },
  },
  {
    id: "double-money",
    title: "Double your money in 30 days",
    teaser: "A friend from your group chat says she doubled her money. You can too.",
    channel: "whatsapp",
    contact: "Aunty Bisi",
    contactNote: "From your group chat",
    flags: [
      "Guaranteed high returns (100% in a month)",
      "Early members get paid to make it look real",
      "Bonuses for bringing in friends",
      "Withdrawals become \"delayed\"",
    ],
    lesson: { module: "investing", lesson: "ponzi" },
    nodes: {
      start: {
        msgs: [
          { from: "them", text: "My dear! Have you heard of GoldTrust Capital? I put ₦100,000 and got ₦200,000 back in 30 days. It's real, my cousin also collected. Join with my link before slots close today 🙌" },
        ],
        choices: [
          { label: "Invest ₦100,000. She got paid!", reply: "Wow OK, I'm in with ₦100,000.", goto: "month" },
          { label: "Ask how they make 100% in a month", reply: "How exactly do they make 100% a month?", goto: "how" },
        ],
      },
      how: {
        msgs: [{ from: "them", text: "Forex and crypto trading by experts. Don't overthink it, people are making money! Slots close today o." }],
        choices: [
          { label: "Check them with SEC Nigeria first", end: "win", story: "GoldTrust isn't registered, and SEC has warned about schemes like it. Vague answers plus deadlines = walk away." },
          { label: "Fine, I'll invest", reply: "OK, sending ₦100,000.", goto: "month" },
        ],
      },
      month: {
        msgs: [
          { from: "system", text: "30 days later: you receive ₦20,000 \"bonus\". Your ₦200,000 payout is \"processing\"." },
          { from: "them", text: "Payouts are delayed small because of upgrade. Add ₦200,000 more now to unlock VIP level and withdraw everything!" },
        ],
        choices: [
          { label: "Add ₦200,000 to unlock it", reply: "OK, adding ₦200,000.", end: "lose", lost: 280000, story: "The site went offline two weeks later. The ₦20,000 \"bonus\" was someone else's money, paid to keep you in." },
          { label: "Stop. Report it to SEC and the EFCC", end: "lose", lost: 80000, story: "You lost ₦80,000 (₦100,000 minus the ₦20,000 bonus), but not more. Delayed withdrawals mean collapse is coming." },
        ],
      },
    },
  },
  {
    id: "job-fee",
    title: "The dream job offer",
    teaser: "You've been shortlisted for a big oil company job. There's just a registration fee.",
    channel: "email",
    contact: "recruitment.ng@careers-oilgas.com",
    flags: [
      "A job you never applied for",
      "A personal email address, not the company's website",
      "A fee to get the job",
    ],
    lesson: { module: "finlit", lesson: "scam-mail" },
    nodes: {
      start: {
        msgs: [
          { from: "them", text: "Congratulations! You have been shortlisted for the position of Admin Officer (₦850,000/month) at a leading oil and gas company. Pay ₦15,000 for medical screening and registration within 48 hours to secure your slot." },
        ],
        choices: [
          { label: "Pay the ₦15,000. This could change my life", reply: "I've paid. When is the interview?", end: "lose", lost: 15000, story: "No interview ever came. Genuine employers never charge you to apply or for medicals." },
          { label: "Check the company's official careers page", goto: "check" },
        ],
      },
      check: {
        msgs: [{ from: "system", text: "The company's official site says: \"We never charge any fee at any stage of recruitment.\"" }],
        choices: [
          { label: "Report the email as a scam and delete it", end: "win", story: "Right. A fee to get a job is always a scam, however good the job sounds." },
        ],
      },
    },
  },
];

const KEY = "mm-sim-results";

/** Results are kept in this browser only: { scenarioId: "win" | "lose" } */
export function loadResults() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveResult(id, outcome) {
  const r = loadResults();
  // Keep the best result: a win stays a win
  r[id] = r[id] === "win" ? "win" : outcome;
  try {
    localStorage.setItem(KEY, JSON.stringify(r));
  } catch {
    /* storage blocked */
  }
  return r;
}
