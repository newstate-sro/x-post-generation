import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import type { User } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/supabase-server'

interface AuthenticatedContext extends GetServerSidePropsContext {
  user: User
}

interface GetServerSidePropsResult {
  props?: Record<string, unknown>
  redirect?: { destination: string; permanent: boolean }
  notFound?: boolean
}

/**
 * Higher-order function to protect pages with authentication
 *
 * @example Simple protection:
 * ```tsx
 * export const getServerSideProps = withAuth()
 * ```
 *
 * @example With custom props:
 * ```tsx
 * export const getServerSideProps = withAuth(async (context) => {
 *   const { user } = context
 *   // Fetch user-specific data
 *   return { props: { customData: ... } }
 * })
 * ```
 */
export function withAuth(
  getServerSidePropsFn?: (context: AuthenticatedContext) => Promise<GetServerSidePropsResult>,
): GetServerSideProps {
  return async (context) => {
    const authResult = await requireAuth(context)

    if ('redirect' in authResult) {
      return authResult
    }

    const contextWithUser: AuthenticatedContext = { ...context, user: authResult.user }

    if (getServerSidePropsFn) {
      const result = await getServerSidePropsFn(contextWithUser)
      return {
        ...result,
        props: {
          ...result.props,
          user: authResult.user,
        },
      }
    }

    return {
      props: {
        user: authResult.user,
      },
    }
  }
}
