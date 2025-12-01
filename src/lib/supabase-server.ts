import { createClientForSSR } from '@/utils/supabase/server'
import type { User } from '@supabase/supabase-js'
import type { GetServerSidePropsContext } from 'next'

/**
 * Get the authenticated user from getServerSideProps context
 * @returns User if authenticated, null otherwise
 */
export async function getServerUser(context: GetServerSidePropsContext): Promise<User | null> {
  const supabase = createClientForSSR(context)
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  return error || !user ? null : user
}

/**
 * Require authentication for server-side pages
 * Use in getServerSideProps to protect routes
 * @returns User object if authenticated, or redirect to /login
 */
export async function requireAuth(
  context: GetServerSidePropsContext,
): Promise<{ user: User } | { redirect: { destination: string; permanent: boolean } }> {
  const user = await getServerUser(context)

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return { user }
}
