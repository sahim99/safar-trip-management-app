-- Create owners table
create table if not exists public.owners (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  company_name text,
  role text default 'owner',
  subscription_plan text default 'free',
  subscription_status text default 'inactive',
  created_at timestamptz default now()
);

-- Turn on RLS for owners
alter table public.owners enable row level security;

-- Owners policies
create policy "Users can view their own owner record"
  on public.owners for select
  using (id = auth.uid());

create policy "Users can insert their own owner record"
  on public.owners for insert
  with check (id = auth.uid());

create policy "Users can update their own owner record"
  on public.owners for update
  using (id = auth.uid());

-- Add owner_id to drivers if not exists
do $$ 
begin 
  if not exists (select 1 from information_schema.columns where table_name = 'drivers' and column_name = 'owner_id') then
    alter table public.drivers add column owner_id uuid references public.owners(id) default auth.uid();
  end if;
end $$;

-- Add owner_id to trips if not exists
do $$ 
begin 
  if not exists (select 1 from information_schema.columns where table_name = 'trips' and column_name = 'owner_id') then
    alter table public.trips add column owner_id uuid references public.owners(id) default auth.uid();
  end if;
end $$;

-- Enable RLS on drivers and trips
alter table public.drivers enable row level security;
alter table public.trips enable row level security;

-- Policies for Drivers
-- (Drop existing if rerunning, strictly speaking we should check existence but simplified here)
drop policy if exists "Users can view own drivers" on public.drivers;
drop policy if exists "Users can insert own drivers" on public.drivers;
drop policy if exists "Users can update own drivers" on public.drivers;
drop policy if exists "Users can delete own drivers" on public.drivers;

create policy "Users can view own drivers"
  on public.drivers for select
  using (owner_id = auth.uid());

create policy "Users can insert own drivers"
  on public.drivers for insert
  with check (owner_id = auth.uid());

create policy "Users can update own drivers"
  on public.drivers for update
  using (owner_id = auth.uid());

create policy "Users can delete own drivers"
  on public.drivers for delete
  using (owner_id = auth.uid());

-- Policies for Trips
drop policy if exists "Users can view own trips" on public.trips;
drop policy if exists "Users can insert own trips" on public.trips;
drop policy if exists "Users can update own trips" on public.trips;
drop policy if exists "Users can delete own trips" on public.trips;

create policy "Users can view own trips"
  on public.trips for select
  using (owner_id = auth.uid());

create policy "Users can insert own trips"
  on public.trips for insert
  with check (owner_id = auth.uid());

create policy "Users can update own trips"
  on public.trips for update
  using (owner_id = auth.uid());

create policy "Users can delete own trips"
  on public.trips for delete
  using (owner_id = auth.uid());
