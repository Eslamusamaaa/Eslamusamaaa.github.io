import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";

// Old links used hash routes (/#/projects/x). Rewrite them to path routes before the router starts.
if (location.hash.startsWith("#/")) {
  history.replaceState(null, "", location.hash.slice(1) || "/");
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
