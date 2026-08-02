import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Footer } from "./Footer";
import { useSidebar } from "../contexts";
import clsx from "clsx";

export function Shell({ children }: { children: React.ReactNode }) {
  const { open, closeSidebar, isDesktop } = useSidebar();
  const location = useLocation();

  // Only close the mobile drawer on navigation — never because callbacks changed.
  useEffect(() => {
    if (!isDesktop) closeSidebar();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pathname-only
  }, [location.pathname]);

  useEffect(() => {
    if (!isDesktop && open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, isDesktop]);

  return (
    <div className="flex min-h-screen bg-[var(--color-mist)] text-[var(--color-ink)]">
      <Sidebar />
      <div className={clsx("flex min-w-0 flex-1 flex-col transition-all duration-100", {"pl-72" : open})}>
        <Topbar />
        <main className="flex-1 h-screen">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
