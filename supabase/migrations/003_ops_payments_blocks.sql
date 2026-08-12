-- Ops: no-shows, deposits, reminders, blocked times, analytics

-- Appointment status: add no_show
alter table public.appointments
  drop constraint if exists appointments_status_check;

alter table public.appointments
  add constraint appointments_status_check
  check (status in ('pending', 'confirmed', 'completed', 'cancelled', 'no_show'));

-- Payment + reminder columns
alter table public.appointments
  add column if not exists payment_status text not null default 'none'
    check (payment_status in ('none', 'pending', 'paid', 'failed', 'refunded'));

alter table public.appointments
  add column if not exists payment_reference text;

alter table public.appointments
  add column if not exists deposit_amount numeric(10, 2) not null default 0
    check (deposit_amount >= 0);

alter table public.appointments
  add column if not exists reminder_sent_at timestamptz;

create unique index if not exists idx_appointments_payment_reference
  on public.appointments (payment_reference)
  where payment_reference is not null;

create index if not exists idx_appointments_reminder
  on public.appointments (appointment_date, status, reminder_sent_at)
  where status in ('pending', 'confirmed') and reminder_sent_at is null;

-- Closed days / blocked slots
create table if not exists public.blocked_times (
  id uuid primary key default gen_random_uuid(),
  block_date date not null,
  start_time time,
  end_time time,
  reason text not null default '',
  created_at timestamptz not null default now(),
  constraint blocked_times_range_check check (
    (start_time is null and end_time is null)
    or (start_time is not null and end_time is not null and end_time > start_time)
  )
);

create index if not exists idx_blocked_times_date
  on public.blocked_times (block_date);

alter table public.blocked_times enable row level security;

drop policy if exists "Public read blocked times" on public.blocked_times;
create policy "Public read blocked times"
  on public.blocked_times for select
  using (true);

drop policy if exists "Admins manage blocked times" on public.blocked_times;
create policy "Admins manage blocked times"
  on public.blocked_times for all
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.blocked_times to anon, authenticated;
grant all on public.blocked_times to authenticated;

-- Lightweight funnel analytics (no PII)
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  path text,
  props jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_analytics_events_name_created
  on public.analytics_events (event_name, created_at desc);

alter table public.analytics_events enable row level security;

drop policy if exists "Anyone can insert analytics" on public.analytics_events;
create policy "Anyone can insert analytics"
  on public.analytics_events for insert
  with check (true);

drop policy if exists "Admins read analytics" on public.analytics_events;
create policy "Admins read analytics"
  on public.analytics_events for select
  using (public.is_admin());

grant insert on public.analytics_events to anon, authenticated;
grant select on public.analytics_events to authenticated;

-- Deposit settings + fill packages as services
insert into public.site_settings (key, value, type)
values
  ('deposit_enabled', 'false', 'boolean'),
  ('deposit_amount', '50', 'text'),
  ('deposit_note', 'A small deposit holds your eyelash fixing appointment.', 'text')
on conflict (key) do nothing;

insert into public.services (name, description, price, duration, category, image_url, is_active, sort_order)
select * from (values
  (
    '2-Week Fill',
    'Refresh your set within 2 weeks for lasting fullness between full appointments.',
    180::numeric,
    75,
    'Specialty',
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80',
    true,
    7
  ),
  (
    '3-Week Fill',
    'Fill package for sets needing a fuller refresh around the 3-week mark.',
    220::numeric,
    90,
    'Specialty',
    'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80',
    true,
    8
  )
) as v(name, description, price, duration, category, image_url, is_active, sort_order)
where not exists (
  select 1 from public.services s where s.name = v.name
);
