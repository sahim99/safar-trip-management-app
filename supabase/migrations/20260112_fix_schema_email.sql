-- Fix: Add missing email column to owners table required by the V2 trigger
alter table public.owners 
add column if not exists email text;

-- Optional: Create an index on email for faster lookups if needed later
create index if not exists owners_email_idx on public.owners(email);
