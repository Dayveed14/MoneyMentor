import { useState } from "react";
import { HiShieldExclamation, HiExclamation, HiShieldCheck } from "react-icons/hi";

/**
 * Yes/no checklist. Each question is a warning sign ("yes" = red flag);
 * `critical` signs alone are enough to say "don't".
 */
function RedFlagCheck({ id, questions, verdicts, children }) {
  const [answers, setAnswers] = useState({});
  const answered = Object.keys(answers).length;
  const flags = questions.filter((q, i) => answers[i] === true);
  const critical = flags.some((q) => q.critical);
  const level = answered === 0 ? null : critical || flags.length >= 2 ? "high" : flags.length === 1 ? "medium" : answered === questions.length ? "low" : null;
  const Icon = { high: HiShieldExclamation, medium: HiExclamation, low: HiShieldCheck }[level];

  return (
    <div className="flagCheck">
      <ol className="flagQs">
        {questions.map((q, i) => (
          <li key={i}>
            <span id={`${id}-q${i}`}>{q.q}</span>
            <div className="yesNo" role="group" aria-labelledby={`${id}-q${i}`}>
              <button type="button" aria-pressed={answers[i] === true} onClick={() => setAnswers((a) => ({ ...a, [i]: true }))}>Yes</button>
              <button type="button" aria-pressed={answers[i] === false} onClick={() => setAnswers((a) => ({ ...a, [i]: false }))}>No</button>
            </div>
          </li>
        ))}
      </ol>
      {level && (
        <div className={`verdict v-${level}`} aria-live="polite">
          <div className="verdictHead">
            <Icon aria-hidden="true" />
            <h3>{verdicts[level]}</h3>
          </div>
          {flags.length > 0 && (
            <ul className="flagWhy">
              {flags.map((f) => <li key={f.q}>{f.why}</li>)}
            </ul>
          )}
          {children}
        </div>
      )}
      {answered > 0 && (
        <button type="button" className="linkBtn" onClick={() => setAnswers({})}>Start again</button>
      )}
    </div>
  );
}
export default RedFlagCheck;
