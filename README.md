# Lash Lux

Production-ready website for **Lash Lux**, professional eyelash fixing & lash extensions at Manna Apartment, Old Ashongman.

**Live:** https://lash-lux.vercel.app  
**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase · Resend · Paystack (optional) · Vercel

## Brand

- Business: Professional eyelash fixing & lash extensions
- Tagline: *Luxury in every lash.*
- Slogan: *Enhance. Elevate. Empower.*
- Phone / WhatsApp: `0547986899`
- Instagram: [@lashlux_](https://instagram.com/lashlux_)
- Snapchat: `c_tamidu`

Official flyer asset: `public/images/lashlux-flyer.png`

## Features

- Public marketing site (home, services, gallery, about, contact)
- Multi-step guest booking with availability, blocked times, and WhatsApp deep links
- Optional Paystack deposit (GHS) with webhook verification
- Daily email reminders (Vercel Cron)
- Status emails on confirm / complete / cancel / no-show
- SEO: sitemap, robots, LocalBusiness JSON-LD, OG flyer image
- Light funnel analytics + Vercel Analytics; optional Sentry DSN
- Email/password + Google OAuth (Supabase Auth)
- Role-based admin: appointments (list/day/week), blocked times, services, gallery, testimonials, clients, settings
- Demo mode works without Supabase env vars (seeded local data)
- Playwright smoke tests for home → book and admin gate

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase setup

1. Create a Supabase project (or use the connected Hasana/Lash Lux project).
2. Run migrations in `supabase/migrations/` (`001`, `002`, `003`).
3. Enable Email and Google providers under Authentication → Providers.
4. Add redirect URL: `http://localhost:3000/auth/callback` and `https://lash-lux.vercel.app/auth/callback`.
5. Create a Storage bucket named `gallery` (public) if you plan to upload images.
6. Promote an admin after signup:

```sql
update public.users set role = 'admin' where id = '<your-auth-user-uuid>';
```

Set `NEXT_PUBLIC_SITE_URL=https://lash-lux.vercel.app` in production.

## Environment variables

See `.env.example`.

Important production keys:

| Key | Purpose |
| --- | --- |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | Booking, reminder, status, contact emails |
| `CRON_SECRET` | Protects `/api/cron/reminders` (Vercel Cron) |
| `PAYSTACK_SECRET_KEY` + `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Optional deposits |
| `NEXT_PUBLIC_DEPOSIT_ENABLED=true` | Turns on deposit checkout |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional browser error capture |

Paystack webhook URL: `https://lash-lux.vercel.app/api/paystack/webhook`

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test:e2e
```

## Ops checklist (after launch)

1. **Real gallery photos** — upload client sets in Admin → Gallery (replace Unsplash seeds).
2. **Google Business Profile** — claim the Old Ashongman listing and link https://lash-lux.vercel.app.
3. **Custom domain** — point DNS to Vercel and set `NEXT_PUBLIC_SITE_URL`.
4. **Resend** — verify sending domain so booking emails are not skipped.
5. **Deposits** — set Paystack keys + `NEXT_PUBLIC_DEPOSIT_ENABLED=true` when ready.
6. **Cron** — set `CRON_SECRET` in Vercel so 8:00 UTC reminders run for **confirmed** appointments tomorrow (failed/skipped sends are retried; `reminder_sent_at` is only set after a successful email).
7. Smoke-check home + `/book` after every production deploy.

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the project in Vercel.
3. Add env vars for Preview + Production.
4. Set `NEXT_PUBLIC_SITE_URL` to your production domain.
5. Deploy.
