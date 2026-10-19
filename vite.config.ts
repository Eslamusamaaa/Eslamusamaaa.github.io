import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from the domain root on GitHub Pages; path routes are backed by per-route HTML from scripts/postbuild.mjs.
export default defineConfig({ base: "/", plugins: [react()] });
