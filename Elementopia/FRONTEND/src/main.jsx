import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/assets/styles/global/elementopia.css";
import "./index.css";
import App from "./App"; // Import App with all routes

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);