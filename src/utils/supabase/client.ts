import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Missing Supabase environment variables!\n\n' +
      'NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url\n' +
      'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key',
  )
}

/**
 * Create a Supabase client for client-side use in Pages Router
 *
 * This client automatically reads cookies set by the server and syncs
 * with the server-side session. Use this in React components, hooks, etc.
 *
 * @example
 * ```tsx
 * import { createClient } from '@/utils/supabase/client'
 *
 * const supabase = createClient()
 * const { data: { user } } = await supabase.auth.getUser()
 * ```
 */
export function createClient() {
  return createBrowserClient(supabaseUrl!, supabasePublishableKey!)
}
