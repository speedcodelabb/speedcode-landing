-- Esquema para el panel de administración de speedcode-landing.
-- Correr esto UNA VEZ en el SQL Editor del proyecto real de Supabase
-- el día que se conecte (no se ejecutó todavía — este repo no está
-- conectado a ninguna base de datos real).

-- ============================================================
-- site_content: fila única con el contenido editable de la web
-- ============================================================
create table if not exists public.site_content (
  id smallint primary key default 1,
  hero_title text not null default '',
  hero_subtitle text not null default '',
  about_text text not null default '',
  contact_email text not null default '',
  contact_phone text not null default '',
  whatsapp_number text not null default '',
  faq_items jsonb not null default '[]'::jsonb,
  services jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  constraint site_content_singleton check (id = 1)
);

alter table public.site_content enable row level security;

create policy "site_content_public_read"
  on public.site_content for select
  using (true);

create policy "site_content_authenticated_write"
  on public.site_content for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Semilla inicial (ajustar los valores reales antes de correr, o dejarlos
-- y editarlos desde /admin apenas se conecte la base).
insert into public.site_content (id)
values (1)
on conflict (id) do nothing;

-- ============================================================
-- portfolio_items: proyectos mostrados en la sección Portafolio
-- ============================================================
create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text not null default '',
  metric text not null default '',
  result text not null default '',
  image_url text,
  app_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.portfolio_items enable row level security;

create policy "portfolio_items_public_read"
  on public.portfolio_items for select
  using (true);

create policy "portfolio_items_authenticated_manage"
  on public.portfolio_items for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================
-- contactos: reemplaza la colección de MongoDB usada por api/contact.ts
-- Sin políticas públicas: solo se escribe desde el backend con la
-- service_role key (que ignora RLS), nunca directo desde el navegador.
-- ============================================================
create table if not exists public.contactos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null,
  tipo_proyecto text not null default 'No especificado',
  mensaje text not null,
  ip text,
  fecha_envio timestamptz not null default now(),
  leido boolean not null default false
);

alter table public.contactos enable row level security;

-- ============================================================
-- Storage: bucket público para las imágenes del portafolio.
-- Lectura pública, escritura (subir/borrar) solo para usuarios
-- autenticados (el/la administradora logueada en /admin).
-- ============================================================
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

create policy "portfolio_images_public_read"
  on storage.objects for select
  using (bucket_id = 'portfolio-images');

create policy "portfolio_images_authenticated_write"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-images' and auth.role() = 'authenticated');

create policy "portfolio_images_authenticated_delete"
  on storage.objects for delete
  using (bucket_id = 'portfolio-images' and auth.role() = 'authenticated');

-- ============================================================
-- Usuario administrador: se crea desde el dashboard de Supabase
-- (Authentication > Users > Add user), no por SQL. Ese email/contraseña
-- es el login real de /admin una vez conectada la base.
-- ============================================================
