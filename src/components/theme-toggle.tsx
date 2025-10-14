import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {theme === "light" && <Sun className="h-5 w-5 text-primary" />}
      {theme === "dark" && <Moon className="h-5 w-5 text-primary" />}
      {theme === "system" && <Monitor className="h-5 w-5 text-primary" />}
      <span className="text-sm font-medium text-primary capitalize">
        {theme || "system"}
      </span>
    </button>
  );
}
