import { isSupabaseConfigured, supabase } from "./supabase";
import {
  parseSiteDocument,
  type ContentVersion,
  type DraftRecord,
  type SiteDocument,
} from "./siteContent";

export type LeadStatus = "new" | "read" | "archived";
export type NotificationStatus = "pending" | "sent" | "failed";
export type ContactLead = {
  id: string;
  name: string;
  email: string;
  projectTypeId: string;
  projectTypeLabel: string;
  message: string;
  status: LeadStatus;
  notificationStatus: NotificationStatus;
  notificationError: string | null;
  createdAt: string;
};

function client() {
  if (!isSupabaseConfigured || !supabase)
    throw new Error("Supabase no está configurado en este entorno.");
  return supabase;
}

export async function fetchDraft(): Promise<DraftRecord> {
  const { data, error } = await client()
    .from("site_draft")
    .select("content, revision, base_version, updated_at")
    .eq("id", 1)
    .single();
  if (error) throw error;
  return {
    content: parseSiteDocument(data.content),
    revision: data.revision,
    baseVersion: data.base_version,
    updatedAt: data.updated_at,
  };
}

export async function saveDraft(
  content: SiteDocument,
  expectedRevision: number,
): Promise<DraftRecord> {
  const validContent = parseSiteDocument(content);
  const { data, error } = await client().rpc("save_site_draft", {
    draft_content: validContent,
    expected_revision: expectedRevision,
  });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) throw new Error("Supabase no devolvió el borrador guardado.");
  return {
    content: validContent,
    revision: row.revision,
    baseVersion: row.base_version,
    updatedAt: row.updated_at,
  };
}

export async function publishDraft(expectedRevision: number): Promise<number> {
  const { data, error } = await client().rpc("publish_site_draft", {
    expected_revision: expectedRevision,
  });
  if (error) throw error;
  if (typeof data !== "number")
    throw new Error("La publicación no devolvió una versión válida.");
  return data;
}

export async function fetchVersions(): Promise<ContentVersion[]> {
  const { data, error } = await client()
    .from("site_content_versions")
    .select("version, content, published_at")
    .order("version", { ascending: false })
    .limit(20);
  if (error) throw error;
  return (data ?? []).map((row) => ({
    version: row.version,
    content: parseSiteDocument(row.content),
    publishedAt: row.published_at,
  }));
}

export async function restoreVersion(version: number): Promise<DraftRecord> {
  const { data, error } = await client().rpc("restore_site_version", {
    target_version: version,
  });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) throw new Error("No se pudo restaurar la versión.");
  return {
    content: parseSiteDocument(row.content),
    revision: row.revision,
    baseVersion: row.base_version,
    updatedAt: row.updated_at,
  };
}

const allowedImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);
const maxImageSize = 5 * 1024 * 1024;

export async function uploadMedia(file: File): Promise<string> {
  const extension = allowedImageTypes.get(file.type);
  if (!extension)
    throw new Error("Formato no permitido. Usá JPEG, PNG, WebP o AVIF.");
  const filenameExtension = file.name.split(".").pop()?.toLowerCase();
  const matchingExtension =
    extension === "jpg"
      ? filenameExtension === "jpg" || filenameExtension === "jpeg"
      : filenameExtension === extension;
  if (!matchingExtension)
    throw new Error("La extensión del archivo no coincide con su tipo MIME.");
  if (file.size > maxImageSize)
    throw new Error("La imagen supera el límite de 5 MB.");
  const path = `portfolio/${crypto.randomUUID()}.${extension}`;
  const api = client();
  const { error: uploadError } = await api.storage
    .from("site-media")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) throw uploadError;
  const { error: recordError } = await api
    .from("media_assets")
    .insert({ path, mime_type: file.type, size_bytes: file.size });
  if (recordError) {
    await api.storage.from("site-media").remove([path]);
    throw recordError;
  }
  return path;
}

export async function deleteMedia(path: string): Promise<void> {
  const api = client();
  const { data: canDelete, error: checkError } = await api.rpc(
    "can_delete_media_asset",
    { target_path: path },
  );
  if (checkError) throw checkError;
  if (!canDelete)
    throw new Error("La imagen sigue referenciada por contenido o versiones.");
  const { error: storageError } = await api.storage
    .from("site-media")
    .remove([path]);
  if (storageError) throw storageError;
  const { error: recordError } = await api
    .from("media_assets")
    .delete()
    .eq("path", path);
  if (recordError) throw recordError;
}

export async function fetchContactLeads(
  status?: LeadStatus,
): Promise<ContactLead[]> {
  let query = client()
    .from("contact_leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    projectTypeId: row.project_type_id,
    projectTypeLabel: row.project_type_label,
    message: row.message,
    status: row.status,
    notificationStatus: row.notification_status,
    notificationError: row.notification_error,
    createdAt: row.created_at,
  }));
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
): Promise<void> {
  const { error } = await client()
    .from("contact_leads")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await client().from("contact_leads").delete().eq("id", id);
  if (error) throw error;
}

export async function retryLeadNotification(id: string): Promise<void> {
  const { data } = await client().auth.getSession();
  if (!data.session) throw new Error("La sesión administrativa expiró.");
  const response = await fetch("/api/contact-retry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.session.access_token}`,
    },
    body: JSON.stringify({ id }),
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(body?.message ?? "No se pudo reenviar la notificación.");
  }
}
