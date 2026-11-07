import { useMemo } from "react";
import { useReducedMotion } from "./hooks";
import "./motion.css";

const COLORS = ["#e8b54a", "#2f9e6e", "#0b8bb5", "#0f3d33", "#f3cf7a", "#7fd1a8"];

/** A one-off burst of paper confetti. Pure CSS; nothing runs after it lands. */
function Confetti({ pieces = 70, burstKey = 0 }) {
  const reduced = useReducedMotion();
  const bits = useMemo(
    () =>
      Array.from({ length: pieces }, (_, i) => ({
        id: `${burstKey}-${i}`,
        left: Math.random() * 100,
        delay: Math.random() * 0.25,
        dur: 1.6 + Math.random() * 1.2,
        drift: (Math.random() - 0.5) * 220,
        spin: (Math.random() - 0.5) * 900,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 10,
        color: COLORS[i % COLORS.length],
        round: Math.random() < 0.3,
      })),
    [pieces, burstKey]
  );
  if (reduced) return null;
  return (
    <div className="confetti" aria-hidden="true">
      {bits.map((b) => (
        <span
          key={b.id}
          style={{
            left: `${b.left}%`,
            width: b.w,
            height: b.round ? b.w : b.h,
            borderRadius: b.round ? "50%" : 2,
            background: b.color,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.dur}s`,
            "--drift": `${b.drift}px`,
            "--spin": `${b.spin}deg`,
          }}
        />
      ))}
    </div>
  );
}
export default Confetti;
