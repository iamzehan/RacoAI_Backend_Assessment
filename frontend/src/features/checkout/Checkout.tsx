import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { api } from "../../api";
import { useAuth, useCart } from "../../contexts/_index";
import { Alert } from "../../components/Alert";
import { money } from "../../lib/money";

export function Checkout() {
  const { user } = useAuth();
  const { items, clear } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!user) return navigate("/login?next=/checkout");
    if (!items.length) return navigate("/shop");
    setSaving(true);
    setError("");
    try {
      await api.createOrder(
        items.map((item) => ({ productId: item.id, quantity: item.quantity }))
      );
      clear();
      navigate("/orders");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to place order.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="form-surface sm:p-9">
        <p className="text-sm font-bold uppercase tracking-widest text-brand">
          Checkout
        </p>
        <h1 className="mt-2 text-3xl font-black">
          Review and place your order.
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Orders use the inventory and pricing confirmed by the backend.
        </p>
        {error && <Alert text={error} />}
        <div className="mt-7 divide-y divide-slate-100 rounded-2xl bg-slate-50 px-4 dark:divide-slate-800 dark:bg-slate-900/60">
          {items.map((item) => (
            <div className="flex justify-between py-3 text-sm" key={item.id}>
              <span>
                {item.quantity} × {item.name}
              </span>
              <strong>{money(Number(item.price) * item.quantity)}</strong>
            </div>
          ))}
        </div>
        <button
          className="button-primary mt-7 w-full"
          onClick={submit}
          disabled={saving || !items.length}
        >
          {saving ? "Placing order…" : "Place secure order"}
          <ArrowRight size={17} />
        </button>
      </div>
    </section>
  );
}
