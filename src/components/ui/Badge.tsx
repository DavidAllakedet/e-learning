import { cn } from '../../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
}

export const Badge = ({ className, variant = 'primary', ...props }: BadgeProps) => {
  const variants = {
    primary: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    secondary: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    danger: 'bg-rose-50 text-rose-700 border-rose-100',
    outline: 'bg-transparent text-slate-600 border-slate-200',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};
