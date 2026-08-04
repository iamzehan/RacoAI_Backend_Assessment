import { createContext, useContext, useMemo, type ReactNode } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  type Theme,
  outlinedInputClasses
} from "@mui/material";
import { useTheme } from "./ThemeContext"; // Your existing Tailwind theme context

const MuiThemeContext = createContext<Theme | null>(null);

export function MuiThemeProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme(); // "light" | "dark"

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme
        },

        components: {
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--border)"
                },

                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-brand)"
                },

                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-brand)",
                  borderWidth: 2
                },

                "& input": {
                  color: "var(--color-ink)"
                }
              }
            }
          },

          MuiInputLabel: {
            styleOverrides: {
              root: {
                color: "#94a3b8",

                "&.Mui-focused": {
                  color: "var(--color-brand)"
                }
              }
            }
          }
        },
        shape: {
          borderRadius: 12
        }
      }),
    [theme]
  );

  return (
    <MuiThemeContext.Provider value={muiTheme}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </MuiThemeContext.Provider>
  );
}

export function useMuiTheme() {
  const context = useContext(MuiThemeContext);

  if (!context) {
    throw new Error("useMuiTheme must be used inside MuiThemeProvider.");
  }

  return context;
}
