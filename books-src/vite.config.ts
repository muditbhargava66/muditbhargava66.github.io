import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  base: "/books-app/",
  build: {
    outDir: "../books-app",
    emptyOutDir: true,
  },
});
