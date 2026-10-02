create table if not exists public.customer_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name varchar(120) not null,
  phone varchar(30) not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.delivery_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label varchar(60) not null,
  address_line1 varchar(200) not null,
  address_line2 varchar(200),
  city varchar(100) not null,
  state varchar(100) not null,
  postal_code varchar(20),
  created_at timestamptz not null default now()
);

create index if not exists delivery_addresses_user_id_idx
  on public.delivery_addresses (user_id);

alter table public.customer_profiles enable row level security;
alter table public.delivery_addresses enable row level security;

revoke all on public.customer_profiles from anon, authenticated;
revoke all on public.delivery_addresses from anon, authenticated;
grant select, insert, update on public.customer_profiles to authenticated;
grant select, insert, update, delete on public.delivery_addresses to authenticated;

drop policy if exists "Customers can read their profile" on public.customer_profiles;
create policy "Customers can read their profile"
  on public.customer_profiles for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Customers can create their profile" on public.customer_profiles;
create policy "Customers can create their profile"
  on public.customer_profiles for insert to authenticated
  with check ((select auth.uid()) = id);

drop policy if exists "Customers can update their profile" on public.customer_profiles;
create policy "Customers can update their profile"
  on public.customer_profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Customers can read their addresses" on public.delivery_addresses;
create policy "Customers can read their addresses"
  on public.delivery_addresses for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Customers can add their addresses" on public.delivery_addresses;
create policy "Customers can add their addresses"
  on public.delivery_addresses for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Customers can remove their addresses" on public.delivery_addresses;
create policy "Customers can remove their addresses"
  on public.delivery_addresses for delete to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Customers can update their addresses" on public.delivery_addresses;
create policy "Customers can update their addresses"
  on public.delivery_addresses for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
