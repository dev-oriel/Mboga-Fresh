import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), basicSsl()],
  server: {
    https: true,
    host: true,
    proxy: {
      "/api": { target: "http://192.168.100.20:5000", changeOrigin: true },
      "/uploads": { target: "http://192.168.100.20:5000", changeOrigin: true },
    },
  },
});
