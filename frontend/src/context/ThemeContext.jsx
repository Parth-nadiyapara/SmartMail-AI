import { createContext, useContext, useEffect, useState, useCallback } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "smartmail-theme"; // "light" | "dark" | "system"

function resolveSystemPref() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(mode) {
  const resolved = mode === "system" ? resolveSystemPref() : mode;
  document.documentElement.classList.toggle("dark", resolved === "dark");
  return resolved;
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(
    () => localStorage.getItem(STORAGE_KEY) || "system"
  );
  const [resolvedTheme, setResolvedTheme] = useState(() => applyTheme(mode));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
    setResolvedTheme(applyTheme(mode));
  }, [mode]);

  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setResolvedTheme(applyTheme("system"));
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode]);

  const setTheme = useCallback((next) => setMode(next), []);

  return (
    <ThemeContext.Provider value={{ mode, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
