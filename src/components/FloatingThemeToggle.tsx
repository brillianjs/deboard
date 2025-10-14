import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function FloatingThemeToggle() {
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
      className="fixed bottom-20 right-4 z-40 lg:hidden p-3 rounded-full bg-primary/90 hover:bg-primary shadow-lg backdrop-blur-sm transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {theme === "light" && <Sun className="h-5 w-5 text-primary-foreground" />}
      {theme === "dark" && <Moon className="h-5 w-5 text-primary-foreground" />}
      {theme === "system" && (
        <Monitor className="h-5 w-5 text-primary-foreground" />
      )}
    </button>
  );
}
