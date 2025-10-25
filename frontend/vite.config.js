import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      "/api": { target: "http://192.168.100.20:5000", changeOrigin: true },
      "/uploads": { target: "http://192.168.100.20:5000", changeOrigin: true },
    },
  },
});
