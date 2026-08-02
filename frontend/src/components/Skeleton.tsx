export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="mt-6 space-y-3" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
        >
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-2/5 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-3 w-1/4 animate-pulse rounded-lg bg-slate-200" />
          </div>
          <div className="h-8 w-24 animate-pulse rounded-xl bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

export function StatSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="mt-7 grid gap-5 sm:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="panel p-5">
          <div className="h-4 w-24 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-3 h-10 w-16 animate-pulse rounded-lg bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="mt-7 space-y-4" aria-busy="true">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-11 w-full animate-pulse rounded-xl bg-slate-200" />
        </div>
      ))}
      <div className="h-11 w-36 animate-pulse rounded-xl bg-slate-200" />
    </div>
  );
}
