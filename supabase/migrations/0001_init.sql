-- ============================================================
-- Luxe Universal Wears — Initial schema
-- Postgres / Supabase. Run as a migration.
-- ============================================================

-- ---------- Catalog ----------
create table if not exists public.categories (
  slug          text primary key,
  name          text not null,
  "group"       text not null,
  subcategories text[] not null default '{}',
  image         text,
  created_at    timestamptz not null default now()
);

create table if not exists public.products (
  id            text primary key,
  slug          text not null unique,
  name          text not null,
  category      text references public.categories(slug),
  category_name text not null,
  "group"       text not null,
  subcategory   text default '',
  brand         text not null default 'Luxe Universal',
  price         integer not null,
  compare_price integer,
  currency      text not null default 'NGN',
  colors        text[] not null default '{}',
  sizes         text[] not null default '{}',
  description   text,
  fabric        text,
  care          text,
  tags          text[] not null default '{}',
  images        text[] not null default '{}',
  rating        numeric(2,1) not null default 4.5,
  reviews       integer not null default 0,
  stock         integer not null default 0,
  sku           text,
  is_new        boolean not null default false,
  is_best_seller boolean not null default false,
  is_featured   boolean not null default false,
  created_index integer not null default 0,
  created_at    timestamptz not null default now()
);
create index if not exists products_category_idx on public.products(category);
create index if not exists products_group_idx on public.products("group");

-- ---------- Customer profile ----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  phone       text,
  reward_points integer not null default 0,
  tier        text not null default 'Silver',
  created_at  timestamptz not null default now()
);

create table if not exists public.addresses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  street      text,
  city        text,
  state       text,
  country     text default 'Nigeria',
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists public.measurements (
  user_id   uuid primary key references auth.users(id) on delete cascade,
  chest     numeric, waist numeric, hips numeric, sleeve numeric,
  inseam    numeric, neck numeric, shoulder numeric,
  updated_at timestamptz not null default now()
);

-- ---------- Wishlist & cart ----------
create table if not exists public.wishlists (
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table if not exists public.cart_items (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  size       text not null default 'One Size',
  color      text not null default 'Default',
  quantity   integer not null default 1,
  created_at timestamptz not null default now(),
  unique (user_id, product_id, size, color)
);

-- ---------- Orders ----------
create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete set null,
  order_number     text not null unique,
  status           text not null default 'Processing',
  subtotal         integer not null default 0,
  discount         integer not null default 0,
  shipping         integer not null default 0,
  total            integer not null default 0,
  payment_method   text,
  delivery_method  text,
  shipping_address jsonb,
  contact_email    text,
  created_at       timestamptz not null default now()
);

create table if not exists public.order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders(id) on delete cascade,
  product_id text references public.products(id) on delete set null,
  name       text not null,
  image      text,
  price      integer not null,
  size       text,
  color      text,
  quantity   integer not null default 1
);

-- ---------- Reviews ----------
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  text not null references public.products(id) on delete cascade,
  user_id     uuid references auth.users(id) on delete set null,
  author_name text,
  rating      integer not null check (rating between 1 and 5),
  title       text,
  body        text,
  created_at  timestamptz not null default now()
);

-- ---------- Service requests / leads ----------
create table if not exists public.bespoke_requests (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete set null,
  name          text not null,
  phone         text,
  email         text,
  service       text,
  preferred_date date,
  city          text,
  notes         text,
  status        text not null default 'New',
  created_at    timestamptz not null default now()
);

create table if not exists public.corporate_enquiries (
  id           uuid primary key default gen_random_uuid(),
  company      text not null,
  contact_name text,
  email        text,
  phone        text,
  order_type   text,
  quantity     integer,
  details      text,
  status       text not null default 'New',
  created_at   timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text,
  phone      text,
  subject    text,
  message    text,
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.measurements enable row level security;
alter table public.wishlists enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.bespoke_requests enable row level security;
alter table public.corporate_enquiries enable row level security;
alter table public.contact_messages enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Public read for catalog & reviews
drop policy if exists "catalog_read_categories" on public.categories;
create policy "catalog_read_categories" on public.categories for select using (true);
drop policy if exists "catalog_read_products" on public.products;
create policy "catalog_read_products" on public.products for select using (true);
drop policy if exists "reviews_read" on public.reviews;
create policy "reviews_read" on public.reviews for select using (true);

-- Authenticated users may write reviews
drop policy if exists "reviews_insert" on public.reviews;
create policy "reviews_insert" on public.reviews for insert
  to authenticated with check (auth.uid() = user_id);

-- Profiles: owner only
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select using (auth.uid() = id);
drop policy if exists "profiles_upsert" on public.profiles;
create policy "profiles_upsert" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- Owner-scoped tables (select/insert/update/delete own rows)
do $$
declare t text;
begin
  foreach t in array array['addresses','cart_items','wishlists','orders','measurements']
  loop
    execute format('drop policy if exists "%1$s_own_select" on public.%1$s;', t);
    execute format('create policy "%1$s_own_select" on public.%1$s for select using (auth.uid() = user_id);', t);
    execute format('drop policy if exists "%1$s_own_insert" on public.%1$s;', t);
    execute format('create policy "%1$s_own_insert" on public.%1$s for insert with check (auth.uid() = user_id);', t);
    execute format('drop policy if exists "%1$s_own_update" on public.%1$s;', t);
    execute format('create policy "%1$s_own_update" on public.%1$s for update using (auth.uid() = user_id);', t);
    execute format('drop policy if exists "%1$s_own_delete" on public.%1$s;', t);
    execute format('create policy "%1$s_own_delete" on public.%1$s for delete using (auth.uid() = user_id);', t);
  end loop;
end $$;

-- Order items: visible/insertable when the parent order belongs to the user
drop policy if exists "order_items_select" on public.order_items;
create policy "order_items_select" on public.order_items for select
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
drop policy if exists "order_items_insert" on public.order_items;
create policy "order_items_insert" on public.order_items for insert
  with check (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

-- Lead capture: anyone (incl. anon) may submit; nobody can read via anon key
drop policy if exists "bespoke_insert" on public.bespoke_requests;
create policy "bespoke_insert" on public.bespoke_requests for insert with check (true);
drop policy if exists "corporate_insert" on public.corporate_enquiries;
create policy "corporate_insert" on public.corporate_enquiries for insert with check (true);
drop policy if exists "contact_insert" on public.contact_messages;
create policy "contact_insert" on public.contact_messages for insert with check (true);
drop policy if exists "newsletter_insert" on public.newsletter_subscribers;
create policy "newsletter_insert" on public.newsletter_subscribers for insert with check (true);

-- ============================================================
-- Auto-create a profile when a new auth user signs up
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', ''))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
