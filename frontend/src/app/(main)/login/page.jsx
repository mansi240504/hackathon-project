"use client";
import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loginform = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);
      axios
        .post("http://localhost:4000/user/authenticate", values)
        .then((result) => {
          toast.success("Login Successfully");
          localStorage.setItem("token", result.data.token);
          localStorage.setItem("role", result.data.user.role);
          resetForm();
        })
        .catch((err) => {
          toast.error("Login Failed");
          console.log(err);
        })
        .finally(() => setIsLoading(false));
    },
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --ink: #0f1117;
          --slate: #3d4452;
          --muted: #8891a4;
          --border: #e2e5ec;
          --surface: #ffffff;
          --accent: #2563eb;
          --accent-dark: #1d4ed8;
          --accent-soft: #eff6ff;
          --success: #059669;
          --error: #dc2626;
        }

        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #f7f8fc;
        }

        /* ── LEFT PANEL ── */
        .left-panel {
          display: none;
          position: relative;
          overflow: hidden;
          background: var(--ink);
        }
        @media (min-width: 900px) {
          .left-panel { display: flex; flex: 1.1; flex-direction: column; justify-content: flex-end; padding: 56px; }
        }

        .left-bg {
          position: absolute; inset: 0;
          background-image: url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80');
          background-size: cover; background-position: center;
          opacity: 0.45;
        }

        .left-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(160deg, rgba(15,17,23,0.3) 0%, rgba(15,17,23,0.85) 70%, rgba(15,17,23,0.97) 100%);
        }

        .left-content { position: relative; z-index: 1; }

        .left-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(8px);
          border-radius: 100px;
          padding: 6px 14px;
          font-size: 12px;
          color: rgba(255,255,255,0.75);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 28px;
        }
        .left-badge span { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; display: block; }

        .left-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 3.5vw, 48px);
          font-weight: 700;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 20px;
        }
        .left-headline em { font-style: italic; color: #93c5fd; }

        .left-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.55);
          line-height: 1.7;
          max-width: 340px;
          margin-bottom: 44px;
        }

        .left-stats {
          display: flex; gap: 36px;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 32px;
        }
        .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 26px; font-weight: 700;
          color: #fff; display: block;
        }
        .stat-label { font-size: 12px; color: rgba(255,255,255,0.4); letter-spacing: 0.04em; }

        /* ── RIGHT PANEL ── */
        .right-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          background: #f7f8fc;
        }

        .form-card {
          width: 100%;
          max-width: 420px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 48px 44px;
          box-shadow: 0 4px 24px rgba(15,17,23,0.06), 0 1px 2px rgba(15,17,23,0.04);
          animation: fadeUp 0.5s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .brand-mark {
          width: 42px; height: 42px;
          background: var(--accent);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 28px;
        }
        .brand-mark svg { width: 22px; height: 22px; fill: white; }

        .form-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px; font-weight: 700;
          color: var(--ink);
          margin-bottom: 6px;
        }
        .form-sub { font-size: 14px; color: var(--muted); margin-bottom: 36px; }

        /* Field */
        .field { margin-bottom: 20px; }
        .field label {
          display: block;
          font-size: 13px; font-weight: 500;
          color: var(--slate);
          margin-bottom: 8px;
          letter-spacing: 0.01em;
        }
        .input-wrap { position: relative; }
        .input-wrap svg {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          width: 16px; height: 16px;
          color: var(--muted);
          pointer-events: none;
        }
        .input-wrap input {
          width: 100%;
          padding: 11px 14px 11px 40px;
          border: 1.5px solid var(--border);
          border-radius: 10px;
          font-size: 14px; font-family: 'DM Sans', sans-serif;
          color: var(--ink);
          background: #fafbfd;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none;
        }
        .input-wrap input:focus {
          border-color: var(--accent);
          background: #fff;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
        }
        .input-wrap input::placeholder { color: #b0b8c8; }
        .toggle-pw {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: var(--muted); padding: 4px; display: flex;
          transition: color 0.2s;
        }
        .toggle-pw:hover { color: var(--accent); }

        /* Row */
        .meta-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 28px;
        }
        .checkbox-label {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: var(--slate); cursor: pointer;
        }
        .checkbox-label input[type=checkbox] {
          width: 15px; height: 15px; accent-color: var(--accent);
          cursor: pointer;
        }
        .forgot-link {
          font-size: 13px; color: var(--accent); text-decoration: none; font-weight: 500;
          transition: color 0.2s;
        }
        .forgot-link:hover { color: var(--accent-dark); }

        /* Submit */
        .submit-btn {
          width: 100%;
          padding: 13px;
          background: var(--accent);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 500;
          border: none; border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 2px 8px rgba(37,99,235,0.25);
          position: relative; overflow: hidden;
        }
        .submit-btn:hover:not(:disabled) {
          background: var(--accent-dark);
          box-shadow: 0 4px 16px rgba(37,99,235,0.35);
          transform: translateY(-1px);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Divider */
        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 24px 0; color: var(--muted); font-size: 12px;
        }
        .divider::before, .divider::after {
          content: ''; flex: 1; height: 1px; background: var(--border);
        }

        /* Social */
        .social-row { display: flex; gap: 12px; }
        .social-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 10px;
          border: 1.5px solid var(--border);
          border-radius: 10px;
          background: #fff;
          font-size: 13px; font-weight: 500; color: var(--slate);
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .social-btn:hover {
          border-color: #c7cfe0;
          background: #fafbfd;
          box-shadow: 0 2px 8px rgba(15,17,23,0.06);
        }
        .social-btn img { width: 18px; height: 18px; }

        /* Footer */
        .signup-row {
          text-align: center; margin-top: 28px;
          font-size: 13px; color: var(--muted);
        }
        .signup-row a {
          color: var(--accent); font-weight: 500; text-decoration: none;
          transition: color 0.2s;
        }
        .signup-row a:hover { color: var(--accent-dark); }

        @media (max-width: 480px) {
          .form-card { padding: 36px 24px; }
        }
      `}</style>

      <div className="login-root">
        {/* Left Panel */}
        <div className="left-panel">
          <div className="left-bg" />
          <div className="left-overlay" />
          <div className="left-content">
            <div className="left-badge">
              <span />
              Trusted Platform
            </div>
            <h1 className="left-headline">
              Your journey
              <br />
              starts <em>here.</em>
            </h1>
            <p className="left-sub">
              Sign in to access your personalized dashboard, manage your work,
              and stay connected with your team.
            </p>
            <div className="left-stats">
              <div>
                <span className="stat-num">50K+</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div>
                <span className="stat-num">99.9%</span>
                <span className="stat-label">Uptime</span>
              </div>
              <div>
                <span className="stat-num">4.9★</span>
                <span className="stat-label">Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          <div className="form-card">
            {/* Brand */}
            <div className="brand-mark">
              <svg viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>

            <h2 className="form-title">Welcome back</h2>
            <p className="form-sub">Enter your credentials to continue</p>

            <form onSubmit={loginform.handleSubmit}>
              {/* Email */}
              <div className="field">
                <label htmlFor="email">Email address</label>
                <div className="input-wrap">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    onChange={loginform.handleChange}
                    value={loginform.values.email}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="field">
                <label htmlFor="password">Password</label>
                <div className="input-wrap">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    onChange={loginform.handleChange}
                    value={loginform.values.password}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="toggle-pw"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Meta */}
              <div className="meta-row">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  Remember me
                </label>
                <a href="#" className="forgot-link">
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="spinner" /> Signing in...
                  </>
                ) : (
                  <>
                    Sign In{" "}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="divider">or continue with</div>

            {/* Social */}
            <div className="social-row">
              <button type="button" className="social-btn">
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                />
                Google
              </button>
              <button type="button" className="social-btn">
                <img
                  src="https://www.svgrepo.com/show/448224/github.svg"
                  alt="GitHub"
                />
                GitHub
              </button>
            </div>

            {/* Signup */}
            <p className="signup-row">
              Don't have an account? <a href="/signup">Create one free</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
