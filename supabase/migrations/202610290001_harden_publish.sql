-- Endurece guardado y publicación del CMS.
-- 1. El servidor rechaza documentos sin la forma mínima de SiteDocumentV1
--    (la validación completa con zod sigue en el panel y en /api/contact).
-- 2. La nueva versión se calcula también sobre el historial: si site_content
--    vuelve a una versión menor (p. ej. por re-ejecutar la semilla), publicar
--    no choca con la clave primaria de site_content_versions.
-- 3. Un borrador inexistente se informa en lugar de fallar con un NULL.

create or replace function public.is_valid_site_document(document jsonb)
returns boolean
language sql
immutable
set search_path = public, pg_temp
as $$
  select coalesce(
    jsonb_typeof(document) = 'object'
    and document -> 'schemaVersion' = '1'::jsonb
    and (
      -- bool_and ignora los NULL: una sección ausente debe contar como false.
      select bool_and(coalesce(jsonb_typeof(document -> section), 'missing') = 'object')
      from unnest(array['navigation', 'hero', 'services', 'about', 'values', 'portfolio', 'faq', 'contact', 'footer']) as section
    )
    and jsonb_typeof(document -> 'contact' -> 'projectTypes') = 'array'
    and jsonb_array_length(document -> 'contact' -> 'projectTypes') > 0
    and jsonb_typeof(document -> 'portfolio' -> 'items') = 'array',
    false
  );
$$;

revoke all on function public.is_valid_site_document(jsonb) from public, anon;
grant execute on function public.is_valid_site_document(jsonb) to authenticated, service_role;

create or replace function public.save_site_draft(draft_content jsonb, expected_revision integer)
returns table(content jsonb, revision integer, base_version integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_admin() then raise exception 'not_authorized' using errcode = '42501'; end if;
  if not public.is_valid_site_document(draft_content) then raise exception 'invalid_site_document' using errcode = '22023'; end if;
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
declare
  draft_row public.site_draft%rowtype;
  current_version integer;
  new_version integer;
begin
  if not public.is_admin() then raise exception 'not_authorized' using errcode = '42501'; end if;
  select * into draft_row from public.site_draft where id = 1 for update;
  if not found then raise exception 'draft_not_seeded' using errcode = 'P0002'; end if;
  if draft_row.revision <> expected_revision then raise exception 'draft_revision_conflict' using errcode = '40001'; end if;
  if not public.is_valid_site_document(draft_row.content) then raise exception 'invalid_site_document' using errcode = '22023'; end if;
  select c.version into current_version from public.site_content c where c.id = 1 for update;
  if current_version is null then raise exception 'published_content_not_seeded' using errcode = 'P0002'; end if;
  select greatest(current_version, coalesce(max(v.version), 0)) + 1 into new_version from public.site_content_versions v;
  update public.site_content set content = draft_row.content, version = new_version, published_at = now(), published_by = auth.uid() where id = 1;
  insert into public.site_content_versions(version, content, published_at, published_by) values (new_version, draft_row.content, now(), auth.uid());
  update public.site_draft set base_version = new_version, revision = revision + 1, updated_at = now(), updated_by = auth.uid() where id = 1;
  delete from public.site_content_versions where version not in (select v.version from public.site_content_versions v order by v.version desc limit 20);
  return new_version;
end;
$$;

-- create or replace conserva los grants existentes; se repiten para que el
-- estado final no dependa del orden de las migraciones anteriores.
revoke execute on function public.save_site_draft(jsonb, integer), public.publish_site_draft(integer) from public, anon;
grant execute on function public.save_site_draft(jsonb, integer), public.publish_site_draft(integer) to authenticated;
