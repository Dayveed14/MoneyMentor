import { useState } from "react";
import { FaBreadSlice } from "react-icons/fa";
import TryIt, { Slider } from "./TryIt";
import { money } from "../lib/format";

const LOAVES = 10;

/** Prices rise; idle money buys less. */
function InflationShrink() {
  const [inflation, setInflation] = useState(20);
  const [years, setYears] = useState(3);
  const [interest, setInterest] = useState(5);
  const power = Math.pow(1 + interest / 100, years) / Math.pow(1 + inflation / 100, years);
  const loaves = Math.max(0, Math.min(LOAVES, LOAVES * power));
  const real = 10000 * power;

  return (
    <TryIt title="What will ₦10,000 buy later?" hint="Today ₦10,000 buys 10 loaves of bread. Raise inflation and watch them disappear.">
      <div className="tryControls">
        <Slider label="Prices rise each year (inflation)" value={inflation} min={0} max={40} onChange={setInflation} format={(v) => `${v}%`} />
        <Slider label="Your savings earn" value={interest} min={0} max={30} onChange={setInterest} format={(v) => `${v}%`} />
        <Slider label="Years" value={years} min={1} max={10} onChange={setYears} />
      </div>
      <div className="loaves" aria-label={`Buys about ${loaves.toFixed(1)} loaves`}>
        {Array.from({ length: LOAVES }, (_, i) => {
          const fill = Math.max(0, Math.min(1, loaves - i));
          return (
            <span key={i} className={`loaf ${fill === 0 ? "gone" : ""}`} style={{ "--fill": fill }}>
              <FaBreadSlice aria-hidden="true" />
            </span>
          );
        })}
      </div>
      <div className={`tryResult ${power >= 1 ? "good" : "bad"}`} aria-live="polite">
        <p>In {years} year{years === 1 ? "" : "s"}, your ₦10,000 buys what</p>
        <strong className="num">{money(real)}</strong>
        <p className="small">buys today. {power >= 1 ? "Your money is beating inflation." : `Your savings are losing about ${Math.round((1 - power) * 100)}% of their value. Investing aims to close that gap.`}</p>
      </div>
    </TryIt>
  );
}
export default InflationShrink;
