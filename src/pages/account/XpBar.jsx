import { HiFire, HiLightningBolt } from "react-icons/hi";
import { useCountUp } from "../../motion/hooks";
import { xpFrom, levelFrom, streakFrom } from "../../lib/xp";

const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

/** XP, level and learning streak, all worked out from progress. */
function XpBar({ progress }) {
  const xp = xpFrom(progress);
  const lvl = levelFrom(xp);
  const streak = streakFrom(progress.activeDays);
  const shownXp = useCountUp(xp, { duration: 1100 });
  const fill = useCountUp((lvl.into / lvl.need) * 100, { duration: 1100 });
  const days = new Set(progress.activeDays || []);
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - (6 - i));
    return { key: d.toISOString().slice(0, 10), letter: DAY_LETTERS[d.getUTCDay()], today: i === 6 };
  });

  return (
    <section className="xpCard" aria-label="Your points and streak">
      <div className="xpLevel">
        <span className="xpBadge num" aria-hidden="true">{lvl.level}</span>
        <div>
          <p className="continueEyebrow">Level {lvl.level} · {lvl.name}</p>
          <p className="xpTotal num"><HiLightningBolt aria-hidden="true" /> {Math.round(shownXp).toLocaleString()} XP</p>
          <div className="xpTrack" role="progressbar" aria-valuemin={0} aria-valuemax={lvl.need} aria-valuenow={lvl.into} aria-label="Progress to next level">
            <span style={{ width: `${fill}%` }} />
          </div>
          <p className="muted small num">{lvl.need - lvl.into} XP to level {lvl.level + 1}. Lessons give 10, passing a quiz 50.</p>
        </div>
      </div>
      <div className={`xpStreak ${streak > 0 ? "on" : ""}`}>
        <div className="xpFlame"><HiFire aria-hidden="true" /><strong className="num">{streak}</strong></div>
        <div>
          <p className="streakLabel">{streak === 0 ? "No streak yet" : `${streak}-day streak`}</p>
          <ol className="weekDots" aria-label="Days you learned this week">
            {week.map((d) => (
              <li key={d.key} className={`${days.has(d.key) ? "on" : ""} ${d.today ? "today" : ""}`} title={d.key}>
                <span aria-hidden="true">{d.letter}</span>
                <span className="srOnly">{d.key}: {days.has(d.key) ? "learned" : "no learning"}</span>
              </li>
            ))}
          </ol>
          <p className="muted small">{streak === 0 ? "Finish a lesson today to start one." : "Learn something today to keep it going."}</p>
        </div>
      </div>
    </section>
  );
}
export default XpBar;
