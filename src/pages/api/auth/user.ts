import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '../../../utils/supabase/server'
import type { User } from '@supabase/supabase-js'

type Data = {
  success: boolean
  user?: User
  error?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const supabase = createClient(req, res)
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return res.status(401).json({ success: false, error: 'Not authenticated' })
    }

    return res.status(200).json({ success: true, user })
  } catch (error) {
    console.error('Get user error:', error)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
}
