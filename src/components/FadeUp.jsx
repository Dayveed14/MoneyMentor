// Lightweight CSS replacement for the framer-motion slide-up animation.
function FadeUp({ as: Tag = "div", className = "", children }) {
  return <Tag className={`fade-up ${className}`.trim()}>{children}</Tag>;
}
export default FadeUp;
