-- 1. Ensure public.owners table has all necessary columns
alter table public.owners add column if not exists email text;
alter table public.owners add column if not exists full_name text;
alter table public.owners add column if not exists phone text;
alter table public.owners add column if not exists role text default 'owner';
alter table public.owners add column if not exists subscription_status text default 'active';

-- 2. Drop existing trigger and function to ensure a clean slate
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 3. Recreate the trigger function with robust logic
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.owners (id, email, full_name, phone, role, subscription_status)
  values (
    new.id,
    new.email,
    -- Handle cases where metadata might be missing
    coalesce(new.raw_user_meta_data->>'full_name', 'App Owner'),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    'owner',
    'active'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(public.owners.full_name, excluded.full_name),
    phone = coalesce(public.owners.phone, excluded.phone);
    
  return new;
end;
$$ language plpgsql security definer; -- 'security definer' is CRITICAL

-- 4. Re-attach the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Ensure permissions are correct (failsafe)
grant usage on schema public to service_role;
grant all on table public.owners to service_role;
grant all on table public.owners to postgres;
