import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="button-secondary px-3 sm:px-4"
      onClick={toggleTheme}
      aria-label={
        theme === "light" ? "Switch to dark theme" : "Switch to light theme"
      }
    >
      {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
      <span className="hidden md:inline">
        {theme === "light" ? "Dark" : "Light"}
      </span>
    </button>
  );
}
