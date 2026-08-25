import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// During local development, if the .env.local credentials haven't been filled
// in yet, we don't want the whole app to crash — we warn instead so the public
// marketing site still renders (it just won't have live admin-managed data).
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    '[Mutlukal] Supabase yapılandırılmadı. .env.local dosyasına VITE_SUPABASE_URL ve ' +
      'VITE_SUPABASE_ANON_KEY ekleyin (bkz. .env.local.example ve supabase/schema.sql).'
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
