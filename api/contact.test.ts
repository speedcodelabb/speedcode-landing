import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { afterEach, describe, expect, it, vi } from "vitest";
import handler from "./contact";

// Vercel ejecuta las funciones como ESM nativo: los imports relativos necesitan extensión.
const relativeImport =
  /^\s*(?:import|export)\s+(?!type\s)[^;]*?\sfrom\s+["'](\.{1,2}\/[^"']+)["']/gm;

const environmentKeys = [
  "SUPABASE_URL",
  "VITE_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "TURNSTILE_SECRET_KEY",
  "RATE_LIMIT_HASH_SECRET",
] as const;
const originalEnvironment = Object.fromEntries(
  environmentKeys.map((key) => [key, process.env[key]]),
);

function responseMock() {
  const state: {
    status: number;
    body: unknown;
    headers: Record<string, string>;
  } = {
    status: 200,
    body: null,
    headers: {},
  };
  const response = {
    setHeader(name: string, value: string) {
      state.headers[name] = value;
      return response;
    },
    status(status: number) {
      state.status = status;
      return response;
    },
    json(body: unknown) {
      state.body = body;
      return response;
    },
    end() {
      return response;
    },
  };
  return { state, response: response as unknown as VercelResponse };
}

function configureServer() {
  process.env.SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "local-service-key";
  process.env.TURNSTILE_SECRET_KEY = "local-turnstile-secret";
  process.env.RATE_LIMIT_HASH_SECRET = "local-hash-secret";
}

function contactRequest(body: Record<string, unknown>) {
  return {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://speedcodelab.com",
      host: "speedcodelab.com",
      "x-forwarded-for": "192.0.2.1",
    },
    body,
  } as unknown as VercelRequest;
}

afterEach(() => {
  vi.unstubAllGlobals();
  for (const key of environmentKeys) {
    const value = originalEnvironment[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

describe("POST /api/contact", () => {
  it("rechaza métodos distintos de POST con el contrato público", async () => {
    const { state, response } = responseMock();
    await handler(
      { method: "GET", headers: {} } as unknown as VercelRequest,
      response,
    );
    expect(state.status).toBe(405);
    expect(state.body).toMatchObject({
      success: false,
      code: "method_not_allowed",
    });
  });

  it("falla cerrado cuando faltan secretos", async () => {
    for (const key of environmentKeys) delete process.env[key];
    const { state, response } = responseMock();
    await handler(
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: {},
      } as unknown as VercelRequest,
      response,
    );
    expect(state.status).toBe(503);
    expect(state.body).toMatchObject({
      success: false,
      code: "service_unavailable",
    });
  });

  it("rechaza un token Turnstile inválido antes de escribir datos", async () => {
    configureServer();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: false }),
      }),
    );
    const { state, response } = responseMock();
    await handler(
      contactRequest({
        name: "Ada",
        email: "ada@example.com",
        projectTypeId: "web-development",
        message: "Necesito una nueva landing.",
        turnstileToken: "invalid-token",
      }),
      response,
    );
    expect(state.status).toBe(400);
    expect(state.body).toMatchObject({
      success: false,
      code: "turnstile_invalid",
    });
  });

  it("valida los campos antes de consumir el token Turnstile", async () => {
    configureServer();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const { state, response } = responseMock();
    await handler(
      contactRequest({
        name: "Ada",
        email: "ada@example.com",
        projectTypeId: "web-development",
        message: "Hola",
        turnstileToken: "valid-token",
      }),
      response,
    );
    expect(state.status).toBe(400);
    expect(state.body).toMatchObject({
      success: false,
      code: "invalid_fields",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("funciones de Vercel", () => {
  it("importan los módulos locales con extensión .js", () => {
    const apiDirectory = join(process.cwd(), "api");
    const extensionless: string[] = [];
    for (const file of readdirSync(apiDirectory)) {
      if (!file.endsWith(".ts") || file.endsWith(".test.ts")) continue;
      const source = readFileSync(join(apiDirectory, file), "utf8");
      for (const [, specifier] of source.matchAll(relativeImport))
        if (!specifier.endsWith(".js"))
          extensionless.push(`${file}: ${specifier}`);
    }
    expect(extensionless).toEqual([]);
  });
});
