import { useEffect, useRef, useState } from "react";
import TryIt, { Slider } from "./TryIt";
import { money } from "../lib/format";
import { useReducedMotion } from "../motion/hooks";

const DEPOSIT = 10000;

/** Runs a "30% a month" scheme month by month until the new money runs out. */
function simulate(growth, promise) {
  const months = [];
  let members = 0;
  let joiners = 10;
  let pot = 0;
  let paidOut = 0;
  for (let m = 1; m <= 24; m++) {
    members += joiners;
    pot += joiners * DEPOSIT;
    const owed = members * DEPOSIT * (promise / 100);
    const collapsed = owed > pot;
    if (collapsed) {
      // Whatever is left goes to the first few who ask; the pot is now empty
      paidOut += pot;
      pot = 0;
    } else {
      pot -= owed;
      paidOut += owed;
    }
    months.push({ m, members, joiners, pot: Math.max(0, pot), owed, collapsed });
    if (collapsed) break;
    // Recruiting gets harder every month: everyone's friends are already in
    const g = Math.max(-0.5, growth / 100 - 0.08 * m);
    joiners = Math.max(0, Math.round(joiners * (1 + g)));
  }
  const end = months[months.length - 1];
  return { months, end, paidOut, lost: end.members * DEPOSIT - paidOut };
}

function PonziCollapse() {
  const reduced = useReducedMotion();
  const [growth, setGrowth] = useState(60);
  const [promise, setPromise] = useState(30);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef(null);
  const sim = simulate(growth, promise);
  const shown = sim.months[Math.min(step, sim.months.length - 1)];
  const finished = step >= sim.months.length - 1;

  useEffect(() => {
    if (!playing) return;
    if (finished) {
      setPlaying(false);
      return;
    }
    timer.current = setTimeout(() => setStep((s) => s + 1), reduced ? 50 : 700);
    return () => clearTimeout(timer.current);
  }, [playing, step, finished, reduced]);

  const reset = (fn) => (v) => {
    fn(v);
    setStep(0);
    setPlaying(false);
  };

  const dots = Math.min(shown.members, 240);
  const maxPot = Math.max(...sim.months.map((x) => x.pot), 1);

  return (
    <TryIt title="Watch a Ponzi scheme collapse" hint={`A scheme promises ${promise}% a month. Each member puts in ${money(DEPOSIT)}. Press play.`}>
      <div className="tryControls two">
        <Slider label="Promised return per month" value={promise} min={5} max={50} onChange={reset(setPromise)} format={(v) => `${v}%`} />
        <Slider label="How fast new people join" value={growth} min={20} max={150} step={10} onChange={reset(setGrowth)} format={(v) => `+${v}%`} />
      </div>
      <div className={`ponzi ${shown.collapsed ? "collapsed" : ""}`}>
        <div className="pzStats num">
          <span>Month <b>{shown.m}</b></span>
          <span>Members <b>{shown.members.toLocaleString()}</b></span>
          <span>Cash in the pot <b>{money(shown.pot)}</b></span>
        </div>
        <div className="pzPot" aria-hidden="true"><span style={{ width: `${(shown.pot / maxPot) * 100}%` }} /></div>
        <div className="pzPeople" aria-hidden="true">
          {Array.from({ length: dots }, (_, i) => <i key={i} style={{ "--i": i % 30 }} />)}
          {shown.members > 240 && <em>+{(shown.members - 240).toLocaleString()}</em>}
        </div>
        {shown.collapsed && (
          <div className="pzBoom" role="status">
            <strong>Collapsed in month {shown.m}.</strong> New money couldn&apos;t cover the {money(shown.owed)} owed.
            {" "}{shown.members.toLocaleString()} people put in {money(shown.members * DEPOSIT)}; only {money(sim.paidOut)} was ever paid out.
            Most members lose everything, and those who joined last lose first.
          </div>
        )}
      </div>
      <div className="sortBtns">
        {!finished ? (
          <button type="button" className="btn btn-solid" onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : step === 0 ? "Play" : "Continue"}</button>
        ) : (
          <button type="button" className="btn btn-ghost" onClick={() => { setStep(0); setPlaying(true); }}>Play again</button>
        )}
        {!finished && !playing && <button type="button" className="btn btn-ghost" onClick={() => setStep((s) => s + 1)}>Next month</button>}
      </div>
    </TryIt>
  );
}
export default PonziCollapse;
