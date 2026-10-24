import { defineConfig, devices } from "@playwright/test";
import { bypassStatePath } from "./e2e/vercel-bypass.setup";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4173";
const vercelBypass = Boolean(
  process.env.PLAYWRIGHT_BASE_URL &&
  process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
);

export default defineConfig({
  testDir: "./e2e",
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  globalSetup: vercelBypass ? "./e2e/vercel-bypass.setup.ts" : undefined,
  use: {
    baseURL,
    trace: "on-first-retry",
    storageState: vercelBypass ? bypassStatePath : undefined,
    httpCredentials:
      process.env.ADMIN_GATE_USER && process.env.ADMIN_GATE_PASSWORD
        ? {
            username: process.env.ADMIN_GATE_USER,
            password: process.env.ADMIN_GATE_PASSWORD,
          }
        : undefined,
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "pnpm preview --host 127.0.0.1 --port 4173",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
      },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
