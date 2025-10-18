/// <reference types="vitest" />
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.js",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        "src/main.jsx",     // entrypoint sin lógica
        "vite.config.js",   // config de Vite
        "eslint.config.js"  // config de ESLint
      ]
    },
  },
  resolve: {
    alias:
      mode === "test"
        ? {
            "../data/productos": "/tests/__mocks__/productos.js",
            "../data/productos.js": "/tests/__mocks__/productos.js",
          }
        : {},
  },
}))
