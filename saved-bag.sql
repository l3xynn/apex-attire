create table if not exists public.saved_bag_items (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id varchar(100) not null,
  size varchar(30) not null,
  colour varchar(80) not null default '',
  quantity smallint not null check (quantity between 1 and 10),
  updated_at timestamptz not null default now(),
  primary key (user_id, product_id, size, colour)
);

alter table public.saved_bag_items enable row level security;

revoke all on public.saved_bag_items from anon, authenticated;
grant select, insert, update, delete on public.saved_bag_items to authenticated;

create policy "Customers can read their bag"
  on public.saved_bag_items for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Customers can add to their bag"
  on public.saved_bag_items for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Customers can update their bag"
  on public.saved_bag_items for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Customers can remove from their bag"
  on public.saved_bag_items for delete to authenticated
  using ((select auth.uid()) = user_id);
