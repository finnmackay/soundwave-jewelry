-- Migration: Add shipping address to orders table

-- Add shipping_address column
alter table public.orders add column if not exists shipping_address jsonb;

-- Add shipping_status column for tracking
alter table public.orders add column if not exists shipping_status text default 'pending' check (shipping_status in ('pending', 'processing', 'shipped', 'delivered'));

-- Add tracking_number column
alter table public.orders add column if not exists tracking_number text;
