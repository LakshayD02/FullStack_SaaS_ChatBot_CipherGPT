import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { requestPasswordOTP, resetPassword } from "../helpers/api-communicator";
import { useNavigate, Link } from "react-router-dom";
import "../index.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Reset Password
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      setLoading(true);
      toast.loading("Sending code…", { id: "otp" });
      await requestPasswordOTP(email);
      toast.success("Verification code sent to your email!", { id: "otp" });
      setStep(2);
    } catch {
      toast.error("Failed to send code. Please try again.", { id: "otp" });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword) return;
    try {
      setLoading(true);
      toast.loading("Resetting password…", { id: "reset" });
      await resetPassword({ email, otp, newPassword });
      toast.success("Password reset successfully! Please log in.", { id: "reset" });
      navigate("/login");
    } catch {
      toast.error("Invalid code or reset failed. Try again.", { id: "reset" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-glow auth-bg-glow-1" />
      <div className="auth-bg-glow auth-bg-glow-2" />

      <div className="auth-card">
        <div className="auth-logo-area">
          <div className="auth-logo-icon">C</div>
          <h1 className="auth-title">Reset password</h1>
          <p className="auth-subtitle">
            {step === 1
              ? "We'll send a 6-digit verification code to your email"
              : "Enter the code and set your new password"}
          </p>
        </div>

        {step === 1 ? (
          <form className="auth-form" onSubmit={handleSendOTP} autoComplete="off">
            <div className="auth-field">
              <label className="auth-label" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
              />
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Sending code…" : "Send verification code →"}
            </button>

            <p className="auth-switch">
              Remember your password? <Link to="/login">Sign in</Link>
            </p>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleResetPassword} autoComplete="off">
            <div className="auth-field">
              <label className="auth-label" htmlFor="otp">Verification Code</label>
              <input
                id="otp"
                type="text"
                maxLength={6}
                className="auth-input"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                autoComplete="off"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                className="auth-input"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Resetting…" : "Reset password →"}
            </button>

            <button
              type="button"
              className="btn btn-ghost"
              style={{ width: "100%", marginTop: 8 }}
              onClick={() => setStep(1)}
              disabled={loading}
            >
              ← Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
