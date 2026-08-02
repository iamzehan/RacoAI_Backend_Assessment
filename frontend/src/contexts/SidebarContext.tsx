import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

const STORAGE_KEY = "raco_sidebar_open";
const DESKTOP_QUERY = "(min-width: 1024px)";

type SidebarContextValue = {
  open: boolean;
  isDesktop: boolean;
  toggle: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  setOpen: (open: boolean) => void;
};

const SidebarContext = createContext<SidebarContextValue>({
  open: true,
  isDesktop: true,
  toggle: () => undefined,
  openSidebar: () => undefined,
  closeSidebar: () => undefined,
  setOpen: () => undefined
});

function readDesktopPreference(): boolean {
  const stored = localStorage.getItem("raco_sidebar_open");
  if (stored === null) return true;
  return stored === "true";
}

function isDesktopViewport() {
  return typeof window !== "undefined" && window.matchMedia(DESKTOP_QUERY).matches;
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(isDesktopViewport);
  const [open, setOpenState] = useState(() =>
    isDesktopViewport() ? readDesktopPreference() : false
  );

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => {
      const desktop = media.matches;
      setIsDesktop(desktop);
      setOpenState(desktop ? readDesktopPreference() : false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const persistIfDesktop = useCallback((next: boolean) => {
    if (window.matchMedia(DESKTOP_QUERY).matches) {
      localStorage.setItem(STORAGE_KEY, String(next));
    }
  }, []);

  const setOpen = useCallback(
    (next: boolean) => {
      setOpenState(next);
      persistIfDesktop(next);
    },
    [persistIfDesktop]
  );

  const openSidebar = useCallback(() => {
    setOpenState(true);
    persistIfDesktop(true);
  }, [persistIfDesktop]);

  const closeSidebar = useCallback(() => {
    setOpenState(false);
    persistIfDesktop(false);
  }, [persistIfDesktop]);

  const toggle = useCallback(() => {
    setOpenState((current) => {
      const next = !current;
      persistIfDesktop(next);
      return next;
    });
  }, [persistIfDesktop]);

  const value = useMemo(
    () => ({
      open,
      isDesktop,
      toggle,
      openSidebar,
      closeSidebar,
      setOpen
    }),
    [open, isDesktop, toggle, openSidebar, closeSidebar, setOpen]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
