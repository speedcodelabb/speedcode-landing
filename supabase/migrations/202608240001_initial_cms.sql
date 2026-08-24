begin;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_content (
  id smallint primary key default 1 check (id = 1),
  content jsonb not null,
  version integer not null default 1 check (version > 0),
  published_at timestamptz not null default now(),
  published_by uuid references auth.users(id)
);

create table if not exists public.site_draft (
  id smallint primary key default 1 check (id = 1),
  content jsonb not null,
  revision integer not null default 1 check (revision > 0),
  base_version integer not null default 1 check (base_version > 0),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.site_content_versions (
  version integer primary key,
  content jsonb not null,
  published_at timestamptz not null default now(),
  published_by uuid references auth.users(id)
);

create table if not exists public.media_assets (
  path text primary key,
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp', 'image/avif')),
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 5242880),
  uploaded_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now()
);

do $$ begin
  create type public.lead_status as enum ('new', 'read', 'archived');
exception when duplicate_object then null;
end $$;
do $$ begin
  create type public.notification_status as enum ('pending', 'sent', 'failed');
exception when duplicate_object then null;
end $$;

create table if not exists public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) <= 200),
  project_type_id text not null check (char_length(project_type_id) <= 100),
  project_type_label text not null check (char_length(project_type_label) <= 150),
  message text not null check (char_length(message) between 1 and 2000),
  status public.lead_status not null default 'new',
  notification_status public.notification_status not null default 'pending',
  notification_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contact_leads_status_created_idx on public.contact_leads(status, created_at desc);

create table if not exists public.contact_rate_limits (
  ip_hash text primary key,
  window_started_at timestamptz not null,
  request_count integer not null default 1 check (request_count > 0),
  expires_at timestamptz not null
);

alter table public.admin_users enable row level security;
alter table public.site_content enable row level security;
alter table public.site_draft enable row level security;
alter table public.site_content_versions enable row level security;
alter table public.media_assets enable row level security;
alter table public.contact_leads enable row level security;
alter table public.contact_rate_limits enable row level security;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists admin_users_set_updated_at on public.admin_users;
create trigger admin_users_set_updated_at before update on public.admin_users for each row execute function public.set_updated_at();
drop trigger if exists contact_leads_set_updated_at on public.contact_leads;
create trigger contact_leads_set_updated_at before update on public.contact_leads for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid() and active = true
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists site_content_public_read on public.site_content;
create policy site_content_public_read on public.site_content for select to anon, authenticated using (true);

drop policy if exists admin_users_admin_read on public.admin_users;
create policy admin_users_admin_read on public.admin_users for select to authenticated using (public.is_admin());

drop policy if exists site_draft_admin_read on public.site_draft;
create policy site_draft_admin_read on public.site_draft for select to authenticated using (public.is_admin());

drop policy if exists versions_admin_read on public.site_content_versions;
create policy versions_admin_read on public.site_content_versions for select to authenticated using (public.is_admin());

drop policy if exists media_assets_admin_manage on public.media_assets;
create policy media_assets_admin_manage on public.media_assets for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists contact_leads_admin_manage on public.contact_leads;
create policy contact_leads_admin_manage on public.contact_leads for all to authenticated using (public.is_admin()) with check (public.is_admin());

revoke all on table public.admin_users, public.site_content, public.site_draft, public.site_content_versions, public.media_assets, public.contact_leads, public.contact_rate_limits from anon, authenticated;
grant select on table public.site_content to anon, authenticated;
grant select on table public.admin_users, public.site_draft, public.site_content_versions to authenticated;
grant select, insert, update, delete on table public.media_assets, public.contact_leads to authenticated;
grant select, insert, update, delete on table public.admin_users, public.site_content, public.site_draft, public.site_content_versions, public.media_assets, public.contact_leads, public.contact_rate_limits to service_role;

create or replace function public.save_site_draft(draft_content jsonb, expected_revision integer)
returns table(content jsonb, revision integer, base_version integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_admin() then raise exception 'not_authorized' using errcode = '42501'; end if;
  return query
    update public.site_draft d
      set content = draft_content, revision = d.revision + 1, updated_at = now(), updated_by = auth.uid()
      where d.id = 1 and d.revision = expected_revision
      returning d.content, d.revision, d.base_version, d.updated_at;
  if not found then raise exception 'draft_revision_conflict' using errcode = '40001'; end if;
end;
$$;

create or replace function public.publish_site_draft(expected_revision integer)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare draft_row public.site_draft%rowtype; new_version integer;
begin
  if not public.is_admin() then raise exception 'not_authorized' using errcode = '42501'; end if;
  select * into draft_row from public.site_draft where id = 1 for update;
  if draft_row.revision <> expected_revision then raise exception 'draft_revision_conflict' using errcode = '40001'; end if;
  select version + 1 into new_version from public.site_content where id = 1 for update;
  if new_version is null then raise exception 'published_content_not_seeded' using errcode = 'P0002'; end if;
  update public.site_content set content = draft_row.content, version = new_version, published_at = now(), published_by = auth.uid() where id = 1;
  insert into public.site_content_versions(version, content, published_at, published_by) values (new_version, draft_row.content, now(), auth.uid());
  update public.site_draft set base_version = new_version, revision = revision + 1, updated_at = now(), updated_by = auth.uid() where id = 1;
  delete from public.site_content_versions where version not in (select version from public.site_content_versions order by version desc limit 20);
  return new_version;
end;
$$;

create or replace function public.restore_site_version(target_version integer)
returns table(content jsonb, revision integer, base_version integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare restored_content jsonb;
begin
  if not public.is_admin() then raise exception 'not_authorized' using errcode = '42501'; end if;
  select v.content into restored_content from public.site_content_versions v where v.version = target_version;
  if restored_content is null then raise exception 'version_not_found' using errcode = 'P0002'; end if;
  return query
    update public.site_draft d set content = restored_content, revision = d.revision + 1, updated_at = now(), updated_by = auth.uid()
      where d.id = 1 returning d.content, d.revision, d.base_version, d.updated_at;
end;
$$;

create or replace function public.can_delete_media_asset(target_path text)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select public.is_admin() and not exists (
    select 1 from (
      select content from public.site_content
      union all select content from public.site_draft
      union all select content from public.site_content_versions
    ) documents where documents.content::text like '%' || target_path || '%'
  );
$$;

create or replace function public.consume_contact_rate_limit(target_hash text, limit_count integer default 5, window_minutes integer default 15)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare current_row public.contact_rate_limits%rowtype;
begin
  delete from public.contact_rate_limits where expires_at < now();
  select * into current_row from public.contact_rate_limits where ip_hash = target_hash for update;
  if not found or current_row.expires_at <= now() then
    insert into public.contact_rate_limits(ip_hash, window_started_at, request_count, expires_at)
      values (target_hash, now(), 1, now() + make_interval(mins => window_minutes))
      on conflict (ip_hash) do update set window_started_at = excluded.window_started_at, request_count = 1, expires_at = excluded.expires_at;
    return true;
  end if;
  if current_row.request_count >= limit_count then return false; end if;
  update public.contact_rate_limits set request_count = request_count + 1 where ip_hash = target_hash;
  return true;
end;
$$;

create or replace function public.cleanup_archived_contacts()
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare deleted_count integer;
begin
  delete from public.contact_leads where status = 'archived' and updated_at < now() - interval '180 days';
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

revoke all on function public.set_updated_at(), public.save_site_draft(jsonb, integer), public.publish_site_draft(integer), public.restore_site_version(integer), public.can_delete_media_asset(text), public.consume_contact_rate_limit(text, integer, integer), public.cleanup_archived_contacts() from public;
grant execute on function public.save_site_draft(jsonb, integer), public.publish_site_draft(integer), public.restore_site_version(integer), public.can_delete_media_asset(text) to authenticated;
grant execute on function public.consume_contact_rate_limit(text, integer, integer), public.cleanup_archived_contacts() to service_role;

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists site_media_public_read on storage.objects;
create policy site_media_public_read on storage.objects for select to anon, authenticated using (bucket_id = 'site-media');
drop policy if exists site_media_admin_insert on storage.objects;
create policy site_media_admin_insert on storage.objects for insert to authenticated with check (bucket_id = 'site-media' and public.is_admin());
drop policy if exists site_media_admin_update on storage.objects;
create policy site_media_admin_update on storage.objects for update to authenticated using (bucket_id = 'site-media' and public.is_admin()) with check (bucket_id = 'site-media' and public.is_admin());
drop policy if exists site_media_admin_delete on storage.objects;
create policy site_media_admin_delete on storage.objects for delete to authenticated using (bucket_id = 'site-media' and public.is_admin());

commit;
