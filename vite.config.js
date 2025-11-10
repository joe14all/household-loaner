// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // --- ADD THIS 'test' SECTION ---
  test: {
    globals: true, // Allows you to use 'test', 'expect', etc. globally
    environment: "jsdom", // Use the 'browser' simulation
    setupFiles: "./src/test-setup.js", // A file to run before each test
  },
  // --- END OF NEW SECTION ---
});
