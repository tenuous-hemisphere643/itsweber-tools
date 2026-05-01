import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const root = fileURLToPath(new URL("../..", import.meta.url));

export default defineConfig({
  plugins: [react()],
  publicDir: path.resolve(root, "public"),
  resolve: {
    alias: {
      "@itsweber/toolkit": path.resolve(root, "packages/toolkit/src/index.ts"),
      "@itsweber/ui": path.resolve(root, "packages/ui/src/index.ts"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      external: ["html2canvas", "canvg", "dompurify"],
      output: {
        manualChunks(id) {
          if (id.includes("jspdf") || id.includes("core-js")) {
            return "vendor-pdf";
          }
        },
      },
    },
  },
});
