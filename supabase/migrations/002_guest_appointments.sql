-- Guest bookings: allow appointments without an auth user
alter table public.appointments
  alter column user_id drop not null;

-- Helpful index for overlap checks
create index if not exists idx_appointments_day_active
  on public.appointments (appointment_date, appointment_time)
  where status <> 'cancelled';
