import { useState } from "react";
import { Link } from "react-router-dom";
import { apiPost } from "../config/api";
import "./AuthForms.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const r = await apiPost("api/forgot_password.php", { email: email.trim() });
      if (!r.success) throw new Error(r.message);
      setSent(r.message);
    } catch (err) {
      setError(err.message || "That didn't work. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container login-container">
        <div className="auth-box">
          <h1 className="auth-title">Forgot your password?</h1>
          <p className="auth-subtitle">Enter your email and we&apos;ll send you a link to choose a new one.</p>

          {error && <div className="error-message" role="alert">{error}</div>}

          {sent ? (
            <>
              <div className="success-message" role="status">{sent}</div>
              <p className="auth-note">
                We will never ask for your password, OTP or PIN in an email. The link only lets you choose a new password on this site.
              </p>
            </>
          ) : (
            <form className="auth-form" onSubmit={submit}>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }} required />
              </div>
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          )}

          <div className="auth-footer">
            <p>Remembered it? <Link to="/login" className="auth-link">Log in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ForgotPassword;
