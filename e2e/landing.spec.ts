import { expect, test } from "@playwright/test";

test("la landing carga sus secciones principales y navegación accesible", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("#servicios")).toBeVisible();
  await expect(page.locator("#portafolio")).toBeVisible();
  await expect(page.locator("#contacto")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Escribinos por WhatsApp" }),
  ).toBeVisible();
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

test("/privacidad carga con su encabezado y permite volver a la portada", async ({
  page,
}) => {
  await page.goto("/privacidad");
  await expect(
    page.getByRole("heading", { level: 1, name: "Política de privacidad" }),
  ).toBeVisible();
  await expect(page).toHaveTitle("Política de privacidad | SPEEDCODE Lab");
  await expect(
    page.getByRole("link", { name: "Escribinos por WhatsApp" }),
  ).toHaveCount(0);
  await page.getByRole("link", { name: /Volver al inicio/ }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole("link", { name: "Escribinos por WhatsApp" }),
  ).toBeVisible();
});

test("a 375 px no hay desborde y WhatsApp no tapa el envío del formulario", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const floating = page.getByRole("link", { name: "Escribinos por WhatsApp" });
  const send = page.getByRole("button", { name: "Enviar y abrir WhatsApp" });
  await send.evaluate((element) =>
    element.scrollIntoView({ block: "end", behavior: "instant" }),
  );
  const floatingBox = await floating.boundingBox();
  const sendBox = await send.boundingBox();
  expect(floatingBox).not.toBeNull();
  expect(sendBox).not.toBeNull();
  expect(floatingBox!.width).toBeGreaterThanOrEqual(48);
  expect(floatingBox!.height).toBeGreaterThanOrEqual(48);
  expect(sendBox!.x + sendBox!.width).toBeLessThanOrEqual(floatingBox!.x);
  for (const path of ["/", "/privacidad"]) {
    await page.goto(path);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
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
