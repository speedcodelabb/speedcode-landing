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
const turnstile = {
  render: vi.fn((_container: HTMLElement, options: TurnstileOptions) => {
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
      await screen.findByText(
        "Completá la verificación de seguridad antes de enviar.",
      ),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
