import { HiOutlineSparkles } from "react-icons/hi";
import Reveal from "../motion/Reveal";
import "./widgets.css";

/** The frame every lesson widget sits in. */
function TryIt({ title, hint, children }) {
  return (
    <Reveal as="section" className="tryIt" aria-label={`Try it: ${title}`}>
      <div className="tryHead">
        <span className="tryTag"><HiOutlineSparkles aria-hidden="true" /> Try it</span>
        <h3>{title}</h3>
        {hint && <p>{hint}</p>}
      </div>
      {children}
    </Reveal>
  );
}
export default TryIt;

/** Labelled range slider with the current value shown. */
export function Slider({ label, value, min, max, step = 1, onChange, format = (v) => v }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="trySlider">
      <span className="tsTop"><span>{label}</span><strong className="num">{format(value)}</strong></span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))} style={{ "--p": `${pct}%` }} />
    </label>
  );
}
