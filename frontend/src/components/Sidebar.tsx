import { useMemo, type ComponentType } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  LogIn,
  Package,
  Tags,
  PanelLeftClose,
  ShoppingBag,
  Store,
  UserCircle,
  UserPlus,
  X
} from "lucide-react";
import { useAuth, useCart, useRbac, useSidebar } from "../contexts";

type NavItem = {
  to: string;
  label: string;
  icon: ComponentType<{ size?: number }>;
  end?: boolean;
  badge?: number;
  show: boolean;
};

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "group nav-link flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
    isActive
      ? "active bg-brand text-white shadow-lg shadow-brand/20"
      : "text-slate-700 hover:bg-brand hover:text-white dark:text-slate-300 dark:hover:bg-brand dark:hover:text-white"
  ].join(" ");

export function Sidebar() {
  const { open, closeSidebar, isDesktop, toggle } = useSidebar();
  const { user } = useAuth();
  const { canAccessAdmin } = useRbac();
  const { items } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = useMemo<NavItem[]>(
    () =>
      [
        {
          to: "/",
          label: "Home",
          icon: Home,
          end: true,
          show: !Boolean(user) && !canAccessAdmin
        },
        {
          to: "/dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
          show: canAccessAdmin
        },
        {
          to: "/profile",
          label: "Profile",
          icon: UserCircle,
          show: Boolean(user) && !canAccessAdmin
        },
        {
          to: "/products",
          label: "Products",
          icon: Package,
          show: canAccessAdmin
        },
        {
          to: "/admin/orders",
          label: "Orders",
          icon: ShoppingBag,
          show: canAccessAdmin
        },
        {
          to: "/categories",
          label: "Categories",
          icon: Tags,
          show: canAccessAdmin
        },
        {
          to: "/admins",
          label: "Administrators",
          icon: UserCircle,
          show: user?.role === "SUPER_ADMIN"
        },
        {
          to: "/shop",
          label: "Shop",
          icon: Store,
          show: !canAccessAdmin
        },
        {
          to: "/cart",
          label: "Cart",
          icon: ShoppingBag,
          badge: count,
          show: !canAccessAdmin
        },
        {
          to: "/orders",
          label: "Orders",
          icon: Package,
          show: Boolean(user) && !canAccessAdmin
        },
        {
          to: "/login",
          label: "Sign in",
          icon: LogIn,
          show: !user
        },
        {
          to: "/register",
          label: "Create account",
          icon: UserPlus,
          show: !user
        }
      ].filter((item) => item.show),
    [user, canAccessAdmin, count, isDesktop]
  );

  const handleNavClick = () => {
    if (!isDesktop) closeSidebar();
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeSidebar}
        aria-hidden={!open}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col border-r border-[var(--border)] bg-[var(--surface)] shadow-xl transition-transform duration-300 lg:z-40 lg:shadow-none ${
          open
            ? "translate-x-0"
            : "-translate-x-full pointer-events-none lg:pointer-events-auto lg:w-0 lg:overflow-hidden lg:border-0 lg:translate-x-0"
        }`}
        aria-hidden={!open}
      >
        <div className="flex w-72 shrink-0 items-center justify-between border-b border-[var(--border)] px-5 py-5">
          <NavLink
            to={canAccessAdmin ? "/dashboard" : "/"}
            onClick={handleNavClick}
            className="flex items-center gap-2 text-xl font-black tracking-tight"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-brand text-white">
              <Package size={18} />
            </span>
            raco
          </NavLink>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-[var(--surface-muted)] hover:text-[var(--color-ink)]"
            onClick={toggle}
            aria-label="Hide sidebar"
          >
            {isDesktop ? <PanelLeftClose size={18} /> : <X size={18} />}
          </button>
        </div>

        <nav className="flex w-72 flex-1 flex-col gap-1 overflow-y-auto p-4">
          {navItems.map(({ to, label, icon: Icon, end, badge }) => (
            <NavLink
              key={`${to}-${label}`}
              to={to}
              end={end}
              className={linkClass}
              onClick={handleNavClick}
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              {typeof badge === "number" && badge > 0 && (
                <span className="rounded-full bg-brand/15 px-2 py-0.5 text-xs font-bold text-brand transition group-hover:bg-white/25 group-hover:text-white group-[.active]:bg-white/25 group-[.active]:text-white">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden w-72 border-t border-[var(--border)] p-4 text-xs text-[var(--text-muted)] lg:block">
          Curated essentials, simply delivered.
        </div>
      </aside>
    </>
  );
}
