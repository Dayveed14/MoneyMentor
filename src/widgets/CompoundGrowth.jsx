import { useState } from "react";
import TryIt, { Slider } from "./TryIt";
import { useCountUp } from "../motion/hooks";
import { money } from "../lib/format";

/** Interest on interest, for savers and for borrowers. */
function CompoundGrowth() {
  const [mode, setMode] = useState("save");
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(mode === "save" ? 10 : 30);
  const [years, setYears] = useState(10);

  const yearly = Array.from({ length: years + 1 }, (_, y) => amount * Math.pow(1 + rate / 100, y));
  const final = yearly[years];
  const simple = amount * (1 + (rate / 100) * years);
  const max = yearly[years];
  const shown = useCountUp(final, { duration: 600 });
  const saving = mode === "save";

  return (
    <TryIt title="Watch interest grow on interest" hint="Move the sliders. Each bar is one year: the dark part is your money, the bright part is interest.">
      <div className="tryToggle" role="group" aria-label="Saving or borrowing">
        <button type="button" aria-pressed={saving} onClick={() => { setMode("save"); setRate(10); }}>I&apos;m saving</button>
        <button type="button" aria-pressed={!saving} onClick={() => { setMode("borrow"); setRate(30); }}>I&apos;m borrowing</button>
      </div>
      <div className="tryControls">
        <Slider label={saving ? "Amount saved" : "Amount borrowed"} value={amount} min={10000} max={1000000} step={10000} onChange={setAmount} format={money} />
        <Slider label="Interest per year" value={rate} min={1} max={60} onChange={setRate} format={(v) => `${v}%`} />
        <Slider label="Years" value={years} min={1} max={20} onChange={setYears} />
      </div>
      <div className="growBars" aria-hidden="true">
        {yearly.map((v, y) => (
          <div key={y} className="growCol">
            <div className={`growBar ${saving ? "" : "debt"}`} style={{ height: `${(v / max) * 100}%` }}>
              <span className="growBase" style={{ height: `${(amount / v) * 100}%` }} />
            </div>
            {(y === 0 || y === years || years <= 10) && <span className="growLbl num">{y}</span>}
          </div>
        ))}
      </div>
      <div className={`tryResult ${saving ? "good" : "bad"}`} aria-live="polite">
        <p>After {years} year{years === 1 ? "" : "s"}, {saving ? "you'd have" : "you'd owe"}</p>
        <strong className="num">{money(shown)}</strong>
        <p className="small">
          {money(final - amount)} of that is interest. With simple interest it would be {money(simple)}, so compounding added{" "}
          <b>{money(final - simple)}</b>. {saving ? "Start early: time does the heavy lifting." : "This is why unpaid debt snowballs."}
        </p>
      </div>
    </TryIt>
  );
}
export default CompoundGrowth;
