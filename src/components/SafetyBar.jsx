import { Link } from "react-router-dom";
import { HiShieldCheck } from "react-icons/hi";
import "./SafetyBar.css";

/** The one message every visitor should leave with, on every page. */
function SafetyBar() {
  return (
    <div className="safetyBar" role="note">
      <HiShieldCheck aria-hidden="true" />
      <p>
        <strong>Your bank will never ask for your OTP, PIN or password.</strong>{" "}
        <span className="safetyMore">If anyone does, hang up.</span>
      </p>
      <Link to="/alerts#check">Check a message</Link>
    </div>
  );
}
export default SafetyBar;
