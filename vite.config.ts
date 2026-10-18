import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base + HashRouter keeps the build working at any GitHub Pages path.
export default defineConfig({ base: "./", plugins: [react()] });
