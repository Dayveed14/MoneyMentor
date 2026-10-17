import { useState } from "react";
import { useLocation } from "react-router-dom";
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
        Welcome, {first}. Your account is ready. Take the quick check below and we&apos;ll
        build your learning path.
      </p>
      <button type="button" aria-label="Dismiss" onClick={() => setOpen(false)}>
        <HiX />
      </button>
    </div>
  );
}
export default WelcomeBanner;
