-- Fix: anon/authenticated could not EXECUTE public.is_admin(), so any RLS
-- policy that referenced it failed (including "Public can view active services").
-- That made getServices() fall back to demo-* IDs and broke online booking.

grant execute on function public.is_admin() to anon, authenticated;

-- Keep public reads free of is_admin(); admins still use manage policies.
drop policy if exists "Public can view active services" on public.services;
create policy "Public can view active services"
  on public.services for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "Public view approved testimonials" on public.testimonials;
create policy "Public view approved testimonials"
  on public.testimonials for select
  to anon, authenticated
  using (is_approved = true);
