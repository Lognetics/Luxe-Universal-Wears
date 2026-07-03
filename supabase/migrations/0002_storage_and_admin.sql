-- ============================================================
-- Storage bucket for admin-uploaded product images + admin write
-- ============================================================

-- Public bucket that serves product images uploaded from the admin panel.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- Anyone may read images; writes happen server-side via the service role
-- (which bypasses RLS), so no public write policy is granted.
drop policy if exists "product images public read" on storage.objects;
create policy "product images public read" on storage.objects
  for select using (bucket_id = 'product-images');

-- ------------------------------------------------------------------
-- Admin allowlist. Catalog writes are performed server-side with the
-- service-role key, but we also expose this table so the app can verify
-- whether a logged-in user is an admin.
-- ------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- A logged-in user may check whether their own row exists (is-admin check).
drop policy if exists "admins self read" on public.admins;
create policy "admins self read" on public.admins
  for select using (auth.uid() = user_id);
