import { useState } from "react";
import TryIt, { Slider } from "./TryIt";
import { useCountUp } from "../motion/hooks";
import { money } from "../lib/format";

/** What a short-term loan really costs (flat monthly rate, as many loan apps charge). */
function LoanCost() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(10);
  const [months, setMonths] = useState(3);
  const interest = amount * (rate / 100) * months;
  const total = amount + interest;
  const shown = useCountUp(total, { duration: 500 });
  const yearly = rate * 12;

  return (
    <TryIt title="What does this loan really cost?" hint="Loan apps often quote a small monthly or daily rate. See what you actually pay back.">
      <div className="tryControls">
        <Slider label="You borrow" value={amount} min={10000} max={500000} step={5000} onChange={setAmount} format={money} />
        <Slider label="Interest per month" value={rate} min={1} max={30} onChange={setRate} format={(v) => `${v}%`} />
        <Slider label="For" value={months} min={1} max={12} onChange={setMonths} format={(v) => `${v} month${v === 1 ? "" : "s"}`} />
      </div>
      <div className="loanStack" aria-hidden="true">
        <span className="lsBorrowed" style={{ flexBasis: `${(amount / total) * 100}%` }}>Borrowed</span>
        <span className="lsInterest" style={{ flexBasis: `${(interest / total) * 100}%` }}>{interest / total > 0.12 ? "Interest" : ""}</span>
      </div>
      <div className="tryResult bad" aria-live="polite">
        <p>You pay back</p>
        <strong className="num">{money(shown)}</strong>
        <p className="small">
          That&apos;s <b>{money(interest)}</b> more than you borrowed. {rate}% a month is about <b>{yearly}% a year</b>
          {yearly >= 60 ? ", far more than most bank loans." : "."}
        </p>
      </div>
    </TryIt>
  );
}
export default LoanCost;
