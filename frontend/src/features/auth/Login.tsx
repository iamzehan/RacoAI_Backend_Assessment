import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts";
import { Alert } from "../../components/Alert";
import { PasswordField } from "../../components/PasswordField";

export function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const authenticatedUser = await login(email, password);
      navigate(
        authenticatedUser.role === "ADMIN" ||
          authenticatedUser.role === "SUPER_ADMIN"
          ? "/dashboard"
          : "/shop"
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setSaving(false);
    }
  };

  if (user) {
    return (
      <Navigate
        to={user.role === "ADMIN" || user.role === "SUPER_ADMIN" ? "/dashboard" : "/shop"}
        replace
      />
    );
  }

  return (
    <section className="mx-auto max-w-md px-4 py-10 sm:py-16">
      <form className="form-surface" onSubmit={submit}>
        <p className="text-sm font-bold uppercase tracking-widest text-brand">
          Welcome back
        </p>
        <h1 className="mt-2 text-3xl font-black">Sign in to raco.</h1>
        {error && <Alert text={error} />}
        <label className="mt-6 block text-sm font-semibold">
          Email
          <input
            className="field"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <PasswordField
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button className="button-primary mt-6 w-full" disabled={saving}>
          {saving ? "Signing in…" : "Sign in"}
        </button>
        <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-400">
          New here?{" "}
          <Link className="font-bold text-brand" to="/register">
            Create an account
          </Link>
        </p>
      </form>
    </section>
  );
}
