import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Create a server-side supabase client (for use in Server Components and Server Actions)
export const createServerSupabaseClient = () => {
  const cookieStore = cookies()

  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

// Create a server-side supabase admin client with service role key
export const createServerAdminClient = () => {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
