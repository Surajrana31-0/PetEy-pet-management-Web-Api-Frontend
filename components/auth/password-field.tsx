'use client';

import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { cn } from '@/lib/utils/cn';
import { PasswordStrength } from './password-strength';

interface PasswordFieldProps {
  id: string;
  placeholder?: string;
  registration: UseFormRegisterReturn;
  error?: boolean;
  autoComplete?: 'current-password' | 'new-password';
  className?: string;
  showStrength?: boolean;
  passwordValue?: string;
}

export function PasswordField({
  id,
  placeholder = 'Enter your password',
  registration,
  error,
  autoComplete = 'current-password',
  className,
  showStrength = false,
  passwordValue = '',
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={cn('w-full', className)}>
      <div className="auth-input-wrapper relative w-full flex items-center">
        <span className="auth-input-icon-modern" aria-hidden>
          <Lock className="h-4 w-4" />
        </span>
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          className={cn('auth-input-modern !pr-12', error && 'error')}
          autoComplete={autoComplete}
          aria-invalid={error}
          {...registration}
        />
        <button
          type="button"
          className="auth-password-toggle absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors z-10"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {showStrength && <PasswordStrength password={passwordValue} />}
    </div>
  );
}
