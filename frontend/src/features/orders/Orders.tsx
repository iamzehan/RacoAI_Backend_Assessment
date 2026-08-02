import { useEffect, useState } from "react";
import { api, type Order } from "../../api";
import { Alert } from "../../components/Alert";
import { Empty } from "../../components/Empty";
import { money } from "../../lib/money";
import { OrderStatusBadge, type OrderStatus } from "./Badge";

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const load = () =>
    api
      .orders()
      .then((response) =>
        setOrders(response.data ?? (response as unknown as Order[]))
      )
      .catch((err: Error) => setError(err.message));

  useEffect(() => {
    void load();
  }, []);

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <p className="text-sm font-bold uppercase tracking-widest text-brand">
        Your account
      </p>
      <h1 className="mt-2 text-4xl font-black">Orders</h1>
      {error && <Alert text={error} />}
      {orders.length ? (
        <div className="mt-7 space-y-3">
          {orders.map((order) => (
            <div
              className="panel flex flex-wrap items-center justify-between gap-4 p-5"
              key={order.id}
            >
              <div>
                <h2 className="font-bold">{order.orderNumber}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <OrderStatusBadge status={order.status as OrderStatus}/>
                <strong>{money(order.total)}</strong>
                {order.status === "PENDING" && (
                  <button
                    className="button-secondary py-2 text-sm"
                    onClick={async () => {
                      setCancellingId(order.id);
                      setError("");
                      try {
                        await api.cancelOrder(order.id);
                        setOrders((current) =>
                          current.map((item) =>
                            item.id === order.id
                              ? { ...item, status: "CANCELLED" }
                              : item
                          )
                        );
                        await load();
                      } catch (err) {
                        setError(
                          err instanceof Error
                            ? err.message
                            : "Unable to cancel the order."
                        );
                      } finally {
                        setCancellingId(null);
                      }
                    }}
                    disabled={cancellingId === order.id}
                  >
                    {cancellingId === order.id ? "Cancelling…" : "Cancel"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Empty
          title="No orders yet"
          text="Your placed orders will appear here."
          action="Start shopping"
          to="/shop"
        />
      )}
    </section>
  );
}
