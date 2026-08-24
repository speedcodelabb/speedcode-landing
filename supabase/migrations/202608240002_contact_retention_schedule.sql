create extension if not exists pg_cron with schema extensions;

do $$
declare existing_job bigint;
begin
  select jobid into existing_job from cron.job where jobname = 'cleanup-archived-speedcode-contacts';
  if existing_job is not null then perform cron.unschedule(existing_job); end if;
  perform cron.schedule('cleanup-archived-speedcode-contacts', '23 3 * * *', 'select public.cleanup_archived_contacts()');
end $$;
