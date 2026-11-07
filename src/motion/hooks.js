import { useEffect, useRef, useState } from "react";

/*
 * Small animation helpers. No library: CSS does the drawing, these hooks
 * only decide when. Everything respects the phone's "reduce motion" setting.
 */

const query = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.(query).matches;
}

/** True when the visitor asked their device for less motion. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion);
  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return;
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

const ease = (t) => 1 - Math.pow(1 - t, 3); // ease-out cubic

/**
 * Animates a number from its previous value to `target`.
 * Returns the current value to render.
 */
export function useCountUp(target, { duration = 900, start = true } = {}) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced || !start ? target : 0);
  const fromRef = useRef(value);

  useEffect(() => {
    if (!start) return;
    if (reduced) {
      setValue(target);
      fromRef.current = target;
      return;
    }
    const from = fromRef.current;
    if (from === target) return;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const v = from + (target - from) * ease(p);
      setValue(v);
      fromRef.current = v;
      if (p < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start, reduced]);

  return value;
}

/** Becomes true once the element scrolls into view (and stays true). */
export function useInView(options = { threshold: 0.25 }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (!("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setSeen(true);
        io.disconnect();
      }
    }, options);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen]);
  return [ref, seen];
}

/** Short vibration on phones that support it (ignored elsewhere). */
export function buzz(pattern = 18) {
  try {
    if (!prefersReducedMotion()) navigator.vibrate?.(pattern);
  } catch {
    /* not supported */
  }
}
