import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Self-hosted fonts (no Google Fonts request, latin subset only)
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-600.css";
import "@fontsource/poppins/latin-700.css";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
