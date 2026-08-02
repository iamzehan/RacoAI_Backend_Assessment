import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowRight, Package, Pencil } from "lucide-react";
import { api, type Order, type Product } from "../../api";
import { useRbac } from "../../contexts";
import { Alert } from "../../components/Alert";
import { Stat } from "../../components/Stat";
import { StatSkeleton, TableSkeleton } from "../../components/Skeleton";
import { money } from "../../lib/money";
import { OrderStatusBadge, type OrderStatus } from "../orders/Badge";

export function Dashboard() {
  const { canAccessAdmin } = useRbac();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [productResponse, orderResponse] = await Promise.all([
        api.products({ limit: 100 }),
        api.orders()
      ]);
      setProducts(
        productResponse.data ?? (productResponse as unknown as Product[])
      );
      setOrders(orderResponse.data ?? (orderResponse as unknown as Order[]));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load dashboard data."
      );
      setProducts([]);
      setOrders([]);
    } finally {
      setLoading(false);
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
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-4xl font-black">Dashboard</h1>
        <Link className="button-primary" to="/products">
          Manage products <ArrowRight size={16} />
        </Link>
      </div>
      {error && <Alert text={error} />}
      {loading ? (
        <StatSkeleton />
      ) : (
        <div className="mt-7 grid gap-5 sm:grid-cols-3">
          <Stat label="Products" value={products.length} />
          <Link to="/admin/orders" className="contents"><Stat label="Orders" value={orders.length} /></Link>
          <Link to="/admin/orders?status=PENDING" className="contents"><Stat label="Pending orders" value={orders.filter((order) => order.status === "PENDING").length} /></Link>
        </div>
      )}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black">Product inventory</h2>
            <Link className="text-sm font-bold text-brand" to="/products">
              View all
            </Link>
          </div>
          {loading ? (
            <TableSkeleton rows={4} />
          ) : products.length ? (
            <div className="mt-4 space-y-3">
              {products.slice(0, 8).map((product) => (
                <div
                  className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-3 text-sm"
                  key={product.id}
                >
                  <div className="min-w-0">
                    <span className="font-semibold">{product.name}</span>
                    <p className="text-[var(--text-muted)]">
                      {product.stock?.quantity ?? 0} units · {money(product.price)}
                    </p>
                  </div>
                  <Link
                    className="button-secondary shrink-0 px-3 py-2 text-xs"
                    to={`/products/${product.id}/edit`}
                  >
                    <Pencil size={14} /> Edit
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 text-center text-sm text-[var(--text-muted)]">
              <Package className="mx-auto mb-2 text-brand" />
              No products yet.
            </div>
          )}
        </section>
        <section className="panel p-6">
          <div className="flex items-center justify-between"><h2 className="text-xl font-black">Recent orders</h2><Link className="text-sm font-bold text-brand" to="/admin/orders">Manage orders</Link></div>
          {loading ? (
            <TableSkeleton rows={4} />
          ) : orders.length ? (
            <div className="mt-4 space-y-3">
              {orders.slice(0, 6).map((order) => (
                <Link
                  to={`/admin/orders?status=${order.status}&highlight=${order.id}`}
                  className="hover:bg-[var(--color-brand)]/40 px-2 flex items-center justify-between border-b border-[var(--border)] pb-3 text-sm"
                  key={order.id}
                >
                  <div>
                    <span className="font-semibold">{order.orderNumber}</span>
                    <p className="text-[var(--text-muted)]">
                      {money(order.total)}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status as OrderStatus}/>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-8 text-center text-sm text-[var(--text-muted)]">
              No orders yet.
            </p>
          )}
        </section>
      </div>
    </section>
  );
}
