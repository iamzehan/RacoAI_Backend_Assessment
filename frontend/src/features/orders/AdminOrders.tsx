import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { api, type Order } from "../../api";
import { Alert } from "../../components/Alert";
import { Empty } from "../../components/Empty";
import { useRbac } from "../../contexts/_index";
import { money } from "../../lib/money";
import { OrderStatusBadge, type OrderStatus } from "./Badge";

const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED"
];

export function AdminOrders() {
  const { canAccessAdmin } = useRbac();
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const status = searchParams.get("status") ?? "";
  const highlightedId = searchParams.get("highlight");

  const load = async () => {
    setError("");
    try {
      const response = await api.orders({ status: status || undefined });
      setOrders(response.data ?? []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load orders.";
      if (/no orders found/i.test(message)) setOrders([]);
      else setError(message);
    }
  };

  useEffect(() => {
    if (canAccessAdmin) void load();
  }, [canAccessAdmin, status]);

  if (!canAccessAdmin) return <Navigate to="/login" replace />;

  const updateStatus = async (order: Order, nextStatus: string) => {
    setUpdatingId(order.id);
    setError("");
    try {
      await api.updateOrderStatus(order.id, nextStatus);
      setOrders((current) =>
        current.map((item) =>
          item.id === order.id ? { ...item, status: nextStatus } : item
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-sm font-bold uppercase tracking-widest text-brand">Operations</p>
      <h1 className="mt-2 text-4xl font-black">Manage orders</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          className={`button-secondary py-2 text-sm ${!status ? "ring-2 ring-brand" : ""}`}
          onClick={() => setSearchParams({})}
        >
          All orders
        </button>
        {ORDER_STATUSES.map((value) => (
          <button
            key={value}
            type="button"
            className={`button-secondary py-2 text-sm ${status === value ? "ring-2 ring-brand" : ""}`}
            onClick={() => setSearchParams({ status: value })}
          >
            {value}
          </button>
        ))}
      </div>
      {error && <Alert text={error} />}
      {orders.length ? (
        <div className="mt-6 space-y-3">
          {orders.map((order) => (
            <article
              key={order.id}
              className={`panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between ${
                highlightedId === order.id ? "ring-2 ring-brand shadow-lg shadow-brand/15" : ""
              }`}
            >
              <div>
                <h2 className="font-bold">{order.orderNumber}</h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  {new Date(order.createdAt).toLocaleDateString()} · {money(order.total)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <OrderStatusBadge status={order.status as OrderStatus} />
                <select
                  className="field mt-0 w-auto py-2 text-sm"
                  value={order.status}
                  disabled={updatingId === order.id}
                  onChange={(event) => void updateStatus(order, event.target.value)}
                  aria-label={`Status for ${order.orderNumber}`}
                >
                  {ORDER_STATUSES.map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty title="No orders found" text="There are no orders matching this status." />
      )}
    </section>
  );
}
