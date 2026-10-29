import { describe, expect, it } from "vitest";
import html from "../../index.html?raw";

describe("SEO local", () => {
  it("incluye Asunción en el título y una descripción de hasta 160 caracteres", () => {
    const page = new DOMParser().parseFromString(html, "text/html");
    expect(page.title).toContain("Asunción");
    const description = page
      .querySelector('meta[name="description"]')!
      .getAttribute("content")!;
    expect(description).toContain("Asunción");
    expect(description.length).toBeLessThanOrEqual(160);
  });

  it("publica JSON-LD válido con organización, servicio local y horarios sin dirección física", () => {
    const page = new DOMParser().parseFromString(html, "text/html");
    const data = JSON.parse(
      page.querySelector('script[type="application/ld+json"]')!.textContent!,
    );
    expect(data["@graph"]).toHaveLength(2);
    expect(data["@graph"][0]["@type"]).toBe("Organization");
    const service = data["@graph"][1];
    expect(service["@type"]).toBe("ProfessionalService");
    expect(service.address).toEqual({
      "@type": "PostalAddress",
      addressLocality: "Asunción",
      addressCountry: "PY",
    });
    expect(service.openingHoursSpecification).toEqual([
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "08:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "14:00",
        closes: "19:00",
      },
    ]);
    expect(
      page.querySelectorAll(
        "script:not([src]):not([type='application/ld+json'])",
      ),
    ).toHaveLength(0);
  });
});
