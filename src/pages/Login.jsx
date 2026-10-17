import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiPost } from "../config/api";
import { saveSession, isAdmin } from "../utils/auth";
import "./AuthForms.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "", remember: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiPost("api/login.php", {
        email: formData.email.trim(),
        password: formData.password,
      });

      if (data.success) {
        saveSession(data.user, data.token, formData.remember);
        // Admins go to the dashboard; everyone else back to where they were (or home).
        // Previously everyone was sent to /dashboard, which bounced normal users to /login.
        const from = location.state?.from;
        navigate(isAdmin(data.user) ? from || "/dashboard" : "/", { replace: true });
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container login-container">
        <div className="auth-box">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Log in to continue your financial journey</p>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                <span>Remember me</span>
              </label>
              {/* TODO: point to a reset-password page when it exists */}
              <Link to="/contactUs" className="auth-link">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="auth-link">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
