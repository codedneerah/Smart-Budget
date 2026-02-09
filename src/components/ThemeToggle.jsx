import { useEffect, useState, useCallback } from "react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    // Use a function to avoid reading localStorage on every render
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Apply theme to body
    document.body.className = theme;
    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setIsTransitioning(true);
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    // Remove transition class after animation
    setTimeout(() => setIsTransitioning(false), 300);
  }, [theme]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleTheme();
    }
  };

  return (
    <button
      className={`theme-btn ${isTransitioning ? "transitioning" : ""}`}
      onClick={toggleTheme}
      onKeyDown={handleKeyDown}
      title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
      text={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
      aria-label={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
      aria-checked={theme === "dark"}
      role="switch"
    >
      <span className="theme-icon" aria-hidden="true">
        {theme === "light" ? "🌙" : "☀️"}
      </span>
    </button>
  );
};

export default ThemeToggle;
