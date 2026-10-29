import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    include: [
      "src/**/*.test.{ts,tsx}",
      "api/**/*.test.ts",
      "middleware.test.ts",
    ],
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      reporter: ["text", "html"],
      include: ["src/lib/**", "middleware.ts"],
    },
  },
});
