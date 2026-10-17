import { useState } from "react";
import { Link } from "react-router-dom";
import { HiExclamation, HiShieldExclamation, HiShieldCheck } from "react-icons/hi";
import { checkMessage, highlight, ADVICE, SAMPLES } from "../lib/scamCheck";
import "./ScamChecker.css";

const VERDICT = {
  high: { title: "High risk: this looks like a scam", icon: HiShieldExclamation },
  medium: { title: "Be careful: some warning signs", icon: HiExclamation },
  low: { title: "No obvious scam signs found", icon: HiShieldCheck },
};

/** Paste a message → red flags, highlighted text and what to do next. */
function ScamChecker({ compact = false }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [checked, setChecked] = useState("");

  const run = (value = text) => {
    if (!value.trim()) return;
    setChecked(value);
    setResult(checkMessage(value));
  };

  const trySample = (s) => {
    setText(s.text);
    run(s.text);
  };

  const askLink = `/contactUs?subject=${encodeURIComponent("Is this a scam?")}&message=${encodeURIComponent(
    `I received this and I'm not sure if it's genuine:\n\n${checked.slice(0, 600)}`
  )}`;

  const V = result && VERDICT[result.level];

  return (
    <div className={`checker ${compact ? "compact" : ""}`} id="check">
      <div className="checkerHead">
        <h2>Is this message a scam?</h2>
        <p>Paste a text, WhatsApp message or email, or type what a caller said.</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); run(); }}>
        <label className="srOnly" htmlFor="scam-text">Message to check</label>
        <textarea
          id="scam-text"
          value={text}
          onChange={(e) => { setText(e.target.value); if (result) setResult(null); }}
          rows={compact ? 4 : 5}
          maxLength={3000}
          placeholder="e.g. Your account will be blocked today. Send the OTP we just sent to verify..."
        />
        <div className="checkerRow">
          <div className="samples">
            <span>Try an example:</span>
            {SAMPLES.map((s) => (
              <button key={s.label} type="button" className="sample" onClick={() => trySample(s)}>{s.label}</button>
            ))}
          </div>
          <button type="submit" className="btn btn-solid" disabled={!text.trim()}>Check message</button>
        </div>
      </form>

      {result && (
        <div className={`verdict v-${result.level}`} aria-live="polite">
          <div className="verdictHead">
            <V.icon aria-hidden="true" />
            <h3>{V.title}</h3>
          </div>

          {result.found.length > 0 && (
            <>
              <p className="verdictText">
                {highlight(checked, result.ranges).map((p, i) =>
                  p.flag ? <mark key={i} className={`m-${p.flag}`}>{p.text}</mark> : <span key={i}>{p.text}</span>
                )}
              </p>
              <ul className="flags">
                {result.found.map((f) => (
                  <li key={f.id} className={f.weight >= 3 ? "fHigh" : f.weight === 2 ? "fMed" : "fLow"}>
                    <strong>{f.title}</strong>
                    <span>{f.explain}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="todo">
            <h4>What to do</h4>
            <ol>
              {ADVICE[result.level].map((a) => <li key={a}>{a}</li>)}
            </ol>
          </div>

          <p className="askLine">
            Still unsure? <Link to={askLink}>Send it to us for a second opinion</Link>
          </p>
        </div>
      )}
      <p className="checkerNote">The check runs in your browser. Nothing you paste is sent or stored unless you choose to send it to us.</p>
    </div>
  );
}
export default ScamChecker;
