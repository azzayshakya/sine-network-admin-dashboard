import { createContext, useContext, useState, useMemo } from "react";

const ThemeContext = createContext();

// 🎨 Theme Tokens
const lightTheme = {
  mode: "light",
  colors: {
    bg: "#ffffff",
    bgSecondary: "#f6f6f6",
    bgCard: "#ffffff",
    text: "#1a1a18",
    textSecondary: "#555",
    textTertiary: "#888",
    border: "#e5e5e5",
    borderStrong: "#d1d1d1",
    surface: "#f2f2f2",
    accent: "#1A1A18",
    accentText: "#ffffff",
    danger: "#ff4d4f",
  },
};

const darkTheme = {
  mode: "dark",
  colors: {
    bg: "#0f1115",
    bgSecondary: "#151821",
    bgCard: "#1c1f2b",
    text: "#f5f5f5",
    textSecondary: "#a0a0a0",
    textTertiary: "#777",
    border: "#2a2e3b",
    borderStrong: "#3a3f4f",
    surface: "#202432",
    accent: "#C8F135",
    accentText: "#1a1a18",
    danger: "#ff6b6b",
  },
};

// 🧱 Shared Design Tokens
const baseTheme = {
  fonts: {
    body: "Inter, sans-serif",
    mono: "monospace",
    display: "Inter, sans-serif",
  },
  radius: {
    sm: "6px",
    md: "10px",
    full: "999px",
  },
  shadows: {
    md: "0 4px 12px rgba(0,0,0,0.08)",
    lg: "0 10px 30px rgba(0,0,0,0.12)",
  },
  transitions: {
    fast: "0.15s ease",
    base: "0.25s ease",
    spring: "0.35s cubic-bezier(0.22,1,0.36,1)",
  },
};

// 🚀 Provider
export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  const toggle = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => {
    const selected = mode === "dark" ? darkTheme : lightTheme;
    return {
      ...baseTheme,
      ...selected,
    };
  }, [mode]);

  const value = {
    theme,
    isDark: mode === "dark",
    toggle,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// 🎯 Hook
export const useTheme = () => useContext(ThemeContext);
