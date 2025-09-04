// main.tsx
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "next-themes";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider
    attribute="class"
    value={{ dark: "dark", light: "light" }}
    defaultTheme="dark"       // дефолт: ТЁМНАЯ
    enableSystem={false}      // игнор системной темы
    storageKey="theme"        // ключ в localStorage
    disableTransitionOnChange // без дерганья анимаций при смене
  >
    <App />
  </ThemeProvider>
);
