import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import "./ThemeToggle.css";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Basculer le thème"
    >
      {theme === "light" ? (
        <Moon className="theme-icon" />
      ) : (
        <Sun className="theme-icon" />
      )}
    </button>
  );
}

export default ThemeToggle;