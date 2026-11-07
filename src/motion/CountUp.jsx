import { useCountUp, useInView } from "./hooks";

/** A number that counts up when it scrolls into view. */
function CountUp({ value, format = (n) => Math.round(n).toLocaleString(), duration, className }) {
  const [ref, seen] = useInView();
  const v = useCountUp(value, { duration, start: seen });
  return <span ref={ref} className={className}>{format(seen ? v : 0)}</span>;
}
export default CountUp;
