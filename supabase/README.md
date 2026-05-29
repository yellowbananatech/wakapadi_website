# Supabase Backend Setup

This directory holds backend resources for the site:

- `supabase/db/migrations/` — database schema migrations for Supabase
- `supabase/functions/` — backend functions used by the app

## Current structure

- `supabase/db/migrations/0001_init.sql`
- `supabase/functions/paystack-init.js`
- `supabase/functions/paystack-webhook.js`
- `supabase/functions/verify-turnstile.js`
- `supabase/functions/api/index.tsx`
- `supabase/functions/api/kv_store.tsx`

## Environment variables

Use `ENV.example` as a template for required values:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `PAYSTACK_SECRET_KEY`
- `VITE_PAYSTACK_PUBLIC_KEY`
- `VITE_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

## Supabase CLI workflow

1. Log in:
   ```bash
   supabase login
   ```
2. Link the project:
   ```bash
   supabase link --project-ref laxhlyxcmuusbxmoujny
   ```
3. Apply migrations:
   ```bash
   supabase db push
   ```
4. Deploy functions:
   ```bash
   supabase functions deploy api
   ```

## Notes

- `netlify.toml` is configured to use `supabase/functions` as the functions directory.
- The `api` directory is a Supabase-compatible function entrypoint for site backend logic.
