import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../index.css";

const Login = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      setLoading(true);
      toast.loading("Signing in…", { id: "login" });
      await auth?.login(email, password);
      toast.success("Welcome back!", { id: "login" });
    } catch {
      toast.error("Invalid email or password", { id: "login" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.isLoggedIn && auth.user) navigate("/chat");
  }, [auth?.isLoggedIn, auth?.user]);

  return (
    <div className="auth-page">
      <div className="auth-bg-glow auth-bg-glow-1" />
      <div className="auth-bg-glow auth-bg-glow-2" />

      <div className="auth-card">
        <div className="auth-logo-area">
          <div className="auth-logo-icon">C</div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to continue to CipherGPT</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              className="auth-input"
              placeholder="you@example.com"
              required
              autoComplete="off"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="auth-input"
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
              <Link to="/forgot-password" style={{ fontSize: "12px", color: "var(--accent)", textDecoration: "none" }}>
                Forgot password?
              </Link>
            </div>
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in →"}
          </button>

          <div className="auth-divider"><span>or</span></div>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/signup">Sign up for free</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
