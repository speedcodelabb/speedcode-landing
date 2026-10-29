import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const viteEnvironment = import.meta.env as ImportMetaEnv | undefined;
const supabaseUrl = viteEnvironment?.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = viteEnvironment?.VITE_SUPABASE_ANON_KEY as
  string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;
