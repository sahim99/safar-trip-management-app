-- Add address column to drivers table
alter table public.drivers 
add column if not exists address text;

-- Update RLS to allow reading address (existing policy should cover select *)
