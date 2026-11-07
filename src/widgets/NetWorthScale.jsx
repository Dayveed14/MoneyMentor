import { useState } from "react";
import TryIt from "./TryIt";
import { useCountUp } from "../motion/hooks";
import { money } from "../lib/format";

const OWN = [["savings", "Savings and cash", 150000], ["invest", "Investments and pension", 50000], ["things", "Property, land, equipment", 300000]];
const OWE = [["loans", "Loans and loan apps", 120000], ["people", "Money you owe people", 30000]];

function Field({ label, value, onChange }) {
  return (
    <label className="nwField">
      <span>{label}</span>
      <span className="tmInput"><span>₦</span><input type="number" inputMode="numeric" min="0" value={value || ""} onChange={(e) => onChange(Math.max(0, Number(e.target.value)))} /></span>
    </label>
  );
}

/** Own vs owe on a seesaw. */
function NetWorthScale() {
  const [vals, setVals] = useState(Object.fromEntries([...OWN, ...OWE].map(([k, , v]) => [k, v])));
  const set = (k) => (v) => setVals((s) => ({ ...s, [k]: v }));
  const own = OWN.reduce((n, [k]) => n + vals[k], 0);
  const owe = OWE.reduce((n, [k]) => n + vals[k], 0);
  const net = own - owe;
  const shown = useCountUp(net, { duration: 500 });
  const tilt = own + owe ? Math.max(-14, Math.min(14, ((owe - own) / (own + owe)) * 14)) : 0;

  return (
    <TryIt title="Weigh up your net worth" hint="Change the numbers to your own. Nothing you type here is saved or sent anywhere.">
      <div className="nwGrid">
        <fieldset><legend>What you own</legend>{OWN.map(([k, l]) => <Field key={k} label={l} value={vals[k]} onChange={set(k)} />)}</fieldset>
        <fieldset><legend>What you owe</legend>{OWE.map(([k, l]) => <Field key={k} label={l} value={vals[k]} onChange={set(k)} />)}</fieldset>
      </div>
      <div className="seesaw" aria-hidden="true">
        <div className="ssBeam" style={{ transform: `rotate(${tilt}deg)` }}>
          <span className="ssPan own num">{money(own)}</span>
          <span className="ssPan owe num">{money(owe)}</span>
        </div>
        <div className="ssPivot" />
      </div>
      <div className={`tryResult ${net >= 0 ? "good" : "bad"}`} aria-live="polite">
        <p>Your net worth</p>
        <strong className="num">{net < 0 ? "−" : ""}{money(Math.abs(shown))}</strong>
        <p className="small">{net >= 0 ? "You own more than you owe. Track it yearly and watch it grow." : "You owe more than you own. That's a starting point, not a verdict. Paying down debt raises it."}</p>
      </div>
    </TryIt>
  );
}
export default NetWorthScale;
