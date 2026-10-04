alter table public.store_page_views
  add column if not exists visitor_hash text,
  add column if not exists view_bucket bigint;

create index if not exists store_page_views_created_idx
  on public.store_page_views (created_at desc);

create unique index if not exists store_page_views_rate_limit_idx
  on public.store_page_views (visitor_hash, path, view_bucket)
  where visitor_hash is not null;

revoke insert on public.store_page_views from anon, authenticated;
revoke insert (path) on public.store_page_views from anon, authenticated;

create or replace function public.admin_store_metrics()
returns table (
  views_today bigint,
  views_30_days bigint,
  paid_orders bigint,
  gross_revenue_naira bigint,
  test_paid_orders bigint
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid())
  ) then
    raise exception 'Admin access required' using errcode = '42501';
  end if;

  return query
  select
    (select count(*) from public.store_page_views
      where created_at >= date_trunc('day', now() at time zone 'Africa/Lagos') at time zone 'Africa/Lagos'),
    (select count(*) from public.store_page_views
      where created_at >= now() - interval '30 days'),
    (select count(*) from public.store_orders
      where payment_status = 'paid' and not is_test),
    (select coalesce(sum(total_naira), 0)::bigint from public.store_orders
      where payment_status = 'paid' and not is_test),
    (select count(*) from public.store_orders
      where payment_status = 'paid' and is_test);
end;
$$;

revoke all on function public.admin_store_metrics() from public, anon, authenticated;
grant execute on function public.admin_store_metrics() to authenticated;
