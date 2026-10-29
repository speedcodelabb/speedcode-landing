import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SiteContentProvider } from "../context/SiteContentContext";
import { defaultSiteDocument } from "../lib/siteContent";
import FloatingWhatsapp from "./FloatingWhatsapp";

afterEach(cleanup);

describe("FloatingWhatsapp", () => {
  it("abre el número del contenido con el mensaje de presupuesto codificado", () => {
    const content = structuredClone(defaultSiteDocument);
    content.contact.whatsappNumber = "595991234567";
    render(
      <SiteContentProvider document={content}>
        <FloatingWhatsapp />
      </SiteContentProvider>,
    );
    const link = screen.getByRole("link", { name: "Escribinos por WhatsApp" });
    expect(link).toHaveAttribute(
      "href",
      `https://wa.me/595991234567?text=${encodeURIComponent("Hola Speedcode Lab, quiero pedir un presupuesto.")}`,
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
