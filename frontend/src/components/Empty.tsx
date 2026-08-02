import { Link } from "react-router-dom";
import { Package } from "lucide-react";

export function Empty({
  title,
  text,
  action,
  to,
  onAction,
  fullscreen = false
}: {
  title: string;
  text: string;
  action?: string;
  to?: string;
  onAction?: () => void;
  fullscreen?: boolean;
}) {
  return (
    <div
      className={
          fullscreen
          ? "flex min-h-[calc(100vh-8rem)] flex-1 flex-col items-center justify-center px-4 py-16 text-center"
          : "panel mt-8 p-10 text-center"
      }
    >
      <Package className="mx-auto text-brand" size={fullscreen ? 48 : 32} />
      <h2 className={`mt-4 font-black ${fullscreen ? "text-3xl" : "text-xl"}`}>
        {title}
      </h2>
      <p className="mt-2 text-slate-600 dark:text-slate-400">{text}</p>
      {action && onAction && (
        <button type="button" className="button-primary mt-6" onClick={onAction}>
          {action}
        </button>
      )}
      {action && to && !onAction && (
        <Link className="button-primary mt-6" to={to}>
          {action}
        </Link>
      )}
    </div>
  );
}
