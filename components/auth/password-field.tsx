'use client';

import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { cn } from '@/lib/utils/cn';

interface PasswordFieldProps {
  id: string;
  placeholder?: string;
  registration: UseFormRegisterReturn;
  error?: boolean;
  autoComplete?: 'current-password' | 'new-password';
  className?: string;
}

export function PasswordField({
  id,
  placeholder = 'Enter your password',
  registration,
  error,
  autoComplete = 'current-password',
  className,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={cn('auth-field-control', className)}>
      <span className="auth-field-icon" aria-hidden>
        <Lock className="h-4 w-4 text-muted" />
      </span>
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        className={cn('auth-field-input', error && 'border-destructive')}
        autoComplete={autoComplete}
        aria-invalid={error}
        {...registration}
      />
      <button
        type="button"
        className="auth-field-toggle"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
