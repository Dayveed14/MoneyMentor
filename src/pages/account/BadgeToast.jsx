import { useEffect, useState } from "react";
import { HiBadgeCheck, HiX } from "react-icons/hi";
import Confetti from "../../motion/Confetti";

/**
 * Celebrates badges the learner hasn't seen yet. Seen badges are remembered in
 * this browser only; the first visit records what's already earned quietly.
 */
function BadgeToast({ badges, userId, ready }) {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    if (!ready || !userId) return;
    const key = `mm-badges-seen-${userId}`;
    const earned = badges.filter((b) => b.earned).map((b) => b.id);
    let seen = null;
    try {
      seen = JSON.parse(localStorage.getItem(key) || "null");
    } catch {
      return;
    }
    const fresh = seen ? earned.filter((id) => !seen.includes(id)) : [];
    try {
      localStorage.setItem(key, JSON.stringify([...new Set([...(seen || []), ...earned])]));
    } catch {
      /* storage blocked: just don't celebrate */
    }
    if (fresh.length) setQueue((q) => [...q, ...fresh]);
  }, [badges, userId, ready]);

  useEffect(() => {
    if (!queue.length) return;
    const t = setTimeout(() => setQueue((q) => q.slice(1)), 4200);
    return () => clearTimeout(t);
  }, [queue]);

  const current = badges.find((b) => b.id === queue[0]);
  if (!current) return null;
  return (
    <>
      <Confetti key={current.id} pieces={50} burstKey={current.id} />
      <div className="badgeToast" role="status" key={current.id}>
        <HiBadgeCheck className="btIcon" aria-hidden="true" />
        <div>
          <span className="btEyebrow">Badge unlocked</span>
          <strong>{current.title}</strong>
          <span className="small">{current.text}</span>
        </div>
        <button type="button" aria-label="Close" onClick={() => setQueue((q) => q.slice(1))}><HiX /></button>
      </div>
    </>
  );
}
export default BadgeToast;
