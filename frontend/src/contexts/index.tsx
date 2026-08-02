import type { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { RbacProvider } from "./RbacContext";
import { SidebarProvider } from "./SidebarContext";
import { ThemeProvider } from "./ThemeContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RbacProvider>
          <SidebarProvider>
            <CartProvider>{children}</CartProvider>
          </SidebarProvider>
        </RbacProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export { useAuth } from "./AuthContext";
export { useCart } from "./CartContext";
export { useRbac } from "./RbacContext";
export { useSidebar } from "./SidebarContext";
export { useTheme } from "./ThemeContext";
