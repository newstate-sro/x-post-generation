import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, headers } = req

  const authHeader = headers.authorization
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (method === 'GET') {
    const currentTime = new Date()
    return NextResponse.json({
      message: 'Hello, world from cron test!',
      currentTimeISO: currentTime.toISOString(),
      currentTimeUTC: currentTime.toUTCString(),
      currentTimeLocale: currentTime.toLocaleString(),
      currentTime: currentTime,
    })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
