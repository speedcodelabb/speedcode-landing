import { createClient } from "@supabase/supabase-js";
import { defaultSiteDocument } from "../src/lib/siteContent";

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRoleKey)
  throw new Error("Faltan SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.");

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
// La semilla es de un solo uso: re-ejecutarla pisaría la web publicada y el
// borrador. Solo continúa si el proyecto todavía no tiene contenido.
const { data: existing, error: existingError } = await supabase
  .from("site_content")
  .select("version")
  .eq("id", 1)
  .maybeSingle();
if (existingError) throw existingError;
if (existing)
  throw new Error(
    `El proyecto ya tiene contenido publicado (versión ${existing.version}). La semilla no se vuelve a aplicar; usá el panel para editar o restaurar.`,
  );

const now = new Date().toISOString();
const { error: contentError } = await supabase.from("site_content").upsert({
  id: 1,
  content: defaultSiteDocument,
  version: 1,
  published_at: now,
});
if (contentError) throw contentError;
const { error: draftError } = await supabase.from("site_draft").upsert({
  id: 1,
  content: defaultSiteDocument,
  revision: 1,
  base_version: 1,
  updated_at: now,
});
if (draftError) throw draftError;
const { error: versionError } = await supabase
  .from("site_content_versions")
  .upsert({ version: 1, content: defaultSiteDocument, published_at: now });
if (versionError) throw versionError;
console.info("Contenido inicial creado correctamente.");
