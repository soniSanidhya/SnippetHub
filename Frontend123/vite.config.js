import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://snippethub-backend.vercel.app/api/", // Your backend
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [react()],
});
