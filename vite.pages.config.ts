import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  root: fileURLToPath(new URL("static-site/", import.meta.url)),
  base: "/demkovknife-availability-router/",
  publicDir: fileURLToPath(new URL("public/", import.meta.url)),
  plugins: [react()],
  build: {
    outDir: fileURLToPath(new URL("gh-pages/", import.meta.url)),
    emptyOutDir: true,
    sourcemap: false,
  },
});
