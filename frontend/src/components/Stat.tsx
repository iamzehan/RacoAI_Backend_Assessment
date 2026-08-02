export function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="panel p-5">
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-4xl font-black">{value}</p>
    </div>
  );
}
