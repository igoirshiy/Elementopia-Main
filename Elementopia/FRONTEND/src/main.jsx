import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App"; // Import App with all routes

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);