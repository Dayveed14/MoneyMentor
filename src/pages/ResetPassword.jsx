import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiPost } from "../config/api";
import "./AuthForms.css";

function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("Your new password needs at least 8 characters.");
    if (password !== confirm) return setError("The two passwords don't match.");
    setLoading(true);
    try {
      const r = await apiPost("api/reset_password.php", { token, password });
      if (!r.success) throw new Error(r.message);
      setDone(true);
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
          <h1 className="auth-title">Choose a new password</h1>

          {!token ? (
            <>
              <div className="error-message" role="alert">This link is missing its code. Open the link from your email again, or ask for a new one.</div>
              <div className="auth-footer"><p><Link to="/forgot-password" className="auth-link">Get a new link</Link></p></div>
            </>
          ) : done ? (
            <>
              <div className="success-message" role="status">Password changed. You&apos;ve been signed out everywhere else.</div>
              <Link to="/login" className="auth-btn auth-btn-link">Log in</Link>
            </>
          ) : (
            <>
              <p className="auth-subtitle">Use at least 8 characters. A short sentence is easy to remember and hard to guess.</p>
              {error && (
                <div className="error-message" role="alert">
                  {error}{" "}
                  {/expired|invalid|used/i.test(error) && <Link to="/forgot-password" className="auth-link">Get a new link</Link>}
                </div>
              )}
              <form className="auth-form" onSubmit={submit}>
                <div className="form-group">
                  <label htmlFor="password">New password</label>
                  <input id="password" type="password" autoComplete="new-password" value={password}
                    onChange={(e) => setPassword(e.target.value)} minLength={8} maxLength={72} required />
                </div>
                <div className="form-group">
                  <label htmlFor="confirm">Confirm new password</label>
                  <input id="confirm" type="password" autoComplete="new-password" value={confirm}
                    onChange={(e) => setConfirm(e.target.value)} required />
                </div>
                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? "Saving..." : "Save new password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default ResetPassword;
