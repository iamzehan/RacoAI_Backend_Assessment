import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useAuth } from "./AuthContext";

export type Role = "USER" | "ADMIN" | "SUPER_ADMIN";

type RbacContextValue = {
  role?: Role;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  hasRole: (...roles: Role[]) => boolean;
  canAccessAdmin: boolean;
};

const RbacContext = createContext<RbacContextValue>({
  isAuthenticated: false,
  isAdmin: false,
  isSuperAdmin: false,
  hasRole: () => false,
  canAccessAdmin: false
});

export function RbacProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const value = useMemo<RbacContextValue>(() => {
    const role = user?.role;
    const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
    const isSuperAdmin = role === "SUPER_ADMIN";

    return {
      role,
      isAuthenticated: Boolean(user),
      isAdmin,
      isSuperAdmin,
      canAccessAdmin: isAdmin,
      hasRole: (...roles) => (role ? roles.includes(role) : false)
    };
  }, [user]);

  return <RbacContext.Provider value={value}>{children}</RbacContext.Provider>;
}

export const useRbac = () => useContext(RbacContext);
