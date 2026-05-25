"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [showPassword, setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirm]  = useState(false);
  const [isLoading, setIsLoading]              = useState(false);
  const [agreed, setAgreed]                    = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    // TODO Sprint 2: connect to POST /api/auth/register
    setTimeout(() => setIsLoading(false), 1500);
  }

  return (
    <div className="auth-page-wrapper">

      {/* Paw icon */}
      <div className="auth-top-icon">
        <svg width="52" height="52" viewBox="0 0 64 64" fill="none">
          <ellipse cx="16" cy="18" rx="7" ry="9" fill="#E8724A" opacity=".85"/>
          <ellipse cx="32" cy="12" rx="7" ry="9" fill="#E8724A" opacity=".85"/>
          <ellipse cx="48" cy="18" rx="7" ry="9" fill="#E8724A" opacity=".85"/>
          <path d="M32 56C20 56 12 46 12 38c0-6 4-10 10-10h20c6 0 10 4 10 10 0 8-8 18-20 18z" fill="#E8724A" opacity=".85"/>
          <ellipse cx="24" cy="42" rx="3" ry="4" fill="#fff" opacity=".4"/>
          <ellipse cx="40" cy="42" rx="3" ry="4" fill="#fff" opacity=".4"/>
        </svg>
      </div>

      <h1 className="auth-heading">Create Account</h1>
      <p className="auth-subheading">
        Join Pet-Ey and start your journey to find your perfect furry companion.
      </p>

      {/* Card */}
      <div className="auth-card">
        <form onSubmit={handleSubmit} noValidate>

          {/* Full Name */}
          <div className="auth-field">
            <label htmlFor="fullName" className="auth-label">Full Name</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="#E8724A" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                id="fullName" name="fullName" type="text"
                required autoComplete="name"
                placeholder="Enter your full name"
                className="auth-input"
              />
            </div>
          </div>

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="email" className="auth-label">Email Address</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="#E8724A" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <input
                id="email" name="email" type="email"
                required autoComplete="email"
                placeholder="Enter your email"
                className="auth-input"
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="password" className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="#E8724A" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                id="password" name="password"
                type={showPassword ? "text" : "password"}
                required autoComplete="new-password"
                placeholder="Create a password"
                className="auth-input auth-input--padded-right"
              />
              <button
                type="button" className="auth-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="#888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="#888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <label htmlFor="confirmPassword" className="auth-label">Confirm Password</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="#E8724A" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </span>
              <input
                id="confirmPassword" name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required autoComplete="new-password"
                placeholder="Confirm your password"
                className="auth-input auth-input--padded-right"
              />
              <button
                type="button" className="auth-eye-btn"
                onClick={() => setShowConfirm(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="#888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="#888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Terms agreement */}
          <div className="auth-row auth-row--top" style={{ marginBottom: "24px" }}>
            <label className="auth-checkbox-label">
              <span
                className={`auth-checkbox-box ${agreed ? "auth-checkbox-box--checked" : ""}`}
                onClick={() => setAgreed(!agreed)}
                role="checkbox" aria-checked={agreed}
                tabIndex={0} onKeyDown={(e) => e.key === " " && setAgreed(!agreed)}
              >
                {agreed && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </span>
              <span className="auth-checkbox-text">
                I agree to the{" "}
                <Link href="/terms" className="auth-forgot-link">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="auth-forgot-link">Privacy Policy</Link>
              </span>
            </label>
          </div>

          {/* Submit */}
          <button type="submit" className="auth-submit-btn" disabled={isLoading || !agreed}>
            {isLoading ? (
              <span className="auth-spinner" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            )}
            {isLoading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        {/* Switch to login */}
        <p className="auth-switch">
          Already have an account?{" "}
          <Link href="/login" className="auth-switch-link">Sign in →</Link>
        </p>
      </div>

      {/* Below card */}
      <div className="auth-below-links">
        <Link href="/terms"   className="auth-below-link">Terms of Service</Link>
        <Link href="/privacy" className="auth-below-link">Privacy Policy</Link>
      </div>
    </div>
  );
}