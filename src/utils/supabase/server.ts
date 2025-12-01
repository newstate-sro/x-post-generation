import { createServerClient } from '@supabase/ssr'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { GetServerSidePropsContext } from 'next'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Missing Supabase environment variables!\n\n' +
      'NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url\n' +
      'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key',
  )
}

/**
 * Helper to build cookie string from options
 */
function buildCookieString(
  name: string,
  value: string,
  options?: {
    path?: string
    httpOnly?: boolean
    secure?: boolean
    sameSite?: 'lax' | 'strict' | 'none' | boolean
    maxAge?: number
  },
): string {
  const parts = [`${name}=${value}`]
  if (options?.path) parts.push(`Path=${options.path}`)
  if (options?.httpOnly) parts.push('HttpOnly')
  if (options?.secure) parts.push('Secure')
  const sameSite = typeof options?.sameSite === 'string' ? options.sameSite : 'Lax'
  parts.push(`SameSite=${sameSite}`)
  if (options?.maxAge) parts.push(`Max-Age=${options.maxAge}`)
  return parts.join('; ')
}

/**
 * Create a Supabase client for API routes (Pages Router)
 *
 * @example
 * ```tsx
 * export default async function handler(req, res) {
 *   const supabase = createClient(req, res)
 *   const { data: { user } } = await supabase.auth.getUser()
 *   // ...
 * }
 * ```
 */
export function createClient(req: NextApiRequest, res: NextApiResponse) {
  return createServerClient(supabaseUrl as string, supabasePublishableKey as string, {
    cookies: {
      getAll() {
        return Object.entries(req.cookies).map(([name, value]) => ({
          name,
          value: value || '',
        }))
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          res.setHeader('Set-Cookie', buildCookieString(name, value, options))
        })
      },
    },
  })
}

/**
 * Create a Supabase client for getServerSideProps (Pages Router)
 *
 * @example
 * ```tsx
 * export const getServerSideProps = async (context) => {
 *   const supabase = createClientForSSR(context)
 *   const { data: { user } } = await supabase.auth.getUser()
 *   // ...
 * }
 * ```
 */
export function createClientForSSR(context: GetServerSidePropsContext) {
  return createServerClient(supabaseUrl as string, supabasePublishableKey as string, {
    cookies: {
      getAll() {
        return Object.entries(context.req.cookies).map(([name, value]) => ({
          name,
          value: value || '',
        }))
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          context.res.setHeader('Set-Cookie', buildCookieString(name, value, options))
        })
      },
    },
  })
}
