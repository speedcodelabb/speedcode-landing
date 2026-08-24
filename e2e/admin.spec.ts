import { expect, test } from "@playwright/test";

const email = process.env.E2E_ADMIN_EMAIL;
const password = process.env.E2E_ADMIN_PASSWORD;

test("el administrador supera Auth, navega el panel y cierra sesión", async ({
  page,
}) => {
  test.skip(
    !email || !password,
    "Requiere credenciales del administrador de staging.",
  );
  await page.goto("/gestion-speedcode/acceso");
  await page.getByLabel("Email").fill(email!);
  await page.getByLabel("Contraseña").fill(password!);
  await page.getByRole("button", { name: "Ingresar" }).click();
  await expect(page.getByRole("heading", { name: "Contenido" })).toBeVisible();
  await page.getByRole("link", { name: "Contactos" }).click();
  await expect(page.getByRole("heading", { name: "Contactos" })).toBeVisible();
  await page.getByRole("link", { name: "Versiones" }).click();
  await expect(page.getByRole("heading", { name: "Versiones" })).toBeVisible();
  await page.getByRole("button", { name: "Cerrar sesión" }).click();
  await expect(
    page.getByRole("heading", { name: "Acceso privado" }),
  ).toBeVisible();
});
