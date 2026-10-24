import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiPost } from "../config/api";
import "./AuthForms.css";

/** One-click unsubscribe from newsletter and alert emails. */
function Unsubscribe() {
  const [params] = useSearchParams();
  const email = params.get("e") || "";
  const token = params.get("t") || "";
  const [state, setState] = useState(email && token ? "working" : "invalid");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!email || !token) return;
    apiPost("api/unsubscribe.php", { email, token })
      .then((r) => {
        setState(r.success ? "done" : "invalid");
        setMessage(r.message || "");
      })
      .catch((err) => {
        setState("invalid");
        setMessage(err.message);
      });
  }, [email, token]);

  return (
    <div className="auth-page">
      <div className="auth-container login-container">
        <div className="auth-box">
          <h1 className="auth-title">Email preferences</h1>
          {state === "working" && <p className="auth-subtitle">Unsubscribing {email}…</p>}
          {state === "done" && (
            <>
              <div className="success-message" role="status">{email} won&apos;t get any more emails from us.</div>
              <p className="auth-note">You can still check the latest <Link to="/alerts" className="auth-link">scam alerts</Link> on the site any time.</p>
            </>
          )}
          {state === "invalid" && (
            <div className="error-message" role="alert">{message || "This unsubscribe link is invalid."} Contact us if you keep getting emails.</div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Unsubscribe;
