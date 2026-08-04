import { Link } from "react-router-dom";
import { ArrowRight, Minus, Package, Plus } from "lucide-react";
import { useCart } from "../../contexts/_index";
import { Empty } from "../../components/Empty";
import { money } from "../../lib/money";

export function Cart() {
  const { items, remove, setQuantity } = useCart();
  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-black tracking-tight">Your bag</h1>
      {!items.length ? (
        <Empty
          title="Your bag is waiting"
          text="Add something you’ll love from the collection."
          action="Browse products"
          to="/shop"
        />
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="panel divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item) => (
              <div className="flex gap-4 p-5" key={item.id}>
                <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-violet-100 text-brand dark:bg-violet-950/50">
                  <Package />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-4">
                    <div>
                      <h2 className="font-bold">{item.name}</h2>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {money(item.price)}
                      </p>
                    </div>
                    <button
                      className="text-sm font-semibold text-rose-600"
                      onClick={() => remove(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      className="rounded-lg bg-slate-100 p-1 dark:bg-slate-800"
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                      aria-label="Reduce quantity"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="w-6 text-center text-sm font-bold">
                      {item.quantity}
                    </span>
                    <button
                      className="rounded-lg bg-slate-100 p-1 dark:bg-slate-800"
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <aside className="panel h-fit p-6">
            <h2 className="text-xl font-bold">Order summary</h2>
            <div className="mt-5 flex justify-between border-b border-slate-100 pb-4 text-slate-600 dark:border-slate-800 dark:text-slate-400">
              <span>Subtotal</span>
              <span>{money(total)}</span>
            </div>
            <div className="mt-4 flex justify-between text-lg font-black">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
            <Link className="button-primary mt-6 w-full" to="/checkout">
              Continue to checkout <ArrowRight size={16} />
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
