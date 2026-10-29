import { afterEach, describe, expect, it } from "vitest";
import middleware from "./middleware";

const originalUser = process.env.ADMIN_GATE_USER;
const originalPassword = process.env.ADMIN_GATE_PASSWORD;

afterEach(() => {
  if (originalUser === undefined) delete process.env.ADMIN_GATE_USER;
  else process.env.ADMIN_GATE_USER = originalUser;
  if (originalPassword === undefined) delete process.env.ADMIN_GATE_PASSWORD;
  else process.env.ADMIN_GATE_PASSWORD = originalPassword;
});

describe("middleware administrativo", () => {
  it("oculta las rutas /admin", () => {
    expect(
      middleware(new Request("https://speedcodelab.com/admin/login")).status,
    ).toBe(404);
  });

  it("cierra el acceso cuando faltan secretos", () => {
    delete process.env.ADMIN_GATE_USER;
    delete process.env.ADMIN_GATE_PASSWORD;
    expect(
      middleware(
        new Request("https://speedcodelab.com/gestion-speedcode/acceso"),
      ).status,
    ).toBe(503);
  });

  it("exige HTTP Basic válido", () => {
    process.env.ADMIN_GATE_USER = "admin";
    process.env.ADMIN_GATE_PASSWORD = "secret";
    const missing = middleware(
      new Request("https://speedcodelab.com/gestion-speedcode/acceso"),
    );
    const wrong = middleware(
      new Request("https://speedcodelab.com/gestion-speedcode/acceso", {
        headers: { Authorization: `Basic ${btoa("admin:wrong")}` },
      }),
    );
    expect(missing.status).toBe(401);
    expect(missing.headers.get("www-authenticate")).toContain("Basic");
    expect(wrong.status).toBe(401);
  });
});
