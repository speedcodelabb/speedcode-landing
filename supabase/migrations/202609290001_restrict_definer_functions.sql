-- Supabase concede EXECUTE por defecto a anon y authenticated sobre las funciones
-- nuevas de public: revocarlo solo a PUBLIC no alcanza (lints 0028 y 0029).
revoke execute on function
  public.consume_contact_rate_limit(text, integer, integer),
  public.cleanup_archived_contacts()
from public, anon, authenticated;

-- Las RPC administrativas validan is_admin(); anon no necesita invocarlas.
revoke execute on function
  public.is_admin(),
  public.save_site_draft(jsonb, integer),
  public.publish_site_draft(integer),
  public.restore_site_version(integer),
  public.can_delete_media_asset(text)
from public, anon;
