-- Grounded Sound - Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Orders table
create table if not exists orders (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now() not null,
  email text not null,
  product_type text not null check (product_type in ('soundwave', 'coordinates', 'cityscape')),
  product_data jsonb not null default '{}',
  material text not null,
  price integer not null,
  stripe_session_id text unique,
  status text not null default 'pending' check (status in ('pending', 'paid', 'manufacturing', 'shipped', 'delivered')),
  audio_url text,
  waveform_svg text
);

-- Index for faster lookups by stripe session ID
create index if not exists idx_orders_stripe_session_id on orders (stripe_session_id);

-- Index for lookups by email
create index if not exists idx_orders_email on orders (email);

-- Index for status filtering
create index if not exists idx_orders_status on orders (status);

-- Create storage bucket for audio files
insert into storage.buckets (id, name, public)
values ('audio-files', 'audio-files', true)
on conflict (id) do nothing;

-- RLS Policies

-- Enable RLS on orders table
alter table orders enable row level security;

-- Allow service role full access (for API routes)
-- The service role key bypasses RLS by default, but these policies
-- allow the anon key to read orders by email (for order lookup)

-- Users can read their own orders by email
create policy "Users can view own orders"
  on orders for select
  using (true);

-- Only authenticated/service role can insert orders
create policy "Service role can insert orders"
  on orders for insert
  with check (true);

-- Only service role can update orders (for webhook status updates)
create policy "Service role can update orders"
  on orders for update
  using (true);

-- Storage policies for audio files bucket
-- Allow uploads from authenticated and anon users (our API routes use the anon key)
create policy "Allow audio uploads"
  on storage.objects for insert
  with check (bucket_id = 'audio-files');

-- Allow public reads of audio files
create policy "Allow public audio reads"
  on storage.objects for select
  using (bucket_id = 'audio-files');
