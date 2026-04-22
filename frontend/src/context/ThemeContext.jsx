import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const ThemeContext = createContext({
  theme: "night",
  toggle: () => {},
  setTheme: () => {}
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === "undefined") return "night";
    return localStorage.getItem("farley_theme") || "night";
  });

  useEffect(() => {
    const html = document.documentElement;
    if (theme === "day") {
      html.classList.add("theme-day");
      html.classList.remove("theme-night");
    } else {
      html.classList.add("theme-night");
      html.classList.remove("theme-day");
    }
    try {
      localStorage.setItem("farley_theme", theme);
    } catch (_) {
      /* ignore */
    }
  }, [theme]);

  const setTheme = useCallback((t) => setThemeState(t), []);
  const toggle = useCallback(
    () => setThemeState((t) => (t === "night" ? "day" : "night")),
    []
  );

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
