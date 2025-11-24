import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  // eslint-disable-next-line no-console
  console.warn('SUPABASE_SERVICE_ROLE_KEY is not set; admin client will not work on server routes');
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
