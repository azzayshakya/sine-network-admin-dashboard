import { useState } from "react";
import { ThemeContext } from "./ThemeContext";
import { lightTheme, darkTheme } from "../theme/theme";

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? darkTheme : lightTheme;
  const toggle = () => setIsDark((p) => !p);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
