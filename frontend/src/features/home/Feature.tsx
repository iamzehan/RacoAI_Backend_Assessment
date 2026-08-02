export function Feature({
  icon,
  title,
  text
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-violet-100 text-brand dark:bg-violet-950/50">
        {icon}
      </span>
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {text}
        </p>
      </div>
    </div>
  );
}
