import { useState } from "react";
import TryIt, { Slider } from "./TryIt";
import { useCountUp } from "../motion/hooks";
import { money } from "../lib/format";

function Amount({ value }) {
  return <>{money(useCountUp(value, { duration: 500 }))}</>;
}

/** 50/30/20 on the learner's own income, then their own split. */
function BudgetSplit() {
  const [income, setIncome] = useState(200000);
  const [needs, setNeeds] = useState(50);
  const [wants, setWants] = useState(30);
  const savings = Math.max(0, 100 - needs - wants);
  const parts = [
    { id: "need", label: "Needs", pct: needs },
    { id: "want", label: "Wants", pct: wants },
    { id: "save", label: "Savings", pct: savings },
  ];
  const tip =
    savings >= 20 ? "On track: at least 20% is going to your future." :
    savings >= 10 ? "Not bad. Can you trim a want to reach 20%?" :
    savings > 0 ? "Savings are thin. One surprise bill could push you into debt." :
    "Nothing left to save. Look for a want or a need you can cut.";

  return (
    <TryIt title="Split your own pay" hint="Enter your monthly take-home pay, then move the sliders to see where it goes.">
      <label className="tryMoney">
        <span>Monthly take-home pay</span>
        <span className="tmInput"><span>₦</span><input type="number" inputMode="numeric" min="0" value={income || ""} onChange={(e) => setIncome(Math.max(0, Number(e.target.value)))} /></span>
      </label>
      <div className="splitStrip" aria-hidden="true">
        {parts.map((p) => p.pct > 0 && (
          <span key={p.id} className={`ss-${p.id}`} style={{ flexBasis: `${p.pct}%` }}>{p.pct >= 12 ? `${p.pct}%` : ""}</span>
        ))}
      </div>
      <ul className="splitLegend">
        {parts.map((p) => (
          <li key={p.id}><i className={`ss-${p.id}`} /> {p.label} <strong className="num"><Amount value={(income * p.pct) / 100} /></strong></li>
        ))}
      </ul>
      <div className="tryControls two">
        <Slider label="Needs" value={needs} min={20} max={90} onChange={(v) => { setNeeds(v); if (v + wants > 100) setWants(100 - v); }} format={(v) => `${v}%`} />
        <Slider label="Wants" value={wants} min={0} max={100 - needs} onChange={setWants} format={(v) => `${v}%`} />
      </div>
      <p className={`tryNote ${savings >= 20 ? "good" : savings >= 10 ? "" : "bad"}`} aria-live="polite">{tip}</p>
      <button type="button" className="linkBtn" onClick={() => { setNeeds(50); setWants(30); }}>Reset to 50/30/20</button>
    </TryIt>
  );
}
export default BudgetSplit;
