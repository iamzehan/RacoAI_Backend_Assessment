import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { api, type Product } from "../../api";
import { useRbac } from "../../contexts/_index";
import { Alert } from "../../components/Alert";
import { invalidateProductCache } from "./productResource";

export function ProductEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { canAccessAdmin } = useRbac();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    status: "ACTIVE",
    quantity: "0"
  });

  useEffect(() => {
    if (!canAccessAdmin || !id) return;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.products({ limit: 100 });
        const list = response.data ?? (response as unknown as Product[]);
        const found = list.find((item) => item.id === id);
        if (!found) {
          setError("Product not found.");
          setProduct(null);
          return;
        }
        setProduct(found);
        setForm({
          name: found.name,
          sku: found.sku,
          description: found.description,
          price: String(found.price),
          status: found.status || "ACTIVE",
          quantity: String(found.stock?.quantity ?? 0)
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [canAccessAdmin, id]);

  if (!canAccessAdmin) return <Navigate to="/login" replace />;

  const updateField = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!product) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.updateProduct({
        id: product.id,
        name: form.name,
        sku: form.sku,
        description: form.description,
        price: Number(form.price),
        status: form.status,
        stock: {
          productId: product.id,
          quantity: Number(form.quantity)
        }
      });
      invalidateProductCache();
      setProduct((current) =>
        current
          ? {
              ...current,
              name: form.name,
              sku: form.sku,
              description: form.description,
              price: Number(form.price),
              status: form.status,
              stock: { productId: current.id, quantity: Number(form.quantity) }
            }
          : current
      );
      setSuccess("Product updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <button
        type="button"
        className="button-secondary mb-6"
        onClick={() => navigate("/products")}
      >
        <ArrowLeft size={16} /> Back
      </button>
      <div className="form-surface sm:p-9">
        <p className="text-sm font-bold uppercase tracking-widest text-brand">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-black">Edit product</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Update product details, pricing, status, and stock for store
          operations.
        </p>
        {error && <Alert text={error} />}
        {success && (
          <p
            role="status"
            className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            {success}
          </p>
        )}
        {loading ? (
          <div className="mt-8 h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        ) : product ? (
          <form className="mt-7 space-y-4" onSubmit={submit}>
            <label className="block text-sm font-semibold">
              Name
              <input
                className="field"
                required
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
              />
            </label>
            <label className="block text-sm font-semibold">
              SKU
              <input
                className="field"
                required
                value={form.sku}
                onChange={(event) => updateField("sku", event.target.value)}
              />
            </label>
            <label className="block text-sm font-semibold">
              Description
              <textarea
                className="field min-h-28"
                required
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold">
                Price
                <input
                  className="field"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.price}
                  onChange={(event) => updateField("price", event.target.value)}
                />
              </label>
              <label className="block text-sm font-semibold">
                Stock quantity
                <input
                  className="field"
                  type="number"
                  min="0"
                  required
                  value={form.quantity}
                  onChange={(event) =>
                    updateField("quantity", event.target.value)
                  }
                />
              </label>
            </div>
            <label className="block text-sm font-semibold">
              Status
              <select
                className="field"
                value={form.status}
                onChange={(event) => updateField("status", event.target.value)}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="DRAFT">DRAFT</option>
                <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </label>
            <div className="flex flex-wrap gap-3 pt-2">
              <button className="button-primary" disabled={saving}>
                <Save size={16} />
                {saving ? "Saving…" : "Save changes"}
              </button>
              <Link className="button-secondary" to="/products">
                Cancel
              </Link>
            </div>
          </form>
        ) : null}
      </div>
    </section>
  );
}
