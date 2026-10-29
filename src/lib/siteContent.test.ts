import { describe, expect, it } from "vitest";
import {
  defaultSiteDocument,
  getWhatsappUrl,
  siteDocumentSchema,
} from "./siteContent";

describe("SiteDocumentV1", () => {
  it("valida la semilla incluida en el bundle", () => {
    expect(siteDocumentSchema.safeParse(defaultSiteDocument).success).toBe(
      true,
    );
  });

  it("rechaza enlaces no HTTPS en el portafolio", () => {
    const content = structuredClone(defaultSiteDocument);
    content.portfolio.items[0].link = "http://inseguro.example";
    expect(siteDocumentSchema.safeParse(content).success).toBe(false);
  });

  it("genera un enlace de WhatsApp codificado", () => {
    expect(getWhatsappUrl("595991234567", "Hola, ¿hablamos?")).toContain(
      "https://wa.me/595991234567?text=",
    );
  });

  it("rechaza IDs repetidos dentro de una lista editable", () => {
    const content = structuredClone(defaultSiteDocument);
    content.faq.items[1].id = content.faq.items[0].id;
    expect(siteDocumentSchema.safeParse(content).success).toBe(false);
  });
});
