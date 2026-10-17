import { useEffect, useState } from "react";

/** Returns the id of the home-page section currently in view (scroll-spy). */
export function useActiveSection(ids, enabled) {
  const [active, setActive] = useState("");

  useEffect(() => {
    if (!enabled) return;
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      // a thin band across the upper middle of the screen decides the active section
      { rootMargin: "-35% 0px -60% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    const onTop = () => window.scrollY < 200 && setActive("");
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, [ids, enabled]);

  return enabled ? active : "";
}
