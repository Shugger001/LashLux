-- Lash Lux, initial schema + RLS
-- Run via Supabase SQL editor or CLI: supabase db push

-- Extensions
create extension if not exists "pgcrypto";

-- Profiles (extends auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'client' check (role in ('client', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  duration integer not null check (duration > 0),
  category text not null default 'Classic',
  image_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  service_id uuid not null references public.services (id) on delete restrict,
  appointment_date date not null,
  appointment_time time not null,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  notes text,
  client_name text,
  client_email text,
  client_phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  title text not null default '',
  description text,
  category text not null default 'Classic',
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_image text,
  content text not null,
  rating integer not null check (rating between 1 and 5),
  service_used text,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text not null default '',
  type text not null default 'text' check (type in ('text', 'json', 'boolean'))
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_appointments_date on public.appointments (appointment_date);
create index if not exists idx_appointments_user on public.appointments (user_id);
create index if not exists idx_appointments_status on public.appointments (status);
create index if not exists idx_appointments_slot on public.appointments (appointment_date, appointment_time)
  where status <> 'cancelled';
create index if not exists idx_services_active on public.services (is_active, sort_order);
create index if not exists idx_gallery_category on public.gallery (category);
create index if not exists idx_testimonials_approved on public.testimonials (is_approved);

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_updated_at on public.users;
create trigger users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

drop trigger if exists appointments_updated_at on public.appointments;
create trigger appointments_updated_at
  before update on public.appointments
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, full_name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'role', 'client')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Admin helper
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$;

-- RLS
alter table public.users enable row level security;
alter table public.services enable row level security;
alter table public.appointments enable row level security;
alter table public.gallery enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_settings enable row level security;
alter table public.contact_messages enable row level security;

-- users policies
drop policy if exists "Users can view own profile" on public.users;
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.users where id = auth.uid()));

drop policy if exists "Admins manage users" on public.users;
create policy "Admins manage users"
  on public.users for all
  using (public.is_admin());

-- services policies
drop policy if exists "Public can view active services" on public.services;
create policy "Public can view active services"
  on public.services for select
  using (is_active = true or public.is_admin());

drop policy if exists "Admins manage services" on public.services;
create policy "Admins manage services"
  on public.services for all
  using (public.is_admin());

-- appointments policies
drop policy if exists "Users view own appointments" on public.appointments;
create policy "Users view own appointments"
  on public.appointments for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users create own appointments" on public.appointments;
create policy "Users create own appointments"
  on public.appointments for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users cancel own appointments" on public.appointments;
create policy "Users cancel own appointments"
  on public.appointments for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "Admins manage appointments" on public.appointments;
create policy "Admins manage appointments"
  on public.appointments for all
  using (public.is_admin());

-- gallery policies
drop policy if exists "Public view gallery" on public.gallery;
create policy "Public view gallery"
  on public.gallery for select
  using (true);

drop policy if exists "Admins manage gallery" on public.gallery;
create policy "Admins manage gallery"
  on public.gallery for all
  using (public.is_admin());

-- testimonials policies
drop policy if exists "Public view approved testimonials" on public.testimonials;
create policy "Public view approved testimonials"
  on public.testimonials for select
  using (is_approved = true or public.is_admin());

drop policy if exists "Anyone can submit testimonials" on public.testimonials;
create policy "Anyone can submit testimonials"
  on public.testimonials for insert
  with check (is_approved = false);

drop policy if exists "Admins manage testimonials" on public.testimonials;
create policy "Admins manage testimonials"
  on public.testimonials for all
  using (public.is_admin());

-- site_settings policies
drop policy if exists "Public read settings" on public.site_settings;
create policy "Public read settings"
  on public.site_settings for select
  using (true);

drop policy if exists "Admins manage settings" on public.site_settings;
create policy "Admins manage settings"
  on public.site_settings for all
  using (public.is_admin());

-- contact_messages policies
drop policy if exists "Anyone can send contact message" on public.contact_messages;
create policy "Anyone can send contact message"
  on public.contact_messages for insert
  with check (true);

drop policy if exists "Admins manage contact messages" on public.contact_messages;
create policy "Admins manage contact messages"
  on public.contact_messages for all
  using (public.is_admin());

-- Storage buckets (run in dashboard or via API)
-- insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true);
-- insert into storage.buckets (id, name, public) values ('services', 'services', true);

-- Seed services (aligned with official Lash Lux flyer)
insert into public.services (name, description, price, duration, category, image_url, is_active, sort_order)
values
  ('Classic Lashes', 'Natural & timeless, one extension per natural lash for everyday elegance.', 250, 120, 'Classic', 'https://images.unsplash.com/photo-1583003879471-c8e003cdc6ea?w=800&q=80', true, 1),
  ('Hybrid Lashes', 'The perfect blend of natural & volume for soft dimension.', 300, 135, 'Hybrid', 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80', true, 2),
  ('Volume Lashes', 'Fuller & fluffier handmade fans for elevated glam.', 350, 150, 'Volume', 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80', true, 3),
  ('Mega Volume Lashes', 'Bold & dramatic density for maximum impact.', 450, 180, 'Volume', 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80', true, 4),
  ('Lash Removal', 'Safe & gentle professional removal that protects your natural lashes.', 80, 30, 'Specialty', 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80', true, 5),
  ('Lash Care Products', 'Keep your lashes luxe with curated aftercare essentials.', 60, 15, 'Specialty', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80', true, 6)
on conflict do nothing;

-- Seed gallery
insert into public.gallery (image_url, title, description, category, is_featured)
values
  ('https://images.unsplash.com/photo-1583003879471-c8e003cdc6ea?w=1000&q=80', 'Soft Classic Set', 'Everyday elegance', 'Classic', true),
  ('https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=1000&q=80', 'Hybrid Glow', 'Textured fullness', 'Hybrid', true),
  ('https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1000&q=80', 'Volume Drama', 'Fluffy volume fans', 'Volume', true),
  ('https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1000&q=80', 'Mega Night Out', 'Bold mega volume', 'Volume', false),
  ('https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=1000&q=80', 'Natural Lift', 'Lifted natural lashes', 'Specialty', false),
  ('https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1000&q=80', 'Tinted Definition', 'Soft tint finish', 'Specialty', false),
  ('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1000&q=80', 'Bridal Classic', 'Soft bridal set', 'Classic', true),
  ('https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1000&q=80', 'Cat-Eye Hybrid', 'Elongated hybrid look', 'Hybrid', false)
on conflict do nothing;

-- Seed testimonials
insert into public.testimonials (client_name, content, rating, service_used, is_approved)
values
  ('Amara K.', 'The most natural volume set I have ever worn. Soft, fluffy, and lasted beautifully.', 5, 'Volume Lashes', true),
  ('Jade M.', 'Lash Lux is meticulous, my classic set looked perfect from every angle.', 5, 'Classic Lashes', true),
  ('Sofia R.', 'Hybrid lashes gave me the exact balance of glam and everyday wear I wanted.', 5, 'Hybrid Lashes', true),
  ('Nina T.', 'Clean studio, gentle technique, and she listened to exactly what I wanted.', 5, 'Mega Volume', true)
on conflict do nothing;

-- Seed site settings
insert into public.site_settings (key, value, type)
values
  ('business_name', 'Lash Lux', 'text'),
  ('tagline', 'Luxury in every lash.', 'text'),
  ('phone', '0547986899', 'text'),
  ('email', 'hello@lashlux.com', 'text'),
  ('address', 'Manna Apartment, Old Ashongman', 'text'),
  ('hours', '{"mon":"10:00 AM - 6:00 PM","tue":"10:00 AM - 6:00 PM","wed":"10:00 AM - 6:00 PM","thu":"10:00 AM - 7:00 PM","fri":"10:00 AM - 7:00 PM","sat":"9:00 AM - 5:00 PM","sun":"By appointment"}', 'json'),
  ('instagram', 'https://instagram.com/lashlux_', 'text'),
  ('facebook', 'https://facebook.com/lashlux', 'text'),
  ('tiktok', 'https://tiktok.com/@lashlux_', 'text'),
  ('snapchat', 'c_tamidu', 'text'),
  ('whatsapp', 'https://wa.me/233547986899', 'text'),
  ('buffer_minutes', '15', 'text'),
  ('max_days_ahead', '60', 'text'),
  ('booking_open_time', '09:00', 'text'),
  ('booking_close_time', '18:00', 'text'),
  ('seo_title', 'Lash Lux | Luxury Lash Extensions', 'text'),
  ('seo_description', 'Book classic, hybrid, volume, and mega volume lashes with Lash Lux, luxury in every lash at Manna Apartment, Old Ashongman.', 'text'),
  ('map_embed_url', 'https://www.google.com/maps?q=Manna%20Apartment%20Old%20Ashongman&output=embed', 'text'),
  ('about_bio', 'At Lash Lux, every set is customized to your eye shape, lifestyle, and desired glam, from natural classic to bold mega volume. Premium products, gentle technique, and results that last.', 'text')
on conflict (key) do nothing;
