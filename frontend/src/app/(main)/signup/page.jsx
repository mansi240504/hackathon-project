'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const signupForm = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user'
    },
    onSubmit: (values, { resetForm }) => {
      if (values.password !== values.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      setIsLoading(true);
      axios.post('http://localhost:4000/user/add', {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role
      })
        .then(() => {
          toast.success("Account created successfully!");
          resetForm();
        })
        .catch(err => {
          toast.error("Signup failed. Please try again.");
          console.log(err);
        })
        .finally(() => setIsLoading(false));
    },
  });

  const passwordMatch =
    signupForm.values.confirmPassword.length > 0 &&
    signupForm.values.password === signupForm.values.confirmPassword;

  const passwordMismatch =
    signupForm.values.confirmPassword.length > 0 &&
    signupForm.values.password !== signupForm.values.confirmPassword;

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
          --bg: #f7f8fc;
        }

        .su-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
        }

        /* ── LEFT PANEL ── */
        .su-left {
          display: none;
          position: relative;
          overflow: hidden;
          background: #080a14;
        }
        @media (min-width: 960px) {
          .su-left { display: flex; flex: 1; flex-direction: column; justify-content: flex-end; padding: 56px; }
        }

        .su-left-bg {
          position: absolute; inset: 0;
          background-image: url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&q=80');
          background-size: cover; background-position: center;
          opacity: 0.4;
        }
        .su-left-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(160deg, rgba(8,10,20,0.2) 0%, rgba(8,10,20,0.8) 60%, rgba(8,10,20,0.98) 100%);
        }
        .su-left-content { position: relative; z-index: 1; }

        .su-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(8px);
          border-radius: 100px;
          padding: 6px 14px;
          font-size: 12px; color: rgba(255,255,255,0.7);
          letter-spacing: 0.06em; text-transform: uppercase;
          margin-bottom: 28px;
        }
        .su-badge span { width: 6px; height: 6px; border-radius: 50%; background: #818cf8; display: block; }

        .su-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(30px, 3vw, 44px); font-weight: 700;
          color: #fff; line-height: 1.2; margin-bottom: 18px;
        }
        .su-headline em { font-style: italic; color: #93c5fd; }

        .su-sub {
          font-size: 14.5px; color: rgba(255,255,255,0.5);
          line-height: 1.7; max-width: 320px; margin-bottom: 44px;
        }

        .su-steps {
          display: flex; flex-direction: column; gap: 16px;
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 32px;
        }
        .su-step {
          display: flex; align-items: center; gap: 14px;
        }
        .su-step-num {
          width: 28px; height: 28px; flex-shrink: 0;
          border-radius: 50%;
          background: rgba(99,102,241,0.2);
          border: 1px solid rgba(99,102,241,0.4);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 600; color: #818cf8;
        }
        .su-step-text { font-size: 13px; color: rgba(255,255,255,0.5); }
        .su-step-text strong { color: rgba(255,255,255,0.85); font-weight: 500; display: block; }

        /* ── RIGHT PANEL ── */
        .su-right {
          flex: 1; display: flex;
          align-items: center; justify-content: center;
          padding: 40px 24px;
          background: var(--bg);
          overflow-y: auto;
        }

        .su-card {
          width: 100%; max-width: 440px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 44px 40px;
          box-shadow: 0 4px 24px rgba(15,17,23,0.06), 0 1px 2px rgba(15,17,23,0.04);
          animation: fadeUp 0.5s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .su-brand {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #6366f1, #2563eb);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
        }
        .su-brand svg { width: 20px; height: 20px; fill: white; }

        .su-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px; font-weight: 700;
          color: var(--ink); margin-bottom: 4px;
        }
        .su-subtitle { font-size: 13.5px; color: var(--muted); margin-bottom: 28px; }
        .su-subtitle a { color: var(--accent); text-decoration: none; font-weight: 500; }
        .su-subtitle a:hover { color: var(--accent-dark); }

        /* Google btn */
        .su-google {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;
          padding: 10px 16px;
          border: 1.5px solid var(--border);
          border-radius: 10px; background: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500; color: var(--slate);
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .su-google:hover {
          border-color: #c7cfe0; background: #fafbfd;
          box-shadow: 0 2px 8px rgba(15,17,23,0.06);
        }
        .su-google img { width: 18px; height: 18px; }

        /* Divider */
        .su-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 20px 0; color: var(--muted); font-size: 12px;
        }
        .su-divider::before, .su-divider::after {
          content: ''; flex: 1; height: 1px; background: var(--border);
        }

        /* Field */
        .su-field { margin-bottom: 16px; }
        .su-field label {
          display: block; font-size: 13px; font-weight: 500;
          color: var(--slate); margin-bottom: 7px; letter-spacing: 0.01em;
        }
        .su-input-wrap { position: relative; }
        .su-input-wrap .field-icon {
          position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
          width: 15px; height: 15px; color: var(--muted); pointer-events: none;
        }
        .su-input-wrap input,
        .su-input-wrap select {
          width: 100%;
          padding: 10px 14px 10px 38px;
          border: 1.5px solid var(--border);
          border-radius: 10px;
          font-size: 13.5px; font-family: 'DM Sans', sans-serif;
          color: var(--ink); background: #fafbfd;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none; appearance: none;
        }
        .su-input-wrap input:focus,
        .su-input-wrap select:focus {
          border-color: var(--accent); background: #fff;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
        }
        .su-input-wrap input.error { border-color: #ef4444; }
        .su-input-wrap input.error:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }
        .su-input-wrap input.success { border-color: #10b981; }
        .su-input-wrap input.success:focus { box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }
        .su-input-wrap input::placeholder { color: #b0b8c8; }

        .su-toggle {
          position: absolute; right: 11px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: var(--muted); padding: 4px; display: flex;
          transition: color 0.2s;
        }
        .su-toggle:hover { color: var(--accent); }

        .su-status-icon {
          position: absolute; right: 36px; top: 50%; transform: translateY(-50%);
          width: 16px; height: 16px;
        }

        .su-error-msg {
          font-size: 12px; color: #ef4444;
          margin-top: 5px; display: flex; align-items: center; gap: 4px;
        }

        /* Role pills */
        .su-roles { display: flex; gap: 10px; }
        .su-role-pill {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 10px 14px;
          border: 1.5px solid var(--border);
          border-radius: 10px; background: #fafbfd;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; font-weight: 500; color: var(--muted);
          cursor: pointer; transition: all 0.2s;
          user-select: none;
        }
        .su-role-pill.active {
          border-color: var(--accent);
          background: #eff6ff; color: var(--accent);
          box-shadow: 0 0 0 3px rgba(37,99,235,0.08);
        }
        .su-role-pill svg { width: 15px; height: 15px; }

        /* Two col */
        .su-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 480px) { .su-row { grid-template-columns: 1fr; } }

        /* Terms */
        .su-terms {
          display: flex; align-items: flex-start; gap: 10px;
          margin: 18px 0;
        }
        .su-terms input[type=checkbox] {
          width: 15px; height: 15px; accent-color: var(--accent);
          margin-top: 2px; flex-shrink: 0; cursor: pointer;
        }
        .su-terms label {
          font-size: 12.5px; color: var(--muted); line-height: 1.5; cursor: pointer;
        }
        .su-terms a { color: var(--accent); text-decoration: none; font-weight: 500; }

        /* Submit */
        .su-submit {
          width: 100%; padding: 12px;
          background: var(--accent); color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14.5px; font-weight: 500;
          border: none; border-radius: 10px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 2px 10px rgba(37,99,235,0.25);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .su-submit:hover:not(:disabled) {
          background: var(--accent-dark);
          box-shadow: 0 4px 18px rgba(37,99,235,0.35);
          transform: translateY(-1px);
        }
        .su-submit:disabled { opacity: 0.7; cursor: not-allowed; }

        .spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 480px) {
          .su-card { padding: 32px 20px; }
        }
      `}</style>

      <div className="su-root">
        {/* Left */}
        <div className="su-left">
          <div className="su-left-bg" />
          <div className="su-left-overlay" />
          <div className="su-left-content">
            <div className="su-badge"><span />Join the Community</div>
            <h1 className="su-headline">
              Build. Compete.<br /><em>Conquer.</em>
            </h1>
            <p className="su-sub">
              Create your free account and start participating in hackathons, solving challenges, and connecting with developers worldwide.
            </p>
            <div className="su-steps">
              {[
                { n: '01', title: 'Create your account', sub: 'Takes less than 2 minutes' },
                { n: '02', title: 'Join a hackathon', sub: 'Browse open competitions' },
                { n: '03', title: 'Build & submit', sub: 'Showcase your skills' },
              ].map(s => (
                <div className="su-step" key={s.n}>
                  <div className="su-step-num">{s.n}</div>
                  <div className="su-step-text">
                    <strong>{s.title}</strong>
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="su-right">
          <div className="su-card">
            <div className="su-brand">
              <svg viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>

            <h2 className="su-title">Create account</h2>
            <p className="su-subtitle">
              Already have an account? <a href="/login">Sign in</a>
            </p>

            {/* Google */}
            <button type="button" className="su-google" onClick={() => window.location.href='https://accounts.google.com/'}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
              Continue with Google
            </button>

            <div className="su-divider">or register with email</div>

            <form onSubmit={signupForm.handleSubmit}>
              {/* Name + Email row */}
              <div className="su-row">
                <div className="su-field">
                  <label htmlFor="name">Full Name</label>
                  <div className="su-input-wrap">
                    <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    <input id="name" type="text" name="name" placeholder="John Doe"
                      onChange={signupForm.handleChange} value={signupForm.values.name} required />
                  </div>
                </div>

                <div className="su-field">
                  <label htmlFor="email">Email Address</label>
                  <div className="su-input-wrap">
                    <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <input id="email" type="email" name="email" placeholder="you@example.com"
                      onChange={signupForm.handleChange} value={signupForm.values.email} required />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="su-field">
                <label htmlFor="password">Password</label>
                <div className="su-input-wrap">
                  <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input id="password" type={showPassword ? 'text' : 'password'} name="password"
                    placeholder="Min. 8 characters"
                    onChange={signupForm.handleChange} value={signupForm.values.password} required />
                  <button type="button" className="su-toggle" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                    {showPassword
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="su-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="su-input-wrap">
                  <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <input id="confirmPassword" type={showConfirm ? 'text' : 'password'} name="confirmPassword"
                    placeholder="Re-enter password"
                    className={passwordMatch ? 'success' : passwordMismatch ? 'error' : ''}
                    onChange={signupForm.handleChange} value={signupForm.values.confirmPassword} required />
                  {passwordMatch && (
                    <svg className="su-status-icon" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                  <button type="button" className="su-toggle" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}>
                    {showConfirm
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
                {passwordMismatch && (
                  <p className="su-error-msg">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    Passwords do not match
                  </p>
                )}
              </div>

              {/* Role */}
              <div className="su-field">
                <label>I am joining as</label>
                <div className="su-roles">
                  <div
                    className={`su-role-pill ${signupForm.values.role === 'user' ? 'active' : ''}`}
                    onClick={() => signupForm.setFieldValue('role', 'user')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    Participant
                  </div>
                  <div
                    className={`su-role-pill ${signupForm.values.role === 'company' ? 'active' : ''}`}
                    onClick={() => signupForm.setFieldValue('role', 'company')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                    </svg>
                    Company
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="su-terms">
                <input id="terms" type="checkbox" required />
                <label htmlFor="terms">
                  I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                </label>
              </div>

              {/* Submit */}
              <button type="submit" className="su-submit" disabled={isLoading}>
                {isLoading
                  ? <><div className="spinner" /> Creating account...</>
                  : <>Create Account <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;