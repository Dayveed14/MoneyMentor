import { useState } from "react";
import { Link } from "react-router-dom";
import { HiExclamation, HiShieldExclamation, HiShieldCheck } from "react-icons/hi";
import { checkMessage, highlight, ADVICE, ADVICE_PCM, SAMPLES } from "../lib/scamCheck";
import { useLang } from "../context/LanguageContext";
import "./ScamChecker.css";

const ICONS = { high: HiShieldExclamation, medium: HiExclamation, low: HiShieldCheck };

/** Paste a message → red flags, highlighted text and what to do next. */
function ScamChecker({ compact = false }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [checked, setChecked] = useState("");
  const { lang, t } = useLang();
  const pcm = lang === "pcm";

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

  const reportLink = `/report?message=${encodeURIComponent(checked.slice(0, 1500))}`;
  const Icon = result && ICONS[result.level];

  return (
    <div className={`checker ${compact ? "compact" : ""}`} id="check">
      <div className="checkerHead">
        <h2>{t("checker.title")}</h2>
        <p>{t("checker.lead")}</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); run(); }}>
        <label className="srOnly" htmlFor="scam-text">Message to check</label>
        <textarea
          id="scam-text"
          value={text}
          onChange={(e) => { setText(e.target.value); if (result) setResult(null); }}
          rows={compact ? 4 : 5}
          maxLength={3000}
          placeholder={t("checker.placeholder")}
        />
        <div className="checkerRow">
          <div className="samples">
            <span>{t("checker.examples")}</span>
            {SAMPLES.map((s) => (
              <button key={s.label} type="button" className="sample" onClick={() => trySample(s)}>{s.label}</button>
            ))}
          </div>
          <button type="submit" className="btn btn-solid" disabled={!text.trim()}>{t("checker.button")}</button>
        </div>
      </form>

      {result && (
        <div className={`verdict v-${result.level}`} aria-live="polite">
          <div className="verdictHead">
            <Icon aria-hidden="true" />
            <h3>{t(`checker.${result.level}`)}</h3>
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
                    <strong>{pcm ? f.title_pcm : f.title}</strong>
                    <span>{pcm ? f.explain_pcm : f.explain}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="todo">
            <h4>{t("checker.todo")}</h4>
            <ol>
              {(pcm ? ADVICE_PCM : ADVICE)[result.level].map((a) => <li key={a}>{a}</li>)}
            </ol>
          </div>

          <p className="askLine">
            {t("checker.ask")} <Link to={askLink}>{t("checker.askLink")}</Link>
            {result.level !== "low" && (
              <>
                {" · "}
                <Link to={reportLink}>{t("checker.report")}</Link>
              </>
            )}
          </p>
        </div>
      )}
      <p className="checkerNote">{t("checker.note")}</p>
    </div>
  );
}
export default ScamChecker;
