import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const userId = process.env.ADMIN_USER_ID;
if (!url || !serviceRoleKey || !userId)
  throw new Error(
    "Faltan SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY o ADMIN_USER_ID.",
  );

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const { error } = await supabase.from("admin_users").upsert({
  user_id: userId,
  display_name: process.env.ADMIN_DISPLAY_NAME ?? "Administrador",
  active: true,
});
if (error) throw error;
console.info("Administrador agregado correctamente.");
