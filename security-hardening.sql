revoke insert (path) on public.store_page_views from anon, authenticated;
revoke insert on public.store_page_views from anon, authenticated;
drop policy if exists "Anyone can record a page view" on public.store_page_views;
