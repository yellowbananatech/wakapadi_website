import { jsonResponse, preflight } from '../_shared/http.ts';

Deno.serve((req) => {
  const pre = preflight(req);
  if (pre) return pre;

  const code = req.headers.get('cf-ipcountry') || req.headers.get('x-country-code');
  const country = code && /^[A-Za-z]{2}$/.test(code) ? code.toUpperCase() : null;
  return jsonResponse(200, { country });
});
