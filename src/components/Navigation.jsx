import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMenuAlt3, HiX, HiChevronDown } from "react-icons/hi";
import { useActiveSection } from "../hooks/useActiveSection";
import logo from "../assets/images/logo.png";
import "./Navigation.css";

const SECTIONS = ["modules", "articles", "about"];

const MODULE_LINKS = [
  { to: "/savings", label: "Saving strategy", note: "Build an emergency fund and a plan that sticks" },
  { to: "/budget", label: "Budgeting & expense tracking", note: "Know where your money goes each month" },
  { to: "/finlit", label: "Financial literacy 101", note: "Interest, credit and staying safe from fraud" },
];

// Which nav item should light up on each standalone page
const PAGE_SECTION = {
  "/modules": "modules", "/savings": "modules", "/budget": "modules", "/finlit": "modules",
  "/articles": "articles", "/about": "about",
};

function Navigation() {
  const { pathname } = useLocation();
  const onHome = pathname === "/";
  const spy = useActiveSection(SECTIONS, onHome);
  const current = onHome ? spy : PAGE_SECTION[pathname] || (pathname.startsWith("/article/") ? "articles" : "");

  const [open, setOpen] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the dropdown on outside click or Escape
  useEffect(() => {
    if (!modulesOpen) return;
    const onDown = (e) => !dropRef.current?.contains(e.target) && setModulesOpen(false);
    const onKey = (e) => e.key === "Escape" && setModulesOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [modulesOpen]);

  const close = () => {
    setOpen(false);
    setModulesOpen(false);
  };
  const cls = (id) => (current === id ? "navLink active" : "navLink");

  return (
    <header className={`mainNav ${scrolled ? "scrolled" : ""} ${open ? "menu-open" : ""}`}>
      <div className="navInner">
        <Link to="/" className="navLogo" onClick={close}>
          <img src={logo} alt="MoneyMentor home" width="197" height="47" />
        </Link>

        <button
          type="button"
          className="navToggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="main-menu"
          onClick={() => setOpen((o) => !o)}>
          {open ? <HiX size={26} /> : <HiMenuAlt3 size={26} />}
        </button>

        <nav id="main-menu" className="navRight" aria-label="Main">
          <Link to="/" className={onHome && !current ? "navLink active" : "navLink"} onClick={close}>
            Home
          </Link>

          <div className={`navDrop ${modulesOpen ? "open" : ""}`} ref={dropRef}>
            <div className="navDropTrigger">
              {/* Label scrolls to the section; chevron opens the module list */}
              <Link to="/#modules" className={cls("modules")} onClick={close}>
                Modules
              </Link>
              <button
                type="button"
                className="navChevron"
                aria-label="Show modules"
                aria-expanded={modulesOpen}
                onClick={() => setModulesOpen((o) => !o)}>
                <HiChevronDown size={18} />
              </button>
            </div>
            <div className="navMenu">
              {MODULE_LINKS.map((m) => (
                <Link key={m.to} to={m.to} className="navMenuItem" onClick={close}>
                  <strong>{m.label}</strong>
                  <span>{m.note}</span>
                </Link>
              ))}
              <Link to="/modules" className="navMenuAll" onClick={close}>
                See all modules
              </Link>
            </div>
          </div>

          <Link to="/#articles" className={cls("articles")} onClick={close}>
            Articles
          </Link>
          <Link to="/#about" className={cls("about")} onClick={close}>
            About
          </Link>
          <Link to="/contactUs" className={`navCta ${pathname === "/contactUs" ? "active" : ""}`} onClick={close}>
            Contact us
          </Link>
        </nav>
      </div>
    </header>
  );
}
export default Navigation;
