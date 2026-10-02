create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;

drop policy if exists "Admins can read own membership" on public.admin_users;
create policy "Admins can read own membership"
on public.admin_users for select to authenticated
using ((select auth.uid()) = user_id);
