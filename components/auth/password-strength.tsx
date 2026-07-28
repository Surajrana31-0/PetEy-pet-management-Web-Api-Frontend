'use client';

import { cn } from '@/lib/utils/cn';

export type StrengthLevel = 'weak' | 'medium' | 'strong' | 'none';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

const strengthMessages: Record<StrengthLevel, string> = {
  none: 'Enter a password',
  weak: 'Weak password',
  medium: 'Moderate password',
  strong: 'Strong password',
};

const strengthChecks = [
  { regex: /.{8,}/, label: 'At least 8 characters' },
  { regex: /[A-Z]/, label: 'One uppercase letter' },
  { regex: /[a-z]/, label: 'One lowercase letter' },
  { regex: /[0-9]/, label: 'One number' },
  { regex: /[@$!%*?&]/, label: 'One special character' },
];

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  if (!password) return null;

  const passedChecks = strengthChecks.filter((check) => check.regex.test(password));
  const strength: StrengthLevel =
    passedChecks.length <= 2 ? 'weak' : passedChecks.length <= 4 ? 'medium' : 'strong';

  const strengthColors: Record<StrengthLevel, string> = {
    none: 'bg-border',
    weak: 'bg-red-500',
    medium: 'bg-amber-500',
    strong: 'bg-green-500',
  };

  return (
    <div className={cn('password-strength', className)}>
      <div className="password-strength__bar">
        <div
          className={cn(
            'password-strength__fill h-full rounded-full transition-all duration-300',
            strengthColors[strength],
          )}
          style={{
            width: strength === 'weak' ? '33%' : strength === 'medium' ? '66%' : '100%',
          }}
        />
      </div>
      <div
        className={cn(
          'password-strength__text flex justify-between text-xs font-medium',
          strength === 'weak' && 'password-strength__text--weak',
          strength === 'medium' && 'password-strength__text--medium',
          strength === 'strong' && 'password-strength__text--strong',
        )}
      >
        <span>{strengthMessages[strength]}</span>
        <span>
          {passedChecks.length}/{strengthChecks.length}
        </span>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1.5 text-xs">
        {strengthChecks.map((check) => {
          const passed = check.regex.test(password);
          return (
            <div
              key={check.label}
              className={cn(
                'flex items-center gap-1.5',
                passed ? 'text-green-600' : 'text-muted',
              )}
            >
              <div
                className={cn(
                  'flex h-3 w-3 items-center justify-center rounded-full',
                  passed ? 'bg-green-500 text-white' : 'bg-border text-transparent',
                )}
              >
                ✓
              </div>
              {check.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
