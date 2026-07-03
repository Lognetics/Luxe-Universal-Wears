-- ============================================================
-- Storage bucket for admin-uploaded product images + admin model
-- ============================================================

-- Public bucket that serves product images uploaded from the admin panel.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- ------------------------------------------------------------------
-- Admin allowlist, keyed by email. A logged-in user is an admin if
-- their auth email appears here. Writes are then authorised by RLS on
-- the user's own session — no service-role key is needed in the app.
-- ------------------------------------------------------------------
create table if not exists public.admins (
  email      text primary key,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Returns true when the current session's email is an allow-listed admin.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.admins a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- A logged-in admin can read the allowlist (used for the is-admin check).
drop policy if exists "admins read for admins" on public.admins;
create policy "admins read for admins" on public.admins
  for select using (public.is_admin());

-- ------------------------------------------------------------------
-- Storage: anyone reads product images; only admins may write them.
-- ------------------------------------------------------------------
drop policy if exists "product images public read" on storage.objects;
create policy "product images public read" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "product images admin write" on storage.objects;
create policy "product images admin write" on storage.objects
  for insert with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product images admin update" on storage.objects;
create policy "product images admin update" on storage.objects
  for update using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product images admin delete" on storage.objects;
create policy "product images admin delete" on storage.objects
  for delete using (bucket_id = 'product-images' and public.is_admin());

-- ------------------------------------------------------------------
-- Catalog write access for admins (public read already granted in 0001).
-- ------------------------------------------------------------------
drop policy if exists "products admin write" on public.products;
create policy "products admin write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "categories admin write" on public.categories;
create policy "categories admin write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());
