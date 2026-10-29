create extension if not exists pgtap with schema extensions;

begin;
select plan(5);

select is_empty(
  $$
    select p.oid::regprocedure::text
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.prosecdef
      and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e')
      and has_function_privilege('anon', p.oid, 'execute')
  $$,
  'anon no puede ejecutar funciones SECURITY DEFINER de public'
);

select set_eq(
  $$
    select p.proname::text
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.prosecdef
      and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e')
      and has_function_privilege('authenticated', p.oid, 'execute')
  $$,
  array['is_admin', 'save_site_draft', 'publish_site_draft', 'restore_site_version', 'can_delete_media_asset'],
  'authenticated solo ejecuta las RPC administrativas que validan is_admin()'
);

select ok(
  has_function_privilege('service_role', 'public.consume_contact_rate_limit(text, integer, integer)', 'execute'),
  'service_role puede consumir el rate limit de contactos'
);

select ok(
  has_function_privilege('service_role', 'public.cleanup_archived_contacts()', 'execute'),
  'service_role puede limpiar contactos archivados'
);

select isnt_empty(
  $$ select 1 from cron.job where jobname = 'cleanup-archived-speedcode-contacts' $$,
  'la limpieza diaria de contactos archivados está programada'
);

select * from finish();
rollback;
