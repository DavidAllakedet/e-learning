import { cn } from '../../utils/cn';

export const Table = ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="w-full overflow-auto rounded-2xl border border-slate-100 bg-white">
    <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
  </div>
);

export const THeader = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn('[&_tr]:border-b bg-slate-50/50', className)} {...props} />
);

export const TBody = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
);

export const TRow = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    className={cn(
      'border-b transition-colors hover:bg-slate-50/50 data-[state=selected]:bg-slate-50',
      className
    )}
    {...props}
  />
);

export const THead = ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={cn(
      'h-12 px-4 text-left align-middle font-bold text-slate-500 uppercase tracking-wider text-[10px]',
      className
    )}
    {...props}
  />
);

export const TCell = ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn('p-4 align-middle text-slate-700 font-medium', className)} {...props} />
);
