import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Save } from "lucide-react";
import { api, type Profile } from "../../api";
import { useAuth, useRbac } from "../../contexts";
import { Alert } from "../../components/Alert";

export function ProfilePage() {
  const { user, setUser } = useAuth();
  const { isAuthenticated, role, canAccessAdmin } = useRbac();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: ""
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await api.profile();
        setProfile(data);
        setForm({
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          username: data.username ?? "",
          email: data.email ?? ""
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [isAuthenticated]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (canAccessAdmin) return <Navigate to="/dashboard" replace />;

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const updated = await api.updateProfile(form);
      setProfile(updated);
      setUser({
        userId: updated.id ?? user?.userId ?? "",
        email: updated.email,
        role: updated.role ?? user?.role
      });
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="form-surface sm:p-9 ">
        <p className="text-sm font-bold uppercase tracking-widest text-brand">
          Your account
        </p>
        <h1 className="mt-2 text-3xl font-black">Profile</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          View and update your personal information.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
          <span className="font-bold">Role: </span> 
          <span className="rounded-full bg-slate-100 text-xs lowercase px-3 py-1 text-white dark:bg-green-400/50">
            {role ?? profile?.role ?? "USER"}
          </span>
        </div>
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
          <div className="mt-8 h-56 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        ) : (
          <form className="mt-7 space-y-4" onSubmit={submit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold">
                First name
                <input
                  className="field"
                  required
                  value={form.firstName}
                  onChange={(event) =>
                    updateField("firstName", event.target.value)
                  }
                />
              </label>
              <label className="block text-sm font-semibold">
                Last name
                <input
                  className="field"
                  required
                  value={form.lastName}
                  onChange={(event) =>
                    updateField("lastName", event.target.value)
                  }
                />
              </label>
            </div>
            <label className="block text-sm font-semibold">
              Username
              <input
                className="field"
                required
                value={form.username}
                onChange={(event) =>
                  updateField("username", event.target.value)
                }
              />
            </label>
            <label className="block text-sm font-semibold">
              Email
              <input
                className="field"
                type="email"
                required
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
              />
            </label>
            <button className="button-primary mt-2" disabled={saving}>
              <Save size={16} />
              {saving ? "Saving…" : "Save changes"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
