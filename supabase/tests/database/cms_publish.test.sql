create extension if not exists pgtap with schema extensions;

begin;
select plan(14);

-- Datos de prueba: un administrador, un usuario sin permisos y la semilla.
insert into auth.users (id, email, aud, role)
values
  ('00000000-0000-4000-8000-0000000000a1', 'admin@cms.test', 'authenticated', 'authenticated'),
  ('00000000-0000-4000-8000-0000000000b2', 'visitor@cms.test', 'authenticated', 'authenticated');
insert into public.admin_users (user_id, display_name) values ('00000000-0000-4000-8000-0000000000a1', 'Admin de prueba');

create temporary table fixture on commit drop as
select jsonb_build_object(
  'schemaVersion', 1,
  'navigation', '{}'::jsonb, 'hero', '{}'::jsonb, 'services', '{}'::jsonb,
  'about', '{}'::jsonb, 'values', '{}'::jsonb, 'faq', '{}'::jsonb, 'footer', '{}'::jsonb,
  'portfolio', jsonb_build_object('items', '[]'::jsonb),
  'contact', jsonb_build_object('projectTypes', '[{"id":"web","label":"Web"}]'::jsonb)
) as document;
grant select on fixture to anon, authenticated;

insert into public.site_content (id, content, version) select 1, document, 1 from fixture;
insert into public.site_draft (id, content, revision, base_version) select 1, document, 1, 1 from fixture;
insert into public.site_content_versions (version, content) select 1, document from fixture;
insert into public.contact_leads (name, email, project_type_id, project_type_label, message)
values ('Ada', 'ada@example.com', 'web', 'Web', 'Mensaje de prueba');

-- Visitante anónimo.
set local role anon;
select lives_ok($$ select content from public.site_content $$, 'anon lee el contenido publicado');
select throws_ok($$ select * from public.site_draft $$, '42501', null, 'anon no lee el borrador');
select throws_ok($$ select * from public.contact_leads $$, '42501', null, 'anon no lee los contactos');
select throws_ok($$ select * from public.admin_users $$, '42501', null, 'anon no lee la allowlist');
reset role;

-- Usuario autenticado sin fila en admin_users.
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000b2","role":"authenticated"}', true);
select is((select count(*)::integer from public.contact_leads), 0, 'un usuario sin permisos no ve contactos');
select throws_ok($$ select public.publish_site_draft(1) $$, '42501', 'not_authorized', 'un usuario sin permisos no publica');
reset role;

-- Administrador.
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000a1","role":"authenticated"}', true);
select throws_ok(
  $$ select * from public.save_site_draft((select document from fixture), 99) $$,
  '40001', 'draft_revision_conflict', 'guardar con una revisión vieja falla por conflicto'
);
select throws_ok(
  $$ select * from public.save_site_draft((select document - 'footer' from fixture), 1) $$,
  '22023', 'invalid_site_document', 'el servidor rechaza un documento sin la forma mínima'
);
select is(
  (select revision from public.save_site_draft((select document || '{"faq":{"title":"Nuevo"}}'::jsonb from fixture), 1)),
  2, 'guardar incrementa la revisión del borrador'
);
select is(public.publish_site_draft(2), 2, 'publicar crea la versión 2');
select is(
  (select content -> 'faq' ->> 'title' from public.site_content where id = 1),
  'Nuevo', 'la web publicada refleja el borrador'
);
reset role;

-- Semilla re-ejecutada: site_content vuelve a la versión 1 con el historial intacto.
update public.site_content set version = 1 where id = 1;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000a1","role":"authenticated"}', true);
select is(
  public.publish_site_draft((select revision from public.site_draft where id = 1)),
  3, 'publicar tras una semilla re-ejecutada continúa el historial'
);
-- Revisiones: semilla 1, guardar 2, publicar 3, publicar 4, restaurar 5.
select is(
  (select revision from public.restore_site_version(1)),
  5, 'restaurar copia la versión al borrador como una revisión nueva'
);
select is(
  (select content from public.site_draft where id = 1),
  (select document from fixture),
  'el borrador restaurado es idéntico a la versión 1'
);
reset role;

select * from finish();
rollback;
