import { useInView } from "./hooks";

/** Fades and lifts its children in when they scroll into view. */
function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const [ref, seen] = useInView({ threshold: 0.15 });
  return (
    <Tag ref={ref} className={`reveal ${seen ? "in" : ""} ${className}`} style={{ "--d": `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}
export default Reveal;
