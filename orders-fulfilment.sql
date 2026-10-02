do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'store_orders' and column_name = 'is_test'
  ) then
    alter table public.store_orders add column is_test boolean not null default false;
    update public.store_orders set is_test = true;
  end if;
end $$;

grant update (order_status) on public.store_orders to authenticated;

drop policy if exists "Admin can update order fulfilment" on public.store_orders;
create policy "Admin can update order fulfilment" on public.store_orders
for update to authenticated
using (
  exists (select 1 from public.admin_users where user_id = (select auth.uid()))
)
with check (
  exists (select 1 from public.admin_users where user_id = (select auth.uid()))
  and (not is_test or order_status = 'cancelled')
  and (order_status = 'cancelled' or payment_status in ('paid', 'pay_on_delivery'))
);
