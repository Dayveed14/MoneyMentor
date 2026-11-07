import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiMenuAlt3, HiX, HiChevronDown } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import { useActiveSection } from "../hooks/useActiveSection";
import logo from "../assets/images/logo.png";
import { DEBT, INVESTING, PLANNING } from "../data/modulesMore";
import "./Navigation.css";

const SECTIONS = ["modules", "articles", "about"];

const MODULE_LINKS = [
  { to: "/savings", label: "Saving strategy", note: "Build an emergency fund and a plan that sticks" },
  { to: "/budget", label: "Budgeting & expense tracking", note: "Know where your money goes each month" },
  { to: "/finlit", label: "Financial literacy 101", note: "Interest, credit and staying safe from fraud" },
  ...[DEBT, INVESTING, PLANNING].map((m) => ({ to: m.page, label: m.title, note: m.topics.join(", ") })),
];

const SAFE_LINKS = [
  { to: "/alerts", label: "Scam alerts", note: "Scams going around right now" },
  { to: "/simulator", label: "Scam simulator", note: "Can you spot the scam? Play and see" },
  { to: "/verify", label: "Check before you trust", note: "A message, a loan app or an investment" },
  { to: "/help-now", label: "Got scammed?", note: "What to do in the first hour" },
  { to: "/report", label: "Report a scam", note: "Help us warn other people" },
  { to: "/questions", label: "Ask an expert", note: "Questions answered by our team" },
];

// Which nav item should light up on each standalone page
const PAGE_SECTION = {
  "/modules": "modules", "/savings": "modules", "/budget": "modules", "/finlit": "modules", "/module/debt": "modules", "/module/investing": "modules", "/module/planning": "modules",
  "/articles": "articles", "/about": "about",
  "/alerts": "safe", "/verify": "safe", "/help-now": "safe", "/report": "safe", "/questions": "safe", "/simulator": "safe",
};

function Navigation() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const onHome = pathname === "/";
  const spy = useActiveSection(SECTIONS, onHome);
  const current = onHome ? spy : PAGE_SECTION[pathname] || (pathname.startsWith("/article/") ? "articles" : "");

  const [open, setOpen] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [safeOpen, setSafeOpen] = useState(false);
  const safeRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    if (!modulesOpen && !accountOpen && !safeOpen) return;
    const onDown = (e) => {
      if (!dropRef.current?.contains(e.target)) setModulesOpen(false);
      if (!safeRef.current?.contains(e.target)) setSafeOpen(false);
      if (!accountRef.current?.contains(e.target)) setAccountOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setModulesOpen(false);
        setSafeOpen(false);
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [modulesOpen, accountOpen, safeOpen]);

  const close = () => {
    setOpen(false);
    setModulesOpen(false);
    setSafeOpen(false);
    setAccountOpen(false);
  };
  const initials = (user?.name || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
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
          <div className={`navDrop ${safeOpen ? "open" : ""}`} ref={safeRef}>
            <div className="navDropTrigger">
              <Link to="/alerts" className={cls("safe")} onClick={close}>
                Stay safe
              </Link>
              <button
                type="button"
                className="navChevron"
                aria-label="Show safety tools"
                aria-expanded={safeOpen}
                onClick={() => setSafeOpen((o) => !o)}>
                <HiChevronDown size={18} />
              </button>
            </div>
            <div className="navMenu">
              {SAFE_LINKS.map((m) => (
                <Link key={m.to} to={m.to} className="navMenuItem" onClick={close}>
                  <strong>{m.label}</strong>
                  <span>{m.note}</span>
                </Link>
              ))}
            </div>
          </div>
          <Link to="/#about" className={cls("about")} onClick={close}>
            About
          </Link>
          <Link to="/contactUs" className={pathname === "/contactUs" ? "navLink active" : "navLink"} onClick={close}>
            Contact
          </Link>

          {user ? (
            <div className={`navAccount ${accountOpen ? "open" : ""}`} ref={accountRef}>
              <button
                type="button"
                className="navAccountBtn"
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                onClick={() => setAccountOpen((o) => !o)}>
                <span className="navAvatar" aria-hidden="true">{initials}</span>
                <span className="navAccountName">{user.name?.split(" ")[0]}</span>
                <HiChevronDown size={16} aria-hidden="true" />
              </button>
              <div className="navAccountMenu" role="menu">
                <p className="navAccountWho">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </p>
                <Link to="/account" role="menuitem" onClick={close}>My dashboard</Link>
                <Link to="/account/modules" role="menuitem" onClick={close}>My modules</Link>
                <Link to="/account/budget" role="menuitem" onClick={close}>Budget planner</Link>
                <Link to="/account/spending" role="menuitem" onClick={close}>Spending tracker</Link>
                <Link to="/account/questions" role="menuitem" onClick={close}>My questions</Link>
                <Link to="/account/settings" role="menuitem" onClick={close}>Settings</Link>
                {isAdmin && <Link to="/dashboard" role="menuitem" onClick={close}>Admin dashboard</Link>}
                <button type="button" role="menuitem" className="navLogout" onClick={() => { close(); logout(); if (pathname === "/login") navigate("/"); }}>
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className={pathname === "/login" ? "navLink navLogin active" : "navLink navLogin"} onClick={close}>
                Log in
              </Link>
              <Link to="/signup" className={`navCta ${pathname === "/signup" ? "active" : ""}`} onClick={close}>
                Start free
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
export default Navigation;
