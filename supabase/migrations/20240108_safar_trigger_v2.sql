-- Update the trigger function to capture email and safely handle metadata
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.owners (id, email, full_name, phone, role, subscription_status)
  values (
    new.id,
    new.email, -- Capture the email from auth.users
    coalesce(new.raw_user_meta_data->>'full_name', 'Owner'), -- Fallback if missing
    new.raw_user_meta_data->>'phone',
    'owner',
    'active'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(public.owners.full_name, excluded.full_name),
    phone = coalesce(public.owners.phone, excluded.phone);
    
  return new;
end;
$$ language plpgsql security definer;

-- Ensure the trigger is active (re-running this is safe)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
