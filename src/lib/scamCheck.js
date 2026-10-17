/*
 * Reads a pasted message (SMS, WhatsApp, email, or what a caller said) and
 * looks for the patterns scammers use. It's a guide, not a guarantee — the
 * advice is always to verify through official channels.
 */

const RULES = [
  {
    id: "secrets",
    weight: 3,
    title: "Asks for a code, PIN or password",
    explain: "No bank, telco or government office will ever ask for your OTP, PIN, password, CVV or BVN by call, SMS or chat.",
    pattern: /\b(otp|one[- ]?time (?:password|passcode|pin|code)|pin|cvv|password|passcode|bvn|nin|token|security code|verification code|the code (?:we|i) (?:just )?sent)\b/gi,
  },
  {
    id: "pay-to-get",
    weight: 3,
    title: "Wants money before you receive money",
    explain: "Paying a \"fee\" to unlock a prize, loan, job or refund is the most common scam there is.",
    pattern: /\b(processing fee|transfer fee|registration fee|activation fee|clearance fee|release fee|pay (?:a |the )?(?:small )?fee|send (?:me|us) (?:money|airtime)|pay to (?:claim|receive|unlock|release))\b/gi,
  },
  {
    id: "too-good",
    weight: 3,
    title: "Too good to be true",
    explain: "Prizes you never entered for, guaranteed profits and money that doubles fast are classic bait.",
    pattern: /\b(you(?:'ve| have)? won|winner|prize|lottery|jackpot|double your (?:money|investment)|guaranteed (?:returns?|profits?|income)|\d+\s?% (?:daily|weekly|monthly|profit|returns?)|free money|cash grant|giveaway)\b/gi,
  },
  {
    id: "remote",
    weight: 3,
    title: "Asks you to install an app or share your screen",
    explain: "Screen-sharing and remote-access apps let a scammer watch you type codes or take over your phone.",
    pattern: /\b(anydesk|teamviewer|quicksupport|screen ?share|share your screen|install (?:this|the) app|download (?:this|the) app)\b/gi,
  },
  {
    id: "pressure",
    weight: 2,
    title: "Pressure or threats",
    explain: "Scammers rush you so you don't stop to think. Real organisations give you time to check.",
    pattern: /\b(urgent(?:ly)?|immediately|right now|act now|within (?:\d+|24|48) ?(?:hours?|hrs|minutes?|mins)|today only|last (?:warning|chance)|final (?:notice|warning)|expires? (?:today|soon)|will be (?:blocked|suspended|closed|deactivated|restricted|debited)|has been (?:blocked|suspended|restricted))\b/gi,
  },
  {
    id: "link",
    weight: 2,
    title: "Wants you to tap a link",
    explain: "Links in unexpected messages often lead to fake websites that steal your details. Open your bank's app yourself instead.",
    pattern: /(https?:\/\/\S+|www\.\S+|\b\S+\.(?:xyz|top|click|link|info|site|online)\b|\bbit\.ly\/\S*|\btinyurl\.com\/\S*|\bclick (?:here|the link|this link|below)\b|\btap (?:the|this) link\b)/gi,
  },
  {
    id: "secrecy",
    weight: 2,
    title: "Asks you to keep it secret",
    explain: "Being told not to tell family or your bank is a sign someone doesn't want you to get a second opinion.",
    pattern: /\b(don'?t tell (?:anyone|anybody|your)|keep (?:this|it) (?:secret|confidential|between us)|do not (?:share|discuss) this)\b/gi,
  },
  {
    id: "impersonation",
    weight: 1,
    title: "Claims to be an official body",
    explain: "Scammers often pretend to be your bank, a regulator or \"customer care\". That alone isn't proof of a scam, but verify it yourself.",
    pattern: /\b(your bank|bank (?:officer|official|manager|staff)|customer (?:care|service)|account officer|support team|verification (?:team|unit|department)|cbn|efcc|central bank|fraud (?:department|unit))\b/gi,
  },
];

export const ADVICE = {
  high: [
    "Stop. Don't reply, tap any link, share any code or send any money.",
    "Contact the organisation yourself, using the number on your card, its official app or its official website.",
    "If you've already shared a code or paid, call your bank immediately to block your account.",
  ],
  medium: [
    "Don't act yet. Check the sender through official contact details you already trust.",
    "Never share codes, PINs or passwords, whatever the reason given.",
    "Ask someone you trust, or send us the message for a second opinion.",
  ],
  low: [
    "We didn't spot common scam signs, but scammers change their tactics.",
    "If the message asks for money, codes or personal details, verify it through official channels first.",
  ],
};

export function checkMessage(text) {
  const found = [];
  const ranges = [];
  for (const rule of RULES) {
    const matches = [...text.matchAll(rule.pattern)];
    if (matches.length) {
      found.push({ ...rule, examples: [...new Set(matches.map((m) => m[0].toLowerCase()))].slice(0, 3) });
      matches.forEach((m) => ranges.push([m.index, m.index + m[0].length, rule.weight]));
    }
  }
  const score = found.reduce((n, r) => n + r.weight, 0);
  const hasHigh = found.some((r) => r.weight === 3);
  const level = hasHigh || score >= 4 ? "high" : score >= 2 ? "medium" : "low";
  return { level, found: found.sort((a, b) => b.weight - a.weight), ranges: mergeRanges(ranges) };
}

function mergeRanges(ranges) {
  const sorted = ranges.sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const r of sorted) {
    const last = out[out.length - 1];
    if (last && r[0] <= last[1]) {
      last[1] = Math.max(last[1], r[1]);
      last[2] = Math.max(last[2], r[2]);
    } else out.push([...r]);
  }
  return out;
}

/** Splits text into plain and highlighted pieces for display. */
export function highlight(text, ranges) {
  const parts = [];
  let i = 0;
  for (const [start, end, weight] of ranges) {
    if (start > i) parts.push({ text: text.slice(i, start) });
    parts.push({ text: text.slice(start, end), flag: weight >= 3 ? "high" : "medium" });
    i = end;
  }
  if (i < text.length) parts.push({ text: text.slice(i) });
  return parts;
}

export const SAMPLES = [
  {
    label: "Bank call",
    text: "Good afternoon, I'm calling from your bank's fraud department. We noticed a suspicious debit on your account. To stop it, please read out the OTP we just sent to your phone immediately.",
  },
  {
    label: "BVN text",
    text: "Dear customer, your account will be blocked today due to incomplete BVN update. Click the link to verify now: http://bvn-update-secure.xyz",
  },
  {
    label: "Investment offer",
    text: "Join our investment club and double your money in 14 days! Guaranteed returns of 30% weekly. Pay a small registration fee to start. Don't tell anyone, slots are limited.",
  },
];
