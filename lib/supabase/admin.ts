import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// Supabase Service Role Key is secret and should NEVER be exposed to the client
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// This client bypasses RLS and should only be used in Server Actions / API Routes
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
