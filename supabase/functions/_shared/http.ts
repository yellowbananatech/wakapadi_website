export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-retry-count, traceparent, tracestate, baggage',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

export function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export function preflight(req: Request): Response | null {
  return req.method === 'OPTIONS' ? new Response('ok', { headers: corsHeaders }) : null;
}

export async function readJson<T = Record<string, unknown>>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}

export function getSiteUrl(): string {
  const url = Deno.env.get('SITE_URL') || 'https://mywakapadi.com';
  try {
    return new URL(url).origin;
  } catch {
    return url.replace(/\/$/, '');
  }
}

export function getPaymentSuccessUrl(): string {
  return (
    Deno.env.get('PAYMENT_CALLBACK_URL') ||
    Deno.env.get('FLUTTERWAVE_CALLBACK_URL') ||
    Deno.env.get('PAYSTACK_CALLBACK_URL') ||
    `${getSiteUrl()}/payment-success`
  );
}
