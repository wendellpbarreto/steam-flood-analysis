import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    /**
     * Para cálculos puros (sem DOM), usar ambiente Node evita problemas de require ESM/CJS
     * com dependências do jsdom durante testes de unidade.
     */
    environmentMatchGlobs: [
      ["src/lib/calculations/**/*.test.{ts,tsx}", "node"],
    ],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
