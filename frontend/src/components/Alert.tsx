export function Alert({ text }: { text: string }) {
  return (
    <p
      role="alert"
      className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
    >
      {text}
    </p>
  );
}
