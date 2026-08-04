import type { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { RbacProvider } from "./RbacContext";
import { SidebarProvider } from "./SidebarContext";
import { ThemeProvider } from "./ThemeContext";
import { MuiThemeProvider } from "./MuiThemeProvider";
import { PopupProvider } from "./PopupContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <MuiThemeProvider>
        <PopupProvider>
          <AuthProvider>
            <RbacProvider>
              <SidebarProvider>
                <CartProvider>{children}</CartProvider>
              </SidebarProvider>
            </RbacProvider>
          </AuthProvider>
        </PopupProvider>
      </MuiThemeProvider>
    </ThemeProvider>
  );
}

export { useAuth } from "./AuthContext";
export { useCart } from "./CartContext";
export { useRbac } from "./RbacContext";
export { useSidebar } from "./SidebarContext";
export { useTheme } from "./ThemeContext";
export { useMuiTheme } from "./MuiThemeProvider";
