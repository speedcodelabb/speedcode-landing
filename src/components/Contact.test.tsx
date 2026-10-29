import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SiteContentProvider } from "../context/SiteContentContext";
import { defaultSiteDocument } from "../lib/siteContent";
import Contact from "./Contact";

let solveChallenge: (token: string) => void = () => undefined;
let widgetOptions: TurnstileOptions | null = null;
const turnstile = {
  render: vi.fn((_container: HTMLElement, options: TurnstileOptions) => {
    widgetOptions = options;
    solveChallenge = (token) => options.callback?.(token);
    return "widget-1";
  }),
  reset: vi.fn(),
  remove: vi.fn(),
};

beforeEach(() => {
  vi.stubEnv("VITE_TURNSTILE_SITE_KEY", "test-site-key");
  vi.spyOn(window, "open").mockReturnValue(null);
  window.turnstile = turnstile;
});

afterEach(() => {
  cleanup();
  delete window.turnstile;
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

function renderContactForm() {
  render(
    <SiteContentProvider document={defaultSiteDocument}>
      <Contact defaultWhatsappUrl="https://wa.me/595994381638" />
    </SiteContentProvider>,
  );
  fireEvent.change(screen.getByLabelText("Nombre"), {
    target: { value: "Ada" },
  });
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "ada@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/Tipo de proyecto/), {
    target: { value: "web-development" },
  });
  fireEvent.change(screen.getByLabelText(/Contanos brevemente/), {
    target: { value: "Necesito una nueva landing." },
  });
  return screen
    .getByRole("button", { name: /Enviar y abrir WhatsApp/ })
    .closest("form")!;
}

describe("Contact", () => {
  it("cada camino abre WhatsApp con su mensaje y el formulario enlaza a privacidad", () => {
    renderContactForm();
    for (const path of defaultSiteDocument.contact.paths) {
      const link = screen.getByRole("link", { name: new RegExp(path.title) });
      expect(link).toHaveAttribute(
        "href",
        `https://wa.me/${defaultSiteDocument.contact.whatsappNumber}?text=${encodeURIComponent(path.whatsappMessage)}`,
      );
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
    expect(
      screen.getByRole("link", { name: "política de privacidad" }),
    ).toHaveAttribute("href", "/privacidad");
    expect(
      screen.getByText(defaultSiteDocument.contact.city),
    ).toBeInTheDocument();
    expect(
      screen.getByText(defaultSiteDocument.contact.schedule),
    ).toBeInTheDocument();
    expect(
      screen.getByText(defaultSiteDocument.contact.responsePromise),
    ).toBeInTheDocument();
  });

  it("pide un token Turnstile nuevo después de un envío fallido", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        code: "rate_limited",
        message: "Alcanzaste el límite de consultas.",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const form = renderContactForm();
    act(() => solveChallenge("token-1"));

    fireEvent.submit(form);
    expect(
      await screen.findByText(/Alcanzaste el límite de consultas/),
    ).toBeInTheDocument();
    expect(turnstile.reset).toHaveBeenCalledWith("widget-1");

    fireEvent.submit(form);
    expect(
      await screen.findByText(/Estamos verificando la conexión/),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("mantiene Turnstile invisible salvo que pida interacción", () => {
    renderContactForm();
    const container = screen.getByRole("group", {
      name: "Verificación de seguridad",
    });
    expect(widgetOptions?.appearance).toBe("interaction-only");
    expect(container).toHaveClass("h-0");

    act(() => widgetOptions?.["before-interactive-callback"]?.());
    expect(container).not.toHaveClass("h-0");

    act(() => widgetOptions?.["after-interactive-callback"]?.());
    expect(container).toHaveClass("h-0");
  });

  it("pide completar la verificación si Turnstile la está mostrando", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const form = renderContactForm();
    act(() => widgetOptions?.["before-interactive-callback"]?.());

    fireEvent.submit(form);
    expect(
      await screen.findByText(
        "Completá la verificación de seguridad antes de enviar.",
      ),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
