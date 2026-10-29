import { chromium, type FullConfig } from "@playwright/test";

export const bypassStatePath = "e2e/.auth/vercel-bypass.json";

// Vercel Deployment Protection sends previews to its login page. With the
// project's automation bypass secret, one visit sets a bypass cookie for the
// preview host; the tests reuse it through storageState. A cookie (rather than
// a global header) keeps third-party requests such as Google Fonts untouched.
export default async function globalSetup(config: FullConfig) {
  const secret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  const baseURL = config.projects[0]?.use.baseURL;
  if (!secret || !baseURL) return;

  const url = new URL(baseURL);
  url.searchParams.set("x-vercel-protection-bypass", secret);
  url.searchParams.set("x-vercel-set-bypass-cookie", "true");

  const browser = await chromium.launch();
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    const response = await page.goto(url.toString());
    if (!response?.ok() || new URL(page.url()).host !== url.host)
      throw new Error("Vercel protection bypass was rejected.");
    await context.storageState({ path: bypassStatePath });
  } finally {
    await browser.close();
  }
}
