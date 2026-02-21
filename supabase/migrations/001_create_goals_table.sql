-- Create goals table
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/pkcpampdedzvolbzvcmx/sql

create table if not exists public.goals (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null default '',
  amount numeric not null default 0,
  currency text not null default 'USD',
  target_date timestamptz not null,
  bucket text not null check (bucket in ('safety', 'growth', 'dream')),
  why_it_matters text not null default '',
  priority integer not null default 1,
  created_at timestamptz not null default now()
);

-- Create index for fast user lookups
create index if not exists goals_user_id_idx on public.goals(user_id);

-- Enable Row Level Security
alter table public.goals enable row level security;

-- RLS Policies: users can only access their own goals
create policy "Users can read own goals"
  on public.goals for select
  using (auth.uid() = user_id);

create policy "Users can insert own goals"
  on public.goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update own goals"
  on public.goals for update
  using (auth.uid() = user_id);

create policy "Users can delete own goals"
  on public.goals for delete
  using (auth.uid() = user_id);
