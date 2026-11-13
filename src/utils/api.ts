const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL ?? '').replace(/\/$/, '');

export function functionUrl(name: string): string {
  return `${SUPABASE_URL}/functions/v1/${name}`;
}
