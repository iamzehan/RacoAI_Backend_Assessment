import { Plus } from "lucide-react";
import type { Product } from "../../api";
import { money } from "../../lib/money";

export function ProductCard({
  product,
  onAdd
}: {
  product: Product;
  onAdd: () => void;
}) {
  return (
    <article className="panel group overflow-hidden h-full w-full">
      <div className="flex h-44 items-end bg-gradient-to-br from-violet-100 to-indigo-200 p-5 dark:from-violet-950 dark:to-indigo-950">
        <span className="rounded-lg bg-white/70 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-900/70 dark:text-slate-300">
          {product.sku}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold">{product.name}</h2>
          <span className="font-black text-brand">{money(product.price)}</span>
        </div>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-600 dark:text-slate-400">
          {product.description}
        </p>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {product.stock?.quantity ?? "—"} in stock
          </span>
          <button className="button-primary px-3 py-2 text-sm" onClick={onAdd}>
            <Plus size={16} /> Add
          </button>
        </div>
      </div>
    </article>
  );
}
