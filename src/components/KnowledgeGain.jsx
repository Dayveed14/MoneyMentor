import { TOPICS } from "../data/assessment";
import "./KnowledgeGain.css";

/** First vs latest knowledge check, overall and per topic. Needs at least two results. */
function KnowledgeGain({ history, compact = false }) {
  if (!history || history.length < 2) return null;
  const first = history[0];
  const last = history[history.length - 1];
  const change = last.percent - first.percent;
  const topics = Object.keys(TOPICS).filter((t) => first.topic_scores?.[t] !== undefined && last.topic_scores?.[t] !== undefined);

  return (
    <section className={`gainCard ${compact ? "compact" : ""}`} aria-label="Your progress since your first knowledge check">
      <div className="gainTop">
        <div>
          <p className="continueEyebrow">Your progress</p>
          <h2>
            {change > 0 ? `Up ${change} points since your first check` : change === 0 ? "Same score as your first check" : `Down ${-change} points since your first check`}
          </h2>
          <p className="muted">
            {first.percent}% ({first.level}) on {new Date(first.created_at.replace(" ", "T") + "Z").toLocaleDateString()} →{" "}
            <strong>{last.percent}% ({last.level})</strong> now
          </p>
        </div>
        <div className={`gainBig num ${change > 0 ? "up" : change < 0 ? "down" : ""}`}>
          {change > 0 ? "+" : ""}{change}
        </div>
      </div>
      {!compact && topics.length > 0 && (
        <ul className="gainTopics">
          {topics.map((t) => {
            const a = first.topic_scores[t] * 50;
            const b = last.topic_scores[t] * 50;
            return (
              <li key={t}>
                <span className="gainLbl">{TOPICS[t].label}</span>
                <div className="gainBars" aria-label={`${TOPICS[t].label}: ${a}% then ${b}%`}>
                  <span className="gainBefore" style={{ width: `${Math.max(2, a)}%` }} />
                  <span className="gainAfter" style={{ width: `${Math.max(2, b)}%` }} />
                </div>
                <span className={`gainDelta num ${b > a ? "up" : b < a ? "down" : ""}`}>{b > a ? `+${b - a}` : b - a}</span>
              </li>
            );
          })}
        </ul>
      )}
      {!compact && (
        <p className="gainKey muted small"><span className="kBefore" /> First check <span className="kAfter" /> Latest</p>
      )}
    </section>
  );
}
export default KnowledgeGain;
