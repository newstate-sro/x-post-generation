import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req
  const { api_secret } = query

  if (api_secret !== process.env.API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (method === 'GET') {
    const currentTime = new Date()
    return res.status(200).json({
      message: 'Hello, world from cron test!',
      currentTimeISO: currentTime.toISOString(),
      currentTimeUTC: currentTime.toUTCString(),
      currentTimeLocale: currentTime.toLocaleString(),
      currentTime: currentTime,
    })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
