import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import { Alert } from "../../components/Alert";
import { PasswordField } from "../../components/PasswordField";

export function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = Object.fromEntries(
      new FormData(event.currentTarget)
    ) as Record<string, string>;
    setSaving(true);
    setError("");
    try {
      await api.register(payload);
      navigate("/login");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create your account."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-md px-4 py-10 sm:py-16">
      <form className="form-surface" onSubmit={submit}>
        <p className="text-sm font-bold uppercase tracking-widest text-brand">
          Create account
        </p>
        <h1 className="mt-2 text-3xl font-black">Start shopping simply.</h1>
        {error && <Alert text={error} />}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            ["firstName", "First name"],
            ["lastName", "Last name"]
          ].map(([name, label]) => (
            <label className="text-sm font-semibold" key={name}>
              {label}
              <input className="field" name={name} required />
            </label>
          ))}
        </div>
        <label className="mt-4 block text-sm font-semibold">
          Username
          <input className="field" name="username" required />
        </label>
        <label className="mt-4 block text-sm font-semibold">
          Email
          <input className="field" type="email" name="email" required />
        </label>
        <PasswordField
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
        <button className="button-primary mt-6 w-full" disabled={saving}>
          {saving ? "Creating account…" : "Create account"}
        </button>
      </form>
    </section>
  );
}
