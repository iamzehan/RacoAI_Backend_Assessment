import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { api, type Category, type Product } from "../../api";
import { useRbac } from "../../contexts/_index";
import { Alert } from "../../components/Alert";
import { FormSkeleton } from "../../components/Skeleton";
import { invalidateProductCache } from "./productResource";

type FormState = {
  name: string;
  sku: string;
  description: string;
  price: string;
  status: string;
  quantity: string;
  categoryId: string;
};

const emptyForm: FormState = {
  name: "",
  sku: "",
  description: "",
  price: "",
  status: "DRAFT",
  quantity: "0",
  categoryId: ""
};

function categoryLabel(category: Category, categories: Category[]) {
  const parent = categories.find((item) => item.id === category.parentId);
  return parent ? `${parent.name} → ${category.name}` : category.name;
}

export function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isCreate = !id || id === "new";
  const navigate = useNavigate();
  const { canAccessAdmin } = useRbac();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(!isCreate);
  const [saving, setSaving] = useState(false);
  const [skuLoading, setSkuLoading] = useState(false);

  useEffect(() => {
    api.categories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!canAccessAdmin || isCreate) return;

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
          quantity: String(found.stock?.quantity ?? 0),
          categoryId:
            found.categories?.[0]?.categories?.id ??
            (found.categories as unknown as { categoryId?: string }[])?.[0]
              ?.categoryId ??
            ""
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
  }, [canAccessAdmin, id, isCreate]);

  useEffect(() => {
    if (!isCreate || !canAccessAdmin) return;
    const generate = async () => {
      setSkuLoading(true);
      try {
        const result = await api.generateSku();
        setForm((current) => ({ ...current, sku: result.sku }));
      } catch {
        // Allow manual SKU entry if generation fails.
      } finally {
        setSkuLoading(false);
      }
    };
    void generate();
  }, [isCreate, canAccessAdmin]);

  if (!canAccessAdmin) return <Navigate to="/login" replace />;

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        sku: form.sku,
        description: form.description,
        price: Number(form.price),
        status: form.status,
        stock: {
          productId: product?.id,
          quantity: Number(form.quantity)
        },
        ...(form.categoryId
          ? { categories: [{ id: form.categoryId }] }
          : {})
      };

      if (isCreate) {
        const productId = crypto.randomUUID();
        await api.createProduct({
          ...payload,
          id: productId,
          stock: { productId, quantity: Number(form.quantity) }
        });
        invalidateProductCache();
        navigate("/products");
        return;
      }

      await api.updateProduct({
        ...payload,
        id: product!.id,
        stock: {
          productId: product!.id,
          quantity: Number(form.quantity)
        }
      });
      invalidateProductCache();
      setSuccess("Product updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isCreate
            ? "Unable to create product."
            : "Unable to update product."
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
        <ArrowLeft size={16} /> Back to products
      </button>
      <div className="form-surface sm:p-9">
        <p className="text-sm font-bold uppercase tracking-widest text-brand">
          Catalog
        </p>
        <h1 className="mt-2 text-3xl font-black">
          {isCreate ? "Add product" : "Edit product"}
        </h1>
        <p className="mt-3 text-[var(--text-muted)]">
          {isCreate
            ? "Create a new catalog item with pricing, status, and stock."
            : "Update product details, pricing, status, and stock."}
        </p>
        {error && <Alert text={error} />}
        {success && (
          <p
            role="status"
            className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
          >
            {success}
          </p>
        )}
        {loading ? (
          <FormSkeleton />
        ) : (
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
                disabled={skuLoading}
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
            <div className="grid gap-4 sm:grid-cols-2">
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
              <label className="block text-sm font-semibold">
                Category
                <select
                  className="field"
                  value={form.categoryId}
                  onChange={(event) =>
                    updateField("categoryId", event.target.value)
                  }
                >
                  <option value="">No category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {categoryLabel(category, categories)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <button className="button-primary" disabled={saving}>
                <Save size={16} />
                {saving
                  ? isCreate
                    ? "Creating…"
                    : "Saving…"
                  : isCreate
                    ? "Create product"
                    : "Save changes"}
              </button>
              <Link className="button-secondary" to="/products">
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
