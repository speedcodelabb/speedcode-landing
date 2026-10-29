import { describe, expect, it } from "vitest";
import {
  defaultSiteDocument,
  getServiceWhatsappMessage,
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

  it("completa los campos nuevos de un documento publicado antiguo", () => {
    const legacy: unknown = {
      ...defaultSiteDocument,
      commitments: undefined,
      contact: {
        ...defaultSiteDocument.contact,
        responsePromise: undefined,
        schedule: undefined,
        city: undefined,
        paths: undefined,
      },
      services: {
        ...defaultSiteDocument.services,
        items: defaultSiteDocument.services.items.map((item) => ({
          ...item,
          whatsappMessage: undefined,
        })),
      },
    };
    const parsed = siteDocumentSchema.parse(JSON.parse(JSON.stringify(legacy)));
    expect(parsed).toEqual(defaultSiteDocument);
  });

  it("completa también las claves opcionales de las secciones nuevas", () => {
    const parsed = siteDocumentSchema.parse({
      ...defaultSiteDocument,
      commitments: { items: [{}] },
      contact: { ...defaultSiteDocument.contact, paths: [{}] },
    });
    expect(parsed.commitments).toEqual({
      ...defaultSiteDocument.commitments,
      items: [defaultSiteDocument.commitments.items[0]],
    });
    expect(parsed.contact.paths).toEqual([
      defaultSiteDocument.contact.paths[0],
    ]);
  });

  it.each(["commitments", "paths"] as const)(
    "rechaza IDs repetidos en %s",
    (list) => {
      const content = structuredClone(defaultSiteDocument);
      const items =
        list === "commitments"
          ? content.commitments.items
          : content.contact.paths;
      items[1].id = items[0].id;
      expect(siteDocumentSchema.safeParse(content).success).toBe(false);
    },
  );

  it.each([
    ["commitments", 6],
    ["paths", 4],
  ] as const)("valida los límites de la lista %s", (list, max) => {
    const content = structuredClone(defaultSiteDocument);
    const template =
      list === "commitments"
        ? content.commitments.items[0]
        : content.contact.paths[0];
    for (const length of [0, max, max + 1]) {
      const items = Array.from({ length }, (_, index) => ({
        ...template,
        id: String(index),
      }));
      const candidate =
        list === "commitments"
          ? { ...content, commitments: { ...content.commitments, items } }
          : { ...content, contact: { ...content.contact, paths: items } };
      expect(siteDocumentSchema.safeParse(candidate).success).toBe(
        length === max,
      );
    }
  });

  it("usa el mensaje específico de cada servicio y permite dejarlo vacío", () => {
    const item = defaultSiteDocument.services.items[0];
    expect(
      getServiceWhatsappMessage({
        ...item,
        whatsappMessage: "Hola, quiero automatizar mis reportes.",
      }),
    ).toBe("Hola, quiero automatizar mis reportes.");
    expect(getServiceWhatsappMessage(item)).toBe(
      `Hola Speedcode Lab, quiero consultar por ${item.title}.`,
    );
    expect(getServiceWhatsappMessage({ ...item, whatsappMessage: "  " })).toBe(
      `Hola Speedcode Lab, quiero consultar por ${item.title}.`,
    );
  });
});
