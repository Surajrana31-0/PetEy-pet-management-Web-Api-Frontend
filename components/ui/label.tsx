import { forwardRef, type LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('text-xs font-semibold text-slate-700 dark:text-slate-300 leading-none mb-1.5 block', className)}
      {...props}
    >
      {children}
      {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
    </label>
  ),
);
Label.displayName = 'Label';

export { Label };
