import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { SiteContentProvider } from "../context/SiteContentContext";
import { defaultSiteDocument } from "../lib/siteContent";
import Privacy from "./Privacy";

afterEach(cleanup);

describe("Privacy", () => {
  it("muestra la política, permite volver y restaura el título al salir", () => {
    const previousTitle = document.title;
    const { unmount } = render(
      <MemoryRouter initialEntries={["/privacidad"]}>
        <SiteContentProvider document={defaultSiteDocument}>
          <Privacy />
        </SiteContentProvider>
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Política de privacidad" }),
    ).toBeInTheDocument();
    expect(document.title).toBe("Política de privacidad | SPEEDCODE Lab");
    expect(
      screen.getByRole("link", { name: /Volver al inicio/ }),
    ).toHaveAttribute("href", "/");
    expect(screen.getByText(/Tu dirección IP no se guarda/)).toHaveTextContent(
      "15 minutos",
    );
    expect(screen.getByText(/Las consultas archivadas/)).toHaveTextContent(
      "180 días",
    );
    for (const provider of [
      "Supabase",
      "Vercel",
      "Cloudflare Turnstile",
      "Resend",
      "Google Fonts",
    ]) {
      expect(screen.getByText(new RegExp(`^${provider}:`))).toBeInTheDocument();
    }
    expect(screen.getByText(/Última actualización/)).toHaveTextContent(
      "29 de octubre de 2026",
    );
    unmount();
    expect(document.title).toBe(previousTitle);
  });
});
