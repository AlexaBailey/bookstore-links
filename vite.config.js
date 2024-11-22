import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
export default defineConfig({
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
});
