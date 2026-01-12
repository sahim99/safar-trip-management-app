-- Create a function that handles new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.owners (id, full_name, phone, role, subscription_status)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    'owner',
    'active'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
