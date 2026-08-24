import { createHmac } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { siteDocumentSchema } from "../src/lib/siteContent";

type ContactRequest = {
  name?: unknown;
  email?: unknown;
  projectTypeId?: unknown;
  message?: unknown;
  turnstileToken?: unknown;
};
function fail(
  res: VercelResponse,
  status: number,
  code: string,
  message: string,
) {
  return res.status(status).json({ success: false, code, message });
}
function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        character
      ]!,
  );
}

async function sendNotification(lead: {
  name: string;
  email: string;
  projectTypeLabel: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.CONTACT_NOTIFICATION_TO;
  if (!apiKey || !from || !to) throw new Error("Resend no está configurado.");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Nueva consulta: ${lead.projectTypeLabel}`,
      reply_to: lead.email,
      html: `<h1>Nueva consulta web</h1><p><strong>Nombre:</strong> ${escapeHtml(lead.name)}</p><p><strong>Email:</strong> ${escapeHtml(lead.email)}</p><p><strong>Proyecto:</strong> ${escapeHtml(lead.projectTypeLabel)}</p><p>${escapeHtml(lead.message).replace(/\n/g, "<br>")}</p>`,
    }),
  });
  if (!response.ok) throw new Error(`Resend respondió ${response.status}.`);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST")
    return fail(res, 405, "method_not_allowed", "Método no permitido.");
  if (!req.headers["content-type"]?.includes("application/json"))
    return fail(
      res,
      415,
      "invalid_content_type",
      "El contenido debe ser JSON.",
    );
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  const hashSecret = process.env.RATE_LIMIT_HASH_SECRET;
  if (!supabaseUrl || !serviceRoleKey || !turnstileSecret || !hashSecret)
    return fail(
      res,
      503,
      "service_unavailable",
      "El formulario no está disponible temporalmente.",
    );

  const host = req.headers["x-forwarded-host"] ?? req.headers.host;
  const origin = req.headers.origin;
  if (origin && host) {
    try {
      if (new URL(origin).host !== host)
        return fail(res, 403, "invalid_origin", "Origen no autorizado.");
    } catch {
      return fail(res, 403, "invalid_origin", "Origen no autorizado.");
    }
  }
  let body: ContactRequest;
  try {
    body = (
      typeof req.body === "string" ? JSON.parse(req.body) : req.body
    ) as ContactRequest;
  } catch {
    return fail(res, 400, "invalid_json", "El JSON no es válido.");
  }
  const turnstileToken = text(body?.turnstileToken, 4096);
  if (!turnstileToken)
    return fail(
      res,
      400,
      "turnstile_required",
      "Completá la verificación de seguridad.",
    );
  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    (Array.isArray(forwarded)
      ? forwarded[0]
      : forwarded?.split(",")[0]
    )?.trim() || "unknown";

  let verification: Response;
  let verificationBody: { success?: boolean };
  try {
    verification = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: turnstileSecret,
          response: turnstileToken,
          remoteip: ip,
        }),
      },
    );
    verificationBody = (await verification.json()) as { success?: boolean };
  } catch (caught) {
    console.error("Turnstile verification error", caught);
    return fail(
      res,
      503,
      "turnstile_unavailable",
      "No pudimos verificar la solicitud. Intentá por WhatsApp.",
    );
  }
  if (!verification.ok || !verificationBody.success)
    return fail(
      res,
      400,
      "turnstile_invalid",
      "La verificación de seguridad no fue válida.",
    );

  const api = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const ipHash = createHmac("sha256", hashSecret).update(ip).digest("hex");
  const { data: rateAllowed, error: rateError } = await api.rpc(
    "consume_contact_rate_limit",
    { target_hash: ipHash, limit_count: 5, window_minutes: 15 },
  );
  if (rateError) {
    console.error("Rate limit error", rateError);
    return fail(
      res,
      503,
      "rate_limit_unavailable",
      "No pudimos procesar la consulta. Intentá por WhatsApp.",
    );
  }
  if (!rateAllowed)
    return fail(
      res,
      429,
      "rate_limited",
      "Alcanzaste el límite de consultas. Intentá nuevamente en 15 minutos.",
    );

  const name = text(body?.name, 100);
  const email = text(body?.email, 200).toLowerCase();
  const projectTypeId = text(body?.projectTypeId, 100);
  const message = text(body?.message, 2000);
  if (!name || !email || !projectTypeId || message.length < 10)
    return fail(res, 400, "invalid_fields", "Revisá los campos obligatorios.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return fail(res, 400, "invalid_email", "Ingresá un email válido.");

  const { data: published, error: contentError } = await api
    .from("site_content")
    .select("content")
    .eq("id", 1)
    .single();
  if (contentError)
    return fail(
      res,
      503,
      "content_unavailable",
      "No pudimos validar el tipo de proyecto.",
    );
  const publishedDocument = siteDocumentSchema.safeParse(published.content);
  if (!publishedDocument.success)
    return fail(
      res,
      503,
      "content_invalid",
      "El contenido publicado no es válido.",
    );
  const projectType = publishedDocument.data.contact.projectTypes.find(
    (item) => item.id === projectTypeId,
  );
  if (!projectType)
    return fail(
      res,
      400,
      "invalid_project_type",
      "El tipo de proyecto no es válido.",
    );

  const { data: lead, error: insertError } = await api
    .from("contact_leads")
    .insert({
      name,
      email,
      project_type_id: projectType.id,
      project_type_label: projectType.label,
      message,
    })
    .select("id")
    .single();
  if (insertError || !lead) {
    console.error("Lead insert error", insertError);
    return fail(
      res,
      503,
      "storage_unavailable",
      "No pudimos registrar la consulta. Contactanos por WhatsApp.",
    );
  }
  try {
    await sendNotification({
      name,
      email,
      projectTypeLabel: projectType.label,
      message,
    });
    await api
      .from("contact_leads")
      .update({ notification_status: "sent", notification_error: null })
      .eq("id", lead.id);
  } catch (caught) {
    const notificationError =
      caught instanceof Error
        ? caught.message.slice(0, 500)
        : "Error desconocido";
    console.error("Notification error", caught);
    await api
      .from("contact_leads")
      .update({
        notification_status: "failed",
        notification_error: notificationError,
      })
      .eq("id", lead.id);
  }
  return res.status(201).json({ success: true, leadId: lead.id });
}
