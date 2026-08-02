export function ProductSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-5 pt-8 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy="true"
      aria-label="Loading products"
    >
      {Array.from({ length: count }, (_, index) => (
        <article
          key={index}
          className="panel overflow-hidden"
          data-product-skeleton
        >
          <div className="h-44 animate-pulse bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800" />
          <div className="space-y-3 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="h-5 w-2/3 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
              <div className="h-5 w-14 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="h-4 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-4/5 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="mt-5 flex items-center justify-between">
              <div className="h-3 w-20 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
              <div className="h-9 w-20 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
