# Supabase Backend Setup

This directory holds Supabase-specific backend resources:

- `supabase/migrations/` — database schema migrations for Supabase
- `supabase/functions/api/` — Supabase Edge Functions (Deno), deployed via Supabase CLI

## Current structure

- `supabase/migrations/0001_init.sql`
- `supabase/functions/api/index.tsx` — Supabase Edge Function (Hono API)
- `supabase/functions/api/kv_store.tsx` — KV store helper for the Edge Function

**Netlify Functions** (Paystack, Turnstile) live in `netlify/functions/` and are deployed by Netlify, not Supabase:

- `netlify/functions/paystack-init.js`
- `netlify/functions/paystack-webhook.js`
- `netlify/functions/verify-turnstile.js`

## Environment variables

Use `ENV.example` as a template for required values:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `PAYSTACK_SECRET_KEY`
- `VITE_PAYSTACK_PUBLIC_KEY`
- `VITE_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

Optional Paystack URL overrides:

- `PAYSTACK_CALLBACK_URL` — live callback that Paystack should redirect to after successful payment
- `PAYSTACK_WEBHOOK_URL` — live webhook URL to configure in the Paystack dashboard

### Live Paystack URLs

- Callback URL: `https://<YOUR_LIVE_DOMAIN>/payment-success`
- Webhook URL: `https://<YOUR_LIVE_DOMAIN>/.netlify/functions/paystack-webhook`

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

- `netlify.toml` uses `netlify/functions` for Netlify serverless functions (Paystack, Turnstile).
- `supabase/functions/api/` is deployed separately with `supabase functions deploy api`.
- Do not point Netlify at `supabase/functions/` — Edge Function code uses Deno imports (`npm:`, `jsr:`) that Netlify cannot bundle.
