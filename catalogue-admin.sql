create table if not exists public.catalogue_products (
  id text primary key,
  data jsonb not null,
  archived boolean not null default false,
  updated_at timestamptz not null default now(),
  constraint catalogue_product_data_check check (
    jsonb_typeof(data) = 'object' and data->>'id' = id
  )
);

create table if not exists public.catalogue_categories (
  id text primary key,
  label text not null,
  archived boolean not null default false,
  updated_at timestamptz not null default now(),
  constraint catalogue_category_id_check check (id ~ '^[a-z0-9-]+$')
);

create table if not exists public.store_page_views (
  id bigint generated always as identity primary key,
  path text not null check (path in ('home', 'shop')),
  created_at timestamptz not null default now()
);

alter table public.catalogue_products enable row level security;
alter table public.catalogue_categories enable row level security;
alter table public.store_page_views enable row level security;

revoke all on public.catalogue_products from anon, authenticated;
revoke all on public.catalogue_categories from anon, authenticated;
revoke all on public.store_page_views from anon, authenticated;
revoke insert (path) on public.store_page_views from anon, authenticated;
grant select on public.catalogue_products, public.catalogue_categories to anon, authenticated;
grant insert, update on public.catalogue_products, public.catalogue_categories to authenticated;
grant select on public.store_page_views to authenticated;

drop policy if exists "Anyone can read catalogue products" on public.catalogue_products;
create policy "Anyone can read catalogue products" on public.catalogue_products
for select to anon, authenticated using (true);
drop policy if exists "Admin can insert catalogue products" on public.catalogue_products;
create policy "Admin can insert catalogue products" on public.catalogue_products
for insert to authenticated with check (
  exists (select 1 from public.admin_users where user_id = (select auth.uid()))
);
drop policy if exists "Admin can update catalogue products" on public.catalogue_products;
create policy "Admin can update catalogue products" on public.catalogue_products
for update to authenticated using (
  exists (select 1 from public.admin_users where user_id = (select auth.uid()))
) with check (
  exists (select 1 from public.admin_users where user_id = (select auth.uid()))
);

drop policy if exists "Anyone can read catalogue categories" on public.catalogue_categories;
create policy "Anyone can read catalogue categories" on public.catalogue_categories
for select to anon, authenticated using (true);
drop policy if exists "Admin can insert catalogue categories" on public.catalogue_categories;
create policy "Admin can insert catalogue categories" on public.catalogue_categories
for insert to authenticated with check (
  exists (select 1 from public.admin_users where user_id = (select auth.uid()))
);
drop policy if exists "Admin can update catalogue categories" on public.catalogue_categories;
create policy "Admin can update catalogue categories" on public.catalogue_categories
for update to authenticated using (
  exists (select 1 from public.admin_users where user_id = (select auth.uid()))
) with check (
  exists (select 1 from public.admin_users where user_id = (select auth.uid()))
);

drop policy if exists "Anyone can record a page view" on public.store_page_views;
drop policy if exists "Admin can read page views" on public.store_page_views;
create policy "Admin can read page views" on public.store_page_views
for select to authenticated using (
  exists (select 1 from public.admin_users where user_id = (select auth.uid()))
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update set public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admin can read product image records" on storage.objects;
create policy "Admin can read product image records" on storage.objects
for select to authenticated using (
  bucket_id = 'product-images' and
  exists (select 1 from public.admin_users where user_id = (select auth.uid()))
);
drop policy if exists "Admin can upload product images" on storage.objects;
create policy "Admin can upload product images" on storage.objects
for insert to authenticated with check (
  bucket_id = 'product-images' and
  exists (select 1 from public.admin_users where user_id = (select auth.uid()))
);
drop policy if exists "Admin can remove product images" on storage.objects;
create policy "Admin can remove product images" on storage.objects
for delete to authenticated using (
  bucket_id = 'product-images' and
  exists (select 1 from public.admin_users where user_id = (select auth.uid()))
);
