"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember]         = useState(true);
  const [isLoading, setIsLoading]       = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    // TODO Sprint 2: replace with NextAuth signIn("credentials", { email, password })
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

      <h1 className="auth-heading">Welcome Back!</h1>
      <p className="auth-subheading">
        Sign in to your Pet-Ey account to continue your pet adoption journey.
      </p>

      {/* Card */}
      <div className="auth-card">
        <form onSubmit={handleSubmit} noValidate>

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
                required autoComplete="current-password"
                placeholder="Enter your password"
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

          {/* Remember + Forgot */}
          <div className="auth-row">
            <label className="auth-checkbox-label">
              <span
                className={`auth-checkbox-box ${remember ? "auth-checkbox-box--checked" : ""}`}
                onClick={() => setRemember(!remember)}
                role="checkbox" aria-checked={remember}
                tabIndex={0} onKeyDown={(e) => e.key === " " && setRemember(!remember)}
              >
                {remember && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </span>
              <span className="auth-checkbox-text">Remember me</span>
            </label>
            <Link href="/forgot-password" className="auth-forgot-link">
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading ? (
              <span className="auth-spinner" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            )}
            {isLoading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Switch link */}
        <p className="auth-switch">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="auth-switch-link">Sign up for free</Link>
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