create table if not exists public.delivery_rates (
  id bigint generated always as identity primary key,
  state text not null check (length(trim(state)) between 2 and 40),
  city_lga text not null default '' check (city_lga = lower(trim(city_lga)) and length(city_lga) <= 100),
  fee_naira integer not null check (fee_naira >= 0),
  updated_at timestamptz not null default now(),
  unique (state, city_lga)
);

alter table public.delivery_rates enable row level security;
revoke all on public.delivery_rates from anon, authenticated;
grant select on public.delivery_rates to anon, authenticated;
grant insert, update, delete on public.delivery_rates to authenticated;

drop policy if exists "Anyone can read delivery rates" on public.delivery_rates;
create policy "Anyone can read delivery rates" on public.delivery_rates
for select to anon, authenticated using (true);
drop policy if exists "Admin can add delivery rates" on public.delivery_rates;
create policy "Admin can add delivery rates" on public.delivery_rates
for insert to authenticated with check (
  exists (select 1 from public.admin_users where user_id = (select auth.uid()))
);
drop policy if exists "Admin can edit delivery rates" on public.delivery_rates;
create policy "Admin can edit delivery rates" on public.delivery_rates
for update to authenticated using (
  exists (select 1 from public.admin_users where user_id = (select auth.uid()))
) with check (
  exists (select 1 from public.admin_users where user_id = (select auth.uid()))
);
drop policy if exists "Admin can remove delivery rates" on public.delivery_rates;
create policy "Admin can remove delivery rates" on public.delivery_rates
for delete to authenticated using (
  exists (select 1 from public.admin_users where user_id = (select auth.uid()))
);
