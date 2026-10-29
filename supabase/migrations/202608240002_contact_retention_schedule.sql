-- El archivo de control de pg_cron fija su esquema: solo se instala en pg_catalog.
create extension if not exists pg_cron with schema pg_catalog;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

do $$
declare existing_job bigint;
begin
  select jobid into existing_job from cron.job where jobname = 'cleanup-archived-speedcode-contacts';
  if existing_job is not null then perform cron.unschedule(existing_job); end if;
  perform cron.schedule('cleanup-archived-speedcode-contacts', '23 3 * * *', 'select public.cleanup_archived_contacts()');
end $$;
