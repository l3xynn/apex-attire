grant update on public.delivery_addresses to authenticated;

drop policy if exists "Customers can update their addresses" on public.delivery_addresses;
create policy "Customers can update their addresses"
  on public.delivery_addresses for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
