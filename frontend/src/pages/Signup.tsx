import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../index.css";

const Signup = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      setLoading(true);
      toast.loading("Creating account…", { id: "signup" });
      await auth?.signup(name, email, password);
      toast.success("Account created! Welcome 🎉", { id: "signup" });
    } catch {
      toast.error("Sign up failed. Please try again.", { id: "signup" });
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
          <h1 className="auth-title">Create an account</h1>
          <p className="auth-subtitle">Get started with CipherGPT for free</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              type="text"
              className="auth-input"
              placeholder="John Doe"
              required
              autoComplete="off"
            />
          </div>

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
              placeholder="Create a strong password"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Creating account…" : "Create account →"}
          </button>

          <div className="auth-divider"><span>or</span></div>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
