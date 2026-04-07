import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'flat';
}

export const Card = ({ className, variant = 'default', ...props }: CardProps) => {
  const variants = {
    default: 'bg-white border border-slate-100 shadow-sm shadow-slate-200/50',
    glass: 'bg-white/70 backdrop-blur-md border border-white/20 shadow-xl',
    flat: 'bg-slate-50 border-transparent',
  };

  return (
    <div
      className={cn('rounded-3xl p-6 transition-all duration-300', variants[variant], className)}
      {...props}
    />
  );
};

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 mb-6', className)} {...props} />
);

export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('text-2xl font-bold text-slate-800 tracking-tight', className)} {...props} />
);

export const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-slate-500 font-medium', className)} {...props} />
);

export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('', className)} {...props} />
);

export const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex items-center mt-6 pt-6 border-t border-slate-50', className)} {...props} />
);
