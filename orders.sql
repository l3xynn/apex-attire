create table if not exists public.store_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid not null references auth.users (id),
  customer_name text not null check (length(customer_name) between 2 and 120),
  customer_email text not null,
  customer_phone text not null,
  delivery_state text,
  delivery_city text,
  delivery_address text,
  customer_notes text not null default '',
  fulfilment text not null check (fulfilment in ('delivery', 'pickup')),
  payment_method text not null check (payment_method in ('paystack', 'cod')),
  payment_status text not null check (payment_status in ('awaiting_payment', 'paid', 'pay_on_delivery', 'payment_failed')),
  is_test boolean not null default false,
  order_status text not null default 'new' check (order_status in ('new', 'confirmed', 'dispatched', 'completed', 'cancelled')),
  subtotal_naira integer not null check (subtotal_naira >= 0),
  delivery_fee_naira integer not null check (delivery_fee_naira >= 0),
  total_naira integer not null check (total_naira = subtotal_naira + delivery_fee_naira),
  items jsonb not null check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) > 0),
  paystack_reference text unique,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists store_orders_user_created_idx on public.store_orders (user_id, created_at desc);
create index if not exists store_orders_created_idx on public.store_orders (created_at desc);

alter table public.store_orders enable row level security;
revoke all on public.store_orders from anon, authenticated;
grant select on public.store_orders to authenticated;

drop policy if exists "Customers can read their orders" on public.store_orders;
create policy "Customers can read their orders" on public.store_orders
for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "Admin can read all orders" on public.store_orders;
create policy "Admin can read all orders" on public.store_orders
for select to authenticated using (
  exists (select 1 from public.admin_users where user_id = (select auth.uid()))
);
