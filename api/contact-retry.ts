import { createClient } from "@supabase/supabase-js";
import type { VercelRequest, VercelResponse } from "@vercel/node";

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        character
      ]!,
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST")
    return res
      .status(405)
      .json({ success: false, message: "Método no permitido." });
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.CONTACT_NOTIFICATION_TO;
  if (!supabaseUrl || !serviceKey || !apiKey || !from || !to)
    return res
      .status(503)
      .json({ success: false, message: "Servicio no configurado." });
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Sesión requerida." });
  const api = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: userError } = await api.auth.getUser(token);
  if (userError || !userData.user)
    return res
      .status(401)
      .json({ success: false, message: "Sesión inválida." });
  const { data: admin } = await api
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userData.user.id)
    .eq("active", true)
    .maybeSingle();
  if (!admin)
    return res
      .status(403)
      .json({ success: false, message: "Sin permisos administrativos." });
  const id = typeof req.body?.id === "string" ? req.body.id : "";
  const { data: lead, error: leadError } = await api
    .from("contact_leads")
    .select("*")
    .eq("id", id)
    .single();
  if (leadError || !lead)
    return res
      .status(404)
      .json({ success: false, message: "Contacto no encontrado." });
  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Nueva consulta: ${lead.project_type_label}`,
      reply_to: lead.email,
      html: `<h1>Nueva consulta web</h1><p><strong>Nombre:</strong> ${escapeHtml(lead.name)}</p><p><strong>Email:</strong> ${escapeHtml(lead.email)}</p><p><strong>Proyecto:</strong> ${escapeHtml(lead.project_type_label)}</p><p>${escapeHtml(lead.message).replace(/\n/g, "<br>")}</p>`,
    }),
  });
  if (!emailResponse.ok) {
    const reason = `Resend respondió ${emailResponse.status}.`;
    await api
      .from("contact_leads")
      .update({ notification_status: "failed", notification_error: reason })
      .eq("id", id);
    return res.status(502).json({ success: false, message: reason });
  }
  await api
    .from("contact_leads")
    .update({ notification_status: "sent", notification_error: null })
    .eq("id", id);
  return res.status(200).json({ success: true });
}
