import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-bold text-slate-700 ml-1">{label}</label>
        )}
        <textarea
          ref={ref}
          className={`w-full min-h-[100px] rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200 resize-none ${error ? 'border-rose-500' : ''} ${className || ''}`}
          {...props}
        />
        {error && <p className="text-xs text-rose-500 ml-1">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';