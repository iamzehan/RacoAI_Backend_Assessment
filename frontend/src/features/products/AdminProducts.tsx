import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { api, type Category, type Product } from "../../api";
import { useRbac } from "../../contexts";
import { Alert } from "../../components/Alert";
import { Empty } from "../../components/Empty";
import { TableSkeleton } from "../../components/Skeleton";
import { Pagination } from "../../components/Pagination";
import { PageSizeSlider } from "../../components/PageSizeSlider";
import { money } from "../../lib/money";
import { invalidateProductCache } from "./productResource";
import { ProductStatusBadge, StockBadge, type ProductStatus } from "./Badge";

const STATUSES = ["", "ACTIVE", "DRAFT", "OUT_OF_STOCK", "ARCHIVED"];

export function AdminProducts() {
  const { canAccessAdmin } = useRbac();

  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<{
    page: number;
    total: number;
    totalPages: number;
  }>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debouncedCategory, setDebouncedCategory] = useState("");
  const [debouncedStatus, setDebouncedStatus] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setDebouncedCategory(categoryId);
      setDebouncedStatus(status);
    }, 250);

    return () => clearTimeout(timer);
  }, [search, categoryId, status]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, debouncedCategory, debouncedStatus, limit]);

  useEffect(() => {
    api
      .categories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!canAccessAdmin) return;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.products({
          search: debouncedSearch || undefined,
          categoryId: debouncedCategory || undefined,
          status: debouncedStatus || undefined,
          page,
          limit
        });

        setProducts(response.data ?? (response as unknown as Product[]));
        setPagination(response.pagination);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to load products.";

        if (/no products found/i.test(message)) {
          setProducts([]);
          setPagination(undefined);
        } else {
          setError(message);
          setProducts([]);
          setPagination(undefined);
        }
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [
    canAccessAdmin,
    debouncedSearch,
    debouncedCategory,
    debouncedStatus,
    page,
    limit
  ]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // or "auto" for an instant jump
    });
  }, [page]);

  if (!canAccessAdmin) {
    return <Navigate to="/login" replace />;
  }

  const remove = async (id: string) => {
    if (!window.confirm("Delete this product permanently?")) return;

    setDeletingId(id);
    setError("");

    try {
      await api.deleteProduct(id);
      invalidateProductCache();

      if (products.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        setProducts((current) =>
          current.filter((product) => product.id !== id)
        );

        setPagination((current) =>
          current ? { ...current, total: current.total - 1 } : current
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-brand">
            Catalog
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight">Products</h1>

          <p className="mt-2 text-[var(--text-muted)]">
            Search, filter, create, update, and delete store products.
          </p>
        </div>

        <Link className="button-primary" to="/products/new">
          <Plus size={16} />
          Add product
        </Link>
      </div>

      {/* Filters */}
      <div className="mt-8 grid gap-2 sm:grid-cols-[1fr_11rem_11rem_11rem]">
        <input
          className="field mt-0"
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="field mt-0"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">All categories</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          className="field mt-0"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>

          {STATUSES.filter(Boolean).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>

        <PageSizeSlider value={limit} onChange={setLimit} />
      </div>

      {error && <Alert text={error} />}

      {/* Main Content */}
      <div className="mt-6 flex-1">
        {loading ? (
          <TableSkeleton rows={6} />
        ) : products.length ? (
          <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
            {/* Table Header */}
            <div className="hidden grid-cols-[1.4fr_0.7fr_0.6fr_0.6fr_8rem] gap-3 border-b border-[var(--border)] bg-[var(--surface-muted)] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] md:grid">
              <span>Product</span>
              <span>SKU</span>
              <span>Price</span>
              <span>Stock</span>
              <span className="text-right">Actions</span>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-[var(--border)]">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="grid gap-3 px-5 py-4 md:grid-cols-[1.4fr_0.7fr_0.6fr_0.6fr_8rem] md:items-center"
                >
                  <div className="min-w-0">
                    <p className="font-bold">
                      {product.name} {" "}
                      <sup>
                        <ProductStatusBadge
                          status={product.status as ProductStatus}
                        />
                      </sup>
                    </p>

                    <p className="mt-1 line-clamp-1 text-sm text-[var(--text-muted)]">
                      {product.description}
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-[var(--text-muted)]">
                    {product.sku}
                  </p>

                  <p className="font-bold text-brand">{money(product.price)}</p>

                  <div className="flex flex-col w-fit items-center gap-2">
                  
                    <StockBadge quantity={product.stock?.quantity} />
                  </div>

                  <div className="inline-flex w-full items-center justify-start gap-2 md:justify-end">
                    <Link
                      className="button-secondary px-3 py-2 text-xs w-full"
                      to={`/products/${product.id}/edit`}
                    >
                      <Pencil size={14} />
                      Edit
                    </Link>

                    <button
                      type="button"
                      className="inline-flex w-full items-center justify-center gap-1 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                      disabled={deletingId === product.id}
                      onClick={() => void remove(product.id)}
                    >
                      <Trash2 size={14} />
                      {deletingId === product.id ? "…" : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Empty
            fullscreen
            title="No products found"
            text="Create a product or clear your filters to see the catalog."
            action="Add product"
            to="/products/new"
          />
        )}
      </div>

      {/* Pagination pinned to bottom when page is short */}
      {pagination && products.length > 0 && !loading && (
        <div className="mt-auto pb-5 sticky bottom-0 bg-[var(--color-mist)] max-w-screen">
          <Pagination
            {...pagination}
            itemLabel="products"
            onPageChange={setPage}
          />
        </div>
      )}
    </section>
  );
}
