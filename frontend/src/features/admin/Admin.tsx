import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import { api, type Order, type Product } from "../../api";
import { useRbac } from "../../contexts/_index";
import { Alert } from "../../components/Alert";
import { Stat } from "../../components/Stat";

export function Admin() {
  const { canAccessAdmin } = useRbac();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [productResponse, orderResponse] = await Promise.all([
        api.products(),
        api.orders()
      ]);
      setProducts(
        productResponse.data ?? (productResponse as unknown as Product[])
      );
      setOrders(orderResponse.data ?? (orderResponse as unknown as Order[]));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load admin data."
      );
    }
  };

  useEffect(() => {
    if (canAccessAdmin) void load();
  }, [canAccessAdmin]);

  if (!canAccessAdmin) return <Navigate to="/login" replace />;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="text-sm font-bold uppercase tracking-widest text-brand">
        Operations
      </p>
      <h1 className="mt-2 text-4xl font-black">Admin dashboard</h1>
      {error && <Alert text={error} />}
      <div className="mt-7 grid gap-5 sm:grid-cols-3">
        <Stat label="Products" value={products.length} />
        <Stat label="Orders" value={orders.length} />
        <Stat
          label="Pending orders"
          value={orders.filter((order) => order.status === "PENDING").length}
        />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black">Product inventory</h2>
            <Link className="text-sm font-bold text-brand" to="/shop">
              View store
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {products.slice(0, 8).map((product) => (
              <div
                className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 text-sm dark:border-slate-800"
                key={product.id}
              >
                <div className="min-w-0">
                  <span className="font-semibold">{product.name}</span>
                  <p className="text-slate-500 dark:text-slate-400">
                    {product.stock?.quantity ?? 0} units
                  </p>
                </div>
                <Link
                  className="button-secondary shrink-0 px-3 py-2 text-xs"
                  to={`/admin/products/${product.id}/edit`}
                >
                  <Pencil size={14} /> Edit
                </Link>
              </div>
            ))}
          </div>
        </section>
        <section className="panel p-6">
          <h2 className="text-xl font-black">Recent orders</h2>
          <div className="mt-4 space-y-3">
            {orders.slice(0, 6).map((order) => (
              <div
                className="flex items-center justify-between border-b border-slate-100 pb-3 text-sm dark:border-slate-800"
                key={order.id}
              >
                <span className="font-semibold">{order.orderNumber}</span>
                <select
                  className="rounded-lg border border-slate-200 p-1.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={order.status}
                  onChange={async (event) => {
                    await api.updateOrderStatus(order.id, event.target.value);
                    void load();
                  }}
                >
                  <option>PENDING</option>
                  <option>PAID</option>
                  <option>PROCESSING</option>
                  <option>SHIPPED</option>
                  <option>DELIVERED</option>
                  <option>CANCELLED</option>
                  <option>REFUNDED</option>
                </select>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
