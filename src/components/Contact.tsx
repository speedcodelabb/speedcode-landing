import {
  ArrowRight,
  CheckCircle2,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { useSiteContent } from "../context/SiteContentContext";
import { getWhatsappUrl } from "../lib/siteContent";

type ContactResponse =
  | { success: true; leadId: string }
  | { success: false; code: string; message: string };

export default function Contact({
  defaultWhatsappUrl,
}: {
  defaultWhatsappUrl: string;
}) {
  const { content } = useSiteContent();
  const widget = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "warning" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

  useEffect(() => {
    if (!siteKey || !widget.current) return;
    let cancelled = false;
    const render = () => {
      if (cancelled || !widget.current || widgetId.current || !window.turnstile)
        return;
      widgetId.current = window.turnstile.render(widget.current, {
        sitekey: siteKey,
        theme: "dark",
        callback: setTurnstileToken,
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
      });
    };
    render();
    const timer = window.setInterval(render, 250);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      if (widgetId.current && window.turnstile)
        window.turnstile.remove(widgetId.current);
    };
  }, [siteKey]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const projectTypeId = String(form.get("projectTypeId") ?? "");
    const userMessage = String(form.get("message") ?? "").trim();
    if (!siteKey || !turnstileToken) {
      setStatus("error");
      setMessage("Completá la verificación de seguridad antes de enviar.");
      return;
    }
    if (!name || !email || !projectTypeId || !userMessage) {
      setStatus("error");
      setMessage("Completá todos los campos obligatorios.");
      return;
    }
    const projectType = content.contact.projectTypes.find(
      (item) => item.id === projectTypeId,
    );
    const whatsappText = `Hola Speedcode Lab, soy ${name}. Quiero consultar por ${projectType?.label ?? "un proyecto"}. ${userMessage}`;
    window.open(
      getWhatsappUrl(content.contact.whatsappNumber, whatsappText),
      "_blank",
      "noopener,noreferrer",
    );
    setStatus("sending");
    setMessage("Registrando tu consulta…");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          projectTypeId,
          message: userMessage,
          turnstileToken,
        }),
      });
      const body = (await response.json()) as ContactResponse;
      if (!response.ok || !body.success) {
        const failureMessage =
          "message" in body
            ? body.message
            : "No se pudo registrar la consulta.";
        throw new Error(failureMessage);
      }
      setStatus("success");
      setMessage(
        "Consulta registrada. También abrimos WhatsApp para continuar la conversación.",
      );
      formElement.reset();
      setTurnstileToken("");
      if (widgetId.current && window.turnstile)
        window.turnstile.reset(widgetId.current);
    } catch (caught) {
      setStatus("warning");
      setMessage(
        `${caught instanceof Error ? caught.message : "No se pudo registrar la consulta."} WhatsApp sigue disponible para contactarnos.`,
      );
    }
  }

  return (
    <section id="contacto" className="mt-24 scroll-mt-24">
      <div className="grid gap-8 rounded-[32px] border border-sky-300/14 bg-[#071126]/80 p-6 md:grid-cols-[.85fr_1.15fr] md:p-10">
        <div>
          <p className="text-xs font-black uppercase text-sky-300">
            {content.contact.eyebrow}
          </p>
          <h2 className="font-heading mt-3 text-4xl font-black uppercase md:text-5xl">
            {content.contact.title}
            <span className="block bg-gradient-to-r from-sky-200 to-blue-500 bg-clip-text text-transparent">
              {content.contact.highlight}
            </span>
          </h2>
          <p className="mt-5 leading-7 text-slate-300">
            {content.contact.description}
          </p>
          <div className="mt-7 grid gap-3">
            <a
              href={`mailto:${content.contact.email}`}
              className="flex items-center gap-3 text-sm text-slate-200"
            >
              <Mail className="h-4 w-4 text-sky-300" />
              {content.contact.email}
            </a>
            <a
              href={defaultWhatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-sm text-slate-200"
            >
              <Phone className="h-4 w-4 text-sky-300" />
              {content.contact.phoneLabel}
            </a>
          </div>
          <div className="mt-8">
            <h3 className="text-sm font-black uppercase text-white">
              {content.contact.nextStepsTitle}
            </h3>
            <ol className="mt-4 grid gap-3">
              {content.contact.nextSteps.map((step, index) => (
                <li key={step.id} className="flex gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
                  <span>
                    {index + 1}. {step.text}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <form onSubmit={submit} className="grid content-start gap-4" noValidate>
          <label className="admin-label">
            Nombre
            <input
              name="name"
              required
              maxLength={100}
              autoComplete="name"
              className="admin-input"
            />
          </label>
          <label className="admin-label">
            Email
            <input
              name="email"
              type="email"
              required
              maxLength={200}
              autoComplete="email"
              className="admin-input"
            />
          </label>
          <label className="admin-label">
            Tipo de proyecto
            <select
              name="projectTypeId"
              required
              defaultValue=""
              className="admin-input"
            >
              <option value="" disabled>
                Seleccioná una opción
              </option>
              {content.contact.projectTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-label">
            Contanos brevemente qué necesitás
            <textarea
              name="message"
              required
              minLength={10}
              maxLength={2000}
              className="admin-textarea min-h-32"
            />
          </label>
          {siteKey ? (
            <div ref={widget} aria-label="Verificación de seguridad" />
          ) : (
            <p className="admin-error">
              El formulario no está configurado en este entorno.
            </p>
          )}
          {status !== "idle" && (
            <p
              role={
                status === "error" || status === "warning" ? "alert" : "status"
              }
              className={`text-sm ${status === "success" ? "text-emerald-300" : status === "sending" ? "text-sky-200" : "text-amber-200"}`}
            >
              {message}
            </p>
          )}
          <button
            disabled={status === "sending" || !siteKey}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-300 px-6 text-sm font-black uppercase disabled:opacity-50"
          >
            {status === "sending" ? "Enviando…" : "Enviar y abrir WhatsApp"}
            <ArrowRight className="h-4 w-4" />
          </button>
          <a
            href={defaultWhatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 text-sm font-bold text-sky-300"
          >
            <MessageCircle className="h-4 w-4" />
            {content.contact.directWhatsappLabel}
          </a>
        </form>
      </div>
    </section>
  );
}
