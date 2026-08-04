import { useEffect, useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { api, type Category } from "../../api";
import { Alert } from "../../components/Alert";
import { Empty } from "../../components/Empty";
import { useRbac } from "../../contexts/_index";

type CategoryForm = { name: string; description: string; parentId: string };
const emptyForm: CategoryForm = { name: "", description: "", parentId: "" };

function categoryLabel(category: Category, categories: Category[]) {
  const parent = categories.find((item) => item.id === category.parentId);
  return parent ? `${parent.name} → ${category.name}` : category.name;
}

export function AdminCategories() {
  const { canAccessAdmin } = useRbac();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    try {
      const result = await api.categories();
      setCategories(result);
    } catch (err) {
      if (/no categories found/i.test(err instanceof Error ? err.message : "")) setCategories([]);
      else setError(err instanceof Error ? err.message : "Unable to load categories.");
    }
  };

  useEffect(() => {
    if (canAccessAdmin) void load();
  }, [canAccessAdmin]);

  if (!canAccessAdmin) return <Navigate to="/login" replace />;

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      name: form.name,
      description: form.description || undefined,
      parentId: form.parentId || null
    };
    try {
      const category = editingId
        ? await api.updateCategory(editingId, payload)
        : await api.createCategory(payload);
      setCategories((current) => {
        const next = editingId
          ? current.map((item) => (item.id === category.id ? category : item))
          : [...current, category];
        return next.sort((a, b) => a.name.localeCompare(b.name));
      });
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save category.");
    } finally {
      setSaving(false);
    }
  };

  const edit = (category: Category) => {
    setError("");
    setEditingId(category.id);
    setForm({
      name: category.name,
      description: category.description ?? "",
      parentId: category.parentId ?? ""
    });
  };

  const remove = async (category: Category) => {
    if (!window.confirm(`Delete the “${category.name}” category?`)) return;
    setDeletingId(category.id);
    setError("");
    try {
      await api.deleteCategory(category.id);
      setCategories((current) => current.filter((item) => item.id !== category.id));
      if (editingId === category.id) resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete category.");
    } finally {
      setDeletingId(null);
    }
  };

  const parentOptions = categories.filter((category) => category.id !== editingId);

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <p className="text-sm font-bold uppercase tracking-widest text-brand">Catalog</p>
      <h1 className="mt-2 text-4xl font-black">Manage categories</h1>
      <form className="panel mt-7 grid gap-3 p-5 sm:grid-cols-2" onSubmit={submit}>
        <input className="field mt-0" required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Category name" />
        <select className="field mt-0" value={form.parentId} onChange={(event) => setForm((current) => ({ ...current, parentId: event.target.value }))}>
          <option value="">No parent category</option>
          {parentOptions.map((category) => <option key={category.id} value={category.id}>{categoryLabel(category, categories)}</option>)}
        </select>
        <input className="field mt-0 sm:col-span-2" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="Description (optional)" />
        <div className="flex gap-3 sm:col-span-2">
          <button className="button-primary" disabled={saving}><Plus size={16} />{saving ? "Saving…" : editingId ? "Save category" : "Add category"}</button>
          {editingId && <button type="button" className="button-secondary" onClick={resetForm}><X size={16} />Cancel edit</button>}
        </div>
      </form>
      {error && <Alert text={error} />}
      {categories.length ? (
        <div className="panel mt-6 divide-y divide-[var(--border)]">
          {categories.map((category) => (
            <div className="flex items-center justify-between gap-4 p-5" key={category.id}>
              <div><h2 className="font-bold">{categoryLabel(category, categories)}</h2>{category.description && <p className="mt-1 text-sm text-[var(--text-muted)]">{category.description}</p>}</div>
              <div className="flex gap-2"><button type="button" className="button-secondary px-3 py-2 text-xs" onClick={() => edit(category)}><Pencil size={14} />Edit</button><button type="button" className="inline-flex items-center gap-1 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700" disabled={deletingId === category.id} onClick={() => void remove(category)}><Trash2 size={14} />{deletingId === category.id ? "Deleting…" : "Delete"}</button></div>
            </div>
          ))}
        </div>
      ) : <Empty title="No categories yet" text="Add a category to organize your catalog." />}
    </section>
  );
}
