import { expect, test } from "@playwright/test";

test("la landing carga sus secciones principales y navegación accesible", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("#servicios")).toBeVisible();
  await expect(page.locator("#portafolio")).toBeVisible();
  await expect(page.locator("#contacto")).toBeVisible();
  const mobileMenu = page.getByRole("button", { name: "Abrir navegación" });
  if (await mobileMenu.isVisible()) {
    await mobileMenu.click();
    await expect(
      page.getByRole("navigation", { name: "Navegación móvil" }),
    ).toBeVisible();
  } else {
    await expect(
      page.getByRole("navigation", { name: "Navegación principal" }),
    ).toBeVisible();
  }
});

test("/admin no revela el acceso", async ({ page }) => {
  const response = await page.goto("/admin/login");
  if (response?.status() === 404)
    await expect(page.getByText("Not Found")).toBeVisible();
  else await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
});

test("prefers-reduced-motion ofrece una portada estática", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const animationName = await page
    .locator(".hero-orb")
    .first()
    .evaluate((element) => getComputedStyle(element).animationName);
  expect(animationName).toBe("none");
});

test("el vídeo del proceso se muestra con póster, controles y archivo servido", async ({
  page,
}) => {
  await page.goto("/");
  const video = page.locator("#proceso video");
  await video.scrollIntoViewIfNeeded();
  await expect(video).toBeVisible();
  await expect(video).toHaveAttribute("poster", "/video/proceso-poster.jpg");
  await expect(video).toHaveAttribute("controls", "");
  const response = await page.request.get("/video/proceso.mp4", {
    headers: { Range: "bytes=0-1023" },
  });
  expect([200, 206]).toContain(response.status());
  expect(response.headers()["content-type"]).toContain("video/mp4");
});
