import { useEffect, useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { Pencil, Save, X } from "lucide-react";
import { api, type Profile } from "../../api";
import { Alert } from "../../components/Alert";
import { Empty } from "../../components/Empty";
import { useRbac } from "../../contexts";

type FormState = { firstName: string; lastName: string; username: string; email: string };

export function AdminUsers() {
  const { isSuperAdmin } = useRbac();
  const [admins, setAdmins] = useState<Profile[]>([]);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [form, setForm] = useState<FormState>({ firstName: "", lastName: "", username: "", email: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isSuperAdmin) return;
    api.admins().then(setAdmins).catch((err: unknown) => setError(err instanceof Error ? err.message : "Unable to load administrators."));
  }, [isSuperAdmin]);

  if (!isSuperAdmin) return <Navigate to="/dashboard" replace />;

  const beginEdit = (admin: Profile) => {
    setEditing(admin);
    setForm({ firstName: admin.firstName, lastName: admin.lastName, username: admin.username, email: admin.email });
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!editing?.id) return;
    setSaving(true);
    setError("");
    try {
      const updated = await api.updateAdminProfile(editing.id, form);
      setAdmins((current) => current.map((admin) => admin.id === updated.id ? updated : admin));
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update administrator.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <p className="text-sm font-bold uppercase tracking-widest text-brand">Super Admin</p>
      <h1 className="mt-2 text-4xl font-black">Administrators</h1>
      <p className="mt-2 text-[var(--text-muted)]">Update administrator account details without granting profile editing to admins themselves.</p>
      {error && <Alert text={error} />}
      {editing && <form className="panel mt-6 grid gap-3 p-5 sm:grid-cols-2" onSubmit={save}>
        <input className="field mt-0" required value={form.firstName} onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))} placeholder="First name" />
        <input className="field mt-0" required value={form.lastName} onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))} placeholder="Last name" />
        <input className="field mt-0" required value={form.username} onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))} placeholder="Username" />
        <input className="field mt-0" required type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="Email" />
        <div className="flex gap-3 sm:col-span-2"><button className="button-primary" disabled={saving}><Save size={16} />{saving ? "Saving…" : "Save administrator"}</button><button type="button" className="button-secondary" onClick={() => setEditing(null)}><X size={16} />Cancel</button></div>
      </form>}
      {admins.length ? <div className="panel mt-6 divide-y divide-[var(--border)]">{admins.map((admin) => <div className="flex items-center justify-between gap-4 p-5" key={admin.id}><div><h2 className="font-bold">{admin.firstName} {admin.lastName}</h2><p className="mt-1 text-sm text-[var(--text-muted)]">{admin.username} · {admin.email}</p></div><button type="button" className="button-secondary px-3 py-2 text-xs" onClick={() => beginEdit(admin)}><Pencil size={14} />Edit</button></div>)}</div> : <Empty title="No administrators found" text="Administrator accounts will appear here." />}
    </section>
  );
}
