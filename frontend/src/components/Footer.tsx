import { Link } from "react-router-dom";
import { Mail, Package, ShieldCheck } from "lucide-react";
import { useRbac } from "../contexts";

export function Footer() {
  const { canAccessAdmin } = useRbac();
  const links = canAccessAdmin
    ? [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/products", label: "Manage products" },
        { to: "/admin/orders", label: "Manage orders" },
        { to: "/categories", label: "Manage categories" }
      ]
    : [
        { to: "/shop", label: "Shop collection" },
        { to: "/orders", label: "Your orders" },
        { to: "/profile", label: "Account profile" }
      ];

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2 text-lg font-black tracking-tight">
            <span className="grid size-9 place-items-center rounded-xl bg-brand text-white">
              <Package size={18} />
            </span>
            raco
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400">
            {canAccessAdmin
              ? "Everything you need to keep the catalog, categories, and customer orders moving."
              : "A calmer way to discover useful, well-made products—backed by a secure and seamless shopping experience."}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
            {canAccessAdmin ? "Operations" : "Explore"}
          </h2>
          <ul className="mt-4 space-y-2 text-sm font-semibold">
            {links.map((link) => (
              <li key={link.to}>
                <Link className="hover:text-brand" to={link.to}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
            {canAccessAdmin ? "Admin support" : "Support"}
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-brand" />
              hello@raco.store
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-brand" />
              {canAccessAdmin ? "Secure operations by default" : "Secure checkout by default"}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--border)] px-4 py-4 text-center text-xs text-slate-500 sm:px-6">
        © {new Date().getFullYear()} raco. All rights reserved.
      </div>
    </footer>
  );
}
