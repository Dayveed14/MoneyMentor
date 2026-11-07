import { useCountUp } from "../../motion/hooks";

/** Circular progress meter with the count in the middle. Fills up when it appears. */
function ProgressRing({ value, total, label, size = 132 }) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const shown = useCountUp(value, { duration: 1000 });
  const pct = total ? Math.min(1, shown / total) : 0;
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--mint-deep)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--growth)" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ringText">
        <strong className="num">{Math.round(shown)}/{total}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}
export default ProgressRing;
