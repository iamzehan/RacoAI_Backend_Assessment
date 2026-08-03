import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BellIcon,
  ChevronDown,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ShoppingBag,
  UserRound,
  X
} from "lucide-react";
import { useAuth, useCart, useRbac, useSidebar } from "../contexts";
import { ThemeToggle } from "./ThemeToggle";
import { useIsMobile } from "../lib/hooks/MediaQuery";

export function Topbar() {
  const { user, logout } = useAuth();
  const { canAccessAdmin } = useRbac();
  const { open, toggle } = useSidebar();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { items } = useCart();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          {!open && (
            <button
              type="button"
              className="button-secondary px-3"
              onClick={toggle}
              aria-label={open ? "Hide sidebar" : "Show sidebar"}
              aria-pressed={open}
            >
              <span className="lg:hidden">
                {open ? <X size={18} /> : <Menu size={18} />}
              </span>
              <span className="hidden lg:inline-flex">
                {open ? (
                  <PanelLeftClose size={18} />
                ) : (
                  <PanelLeftOpen size={18} />
                )}
              </span>
            </button>
          )}
          {user && (
            <div className="hidden sm:block">
              <p className="text-xs font-bold uppercase tracking-widest text-brand">
                Account
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                {user ? user.email : "Guest session"}{" "}
                {user.role !== "USER" && (
                  <sup className="lowercase border rounded-full px-1 text-green-400">
                    {" "}
                    {user.role}
                  </sup>
                )}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Cart icon */}
          {!canAccessAdmin && !open && (
            <button
              className="button-secondary relative"
              onClick={() => navigate("/cart")}
            >
              <ShoppingBag size={17} />
              {items.length ? (
                <span className="rounded-full flex aspect-square text-xs items-center justify-center h-5 p-2 bg-red-400 z-50 text white absolute -right-2 -top-2">
                  {items.length}
                </span>
              ) : null}
              {!isMobile ? "Cart" : null}
            </button>
          )}
          {/* Notification Icon */}
          {user && !open && (
            <button
              className="button-secondary"
              onClick={() => navigate("/notifications")}
            >
              <BellIcon size={17} /> {!isMobile ? "Notifications" : null}
            </button>
          )}

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                {!canAccessAdmin && !open && (
                  <Link className="button-secondary" to="/profile">
                    <UserRound size={17} /> Profile
                  </Link>
                )}
                <button className="button-primary" onClick={logout}>
                  <LogOut size={17} /> Log out
                </button>
              </>
            ) : (
              <Link className="button-primary" to="/login">
                Sign in
              </Link>
            )}
          </div>

          <div className="relative md:hidden" ref={menuRef}>
            {user ? (
              <>
                <button
                  type="button"
                  className="button-secondary px-3"
                  onClick={() => setMenuOpen((current) => !current)}
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  aria-label="Account menu"
                >
                  <UserRound size={17} />
                  <ChevronDown size={14} />
                </button>

                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-44 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] py-1 shadow-xl"
                  >
                    {!canAccessAdmin && (
                      <Link
                        role="menuitem"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--surface-muted)]"
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                      >
                        <UserRound size={16} /> Profile
                      </Link>
                    )}
                    <button
                      role="menuitem"
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                    >
                      <LogOut size={16} /> Log out
                    </button>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
