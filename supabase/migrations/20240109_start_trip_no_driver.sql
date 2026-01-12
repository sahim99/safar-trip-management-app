-- Make driver_id nullable to allow creating trips without assigning a driver first
ALTER TABLE public.trips ALTER COLUMN driver_id DROP NOT NULL;
