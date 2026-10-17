import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * - New page  → start at the top.
 * - URL with a hash (/#articles) → scroll to that section once it exists,
 *   so nav links work the same from any page.
 */
function ScrollManager() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    let tries = 0;
    let timer;
    const go = () => {
      const el = document.getElementById(hash.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else if (tries++ < 20) timer = setTimeout(go, 50); // wait for the page to render
    };
    go();
    return () => clearTimeout(timer);
  }, [pathname, hash, key]);

  return null;
}
export default ScrollManager;
