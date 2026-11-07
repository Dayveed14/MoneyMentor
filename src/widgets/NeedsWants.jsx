import { useState } from "react";
import TryIt from "./TryIt";
import { buzz } from "../motion/hooks";

const ITEMS = [
  { name: "Rent", answer: "need", why: "A safe place to live is a need." },
  { name: "Netflix and DSTV together", answer: "want", why: "Entertainment is nice, but two subscriptions is a want." },
  { name: "Transport to work", answer: "need", why: "Getting to work keeps your income coming." },
  { name: "New sneakers (you have two pairs)", answer: "want", why: "You already have what you need." },
  { name: "Rice, beans and garri for the month", answer: "need", why: "Basic food is a need." },
  { name: "Weekend suya and drinks", answer: "want", why: "Fun, but it can wait if money is tight." },
  { name: "Electricity units", answer: "need", why: "Power for light and cooking is a need." },
  { name: "Upgrading to the latest phone", answer: "want", why: "If your phone works, a new one is a want." },
];

/** Tap Need or Want; cards fly to their pile. */
function NeedsWants() {
  const [i, setI] = useState(0);
  const [fly, setFly] = useState(null); // {dir, right}
  const [score, setScore] = useState(0);
  const [last, setLast] = useState(null);
  const done = i >= ITEMS.length;
  const item = ITEMS[i];

  const pick = (choice) => {
    if (fly || done) return;
    const right = choice === item.answer;
    if (right) setScore((s) => s + 1);
    else buzz([20, 40, 20]);
    setLast({ right, why: item.why, name: item.name });
    setFly({ dir: choice === "need" ? "left" : "right", right });
    setTimeout(() => {
      setFly(null);
      setI((n) => n + 1);
    }, 520);
  };

  return (
    <TryIt title="Need or want?" hint="Sort each card. Be honest. That's how a budget starts working.">
      <div className="sortArea">
        <div className="pile need" aria-hidden="true">Needs</div>
        <div className="cardSlot" aria-live="polite">
          {done ? (
            <div className="sortDone">
              <strong className="num">{score}/{ITEMS.length}</strong>
              <p>{score === ITEMS.length ? "Perfect sorting!" : "Good effort. The tricky ones are things that feel like needs."}</p>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setI(0); setScore(0); setLast(null); }}>Play again</button>
            </div>
          ) : (
            <div key={i} className={`sortCard ${fly ? `fly-${fly.dir} ${fly.right ? "ok" : "no"}` : ""}`}>
              <span className="num small">{i + 1} / {ITEMS.length}</span>
              <strong>{item.name}</strong>
            </div>
          )}
        </div>
        <div className="pile want" aria-hidden="true">Wants</div>
      </div>
      {!done && (
        <div className="sortBtns">
          <button type="button" className="btn btn-solid" onClick={() => pick("need")} disabled={Boolean(fly)}>← Need</button>
          <button type="button" className="btn btn-ghost" onClick={() => pick("want")} disabled={Boolean(fly)}>Want →</button>
        </div>
      )}
      {last && (
        <p key={last.name} className={`tryNote pop ${last.right ? "good" : "bad"}`}>
          {last.right ? "Right. " : "Not quite. "}{last.why}
        </p>
      )}
    </TryIt>
  );
}
export default NeedsWants;
