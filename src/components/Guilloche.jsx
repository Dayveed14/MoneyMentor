// Engraved-banknote line pattern, drawn once as an SVG.
const W = 1200;
const H = 600;

function wave(i, total) {
  const pts = [];
  const amp = 40 + i * 4;
  const phase = (i / total) * Math.PI * 2;
  const mid = H / 2 + (i - total / 2) * 7;
  for (let x = 0; x <= W; x += 12) {
    const t = (x / W) * Math.PI * 4;
    const y = mid + Math.sin(t + phase) * amp * Math.sin(x / W * Math.PI) + Math.sin(t * 2.5 - phase) * 12;
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return `M${pts.join(" L")}`;
}

const PATHS = Array.from({ length: 28 }, (_, i) => wave(i, 28));

function Guilloche({ className = "" }) {
  return (
    <svg className={`guilloche ${className}`} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
      {PATHS.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}
export default Guilloche;
