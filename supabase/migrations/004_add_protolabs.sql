-- Migration: Add Proto Labs integration columns to orders table

-- Add Proto Labs order tracking
alter table public.orders add column if not exists proto_labs_order_id text;
alter table public.orders add column if not exists proto_labs_status text default 'pending' check (proto_labs_status in ('pending', 'submitted', 'in_production', 'quality_check', 'shipped', 'delivered'));
alter table public.orders add column if not exists tracking_number text;

-- Create index for Proto Labs order lookups
create index if not exists idx_orders_proto_labs on public.orders(proto_labs_order_id);

-- Add comment explaining the columns
comment on column public.orders.proto_labs_order_id is 'Proto Labs manufacturing order ID';
comment on column public.orders.proto_labs_status is 'Manufacturing status at Proto Labs';
comment on column public.orders.tracking_number is 'Shipping tracking number from Proto Labs';
