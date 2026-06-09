'use client';

import { useState } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface PasswordInputProps {
  id: string;
  placeholder: string;
  registration: UseFormRegisterReturn;
}

function EyeOpenIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function PasswordInput({ id, placeholder, registration }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="auth-field-control">
      <span className="auth-field-icon" aria-hidden>🔒</span>
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        className="auth-field-input"
        autoComplete={id === 'confirmPassword' ? 'new-password' : 'current-password'}
        {...registration}
      />
      <button
        type="button"
        className="auth-field-toggle"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
      >
        {visible ? <EyeClosedIcon /> : <EyeOpenIcon />}
      </button>
    </div>
  );
}
