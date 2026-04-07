import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200 focus-visible:ring-indigo-500',
      secondary: 'bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-500',
      outline: 'border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-700 focus-visible:ring-slate-500',
      ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 focus-visible:ring-slate-500',
      danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-sm shadow-rose-100 focus-visible:ring-rose-500',
      success: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-100 focus-visible:ring-emerald-500',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-5 text-sm',
      lg: 'h-12 px-8 text-base',
      icon: 'h-10 w-10',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
