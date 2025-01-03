import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  server: {
    port: parseInt(process.env.VITE_PORT),
    mimeTypes: {
      ".js": "application/javascript",
    },
  },
});
