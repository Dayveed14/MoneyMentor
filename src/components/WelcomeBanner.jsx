import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiX } from "react-icons/hi";
import "./WelcomeBanner.css";

/** Shown once on the home page right after someone creates an account. */
function WelcomeBanner() {
  const { state } = useLocation();
  const [open, setOpen] = useState(Boolean(state?.welcome));
  if (!open) return null;
  const first = String(state.welcome).split(" ")[0];
  return (
    <div className="welcomeBanner" role="status">
      <p>
        Welcome, {first}. Your account is ready. A good first step is the{" "}
        <Link to="/savings">Saving strategy</Link> module.
      </p>
      <button type="button" aria-label="Dismiss" onClick={() => setOpen(false)}>
        <HiX />
      </button>
    </div>
  );
}
export default WelcomeBanner;
