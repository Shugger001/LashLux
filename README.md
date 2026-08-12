# Lash Lux

Production-ready luxury lash studio site for **Lash Lux** (Manna Apartment, Old Ashongman).

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase · Resend · Vercel

## Brand

- Tagline: *Luxury in every lash.*
- Slogan: *Enhance. Elevate. Empower.*
- Phone / WhatsApp: `0547986899`
- Instagram: [@lashlux_](https://instagram.com/lashlux_)
- Snapchat: `c_tamidu`

Official flyer asset: `public/images/lashlux-flyer.png`

## Features

- Public marketing site (home, services, gallery, about, contact)
- Multi-step appointment booking with availability checks
- Email/password + Google OAuth (Supabase Auth)
- Role-based admin (`client` / `admin`) with middleware protection
- Admin: appointments, services, gallery, testimonials, clients, settings
- Demo mode works without Supabase env vars (seeded local data)

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase setup

1. Create a Supabase project (or use the connected Hasana/Lash Lux project).
2. Run the migration in `supabase/migrations/001_initial_schema.sql`.
3. Enable Email and Google providers under Authentication → Providers.
4. Add redirect URL: `http://localhost:3000/auth/callback` (and your production URL).
5. Create a Storage bucket named `gallery` (public) if you plan to upload images.
6. Promote an admin after signup:

```sql
update public.users set role = 'admin' where id = '<your-auth-user-uuid>';
```

## Environment variables

See `.env.example`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the project in Vercel.
3. Add env vars for Preview + Production.
4. Set `NEXT_PUBLIC_SITE_URL` to your production domain.
5. Deploy.
