import { prisma } from '@/lib/PrismaClient'
import { NextApiRequest, NextApiResponse } from 'next'
import z from 'zod'
import { FacebookPost, Post, Reaction, TrackedEntity } from '../../../../generated/prisma/client'

type Data = Post & {
  reactions: (Reaction & { trackedEntity: TrackedEntity })[]
  facebookPost: FacebookPost
  trackedEntity: TrackedEntity
}
type ErrorResponse = { error: string }

const paramsSchema = z.object({
  api_secret: z.string().min(1, 'api_secret is required'),
  id: z.string().min(1, 'id is required'),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorResponse>,
) {
  const { method, query } = req
  const { data, error } = paramsSchema.safeParse(query)

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  const { api_secret, id } = data

  if (api_secret !== process.env.API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (method === 'GET') {
    try {
      const post = await prisma.post.findUnique({
        where: { id, facebookPost: { isNot: null } },
        include: {
          reactions: {
            include: {
              trackedEntity: true,
            },
          },
          trackedEntity: true,
          facebookPost: true,
        },
      })

      if (!post) {
        return res.status(404).json({ error: 'Post not found' })
      }

      if (!post.facebookPost) {
        return res.status(404).json({ error: 'Facebook post not found' })
      }

      return res.status(200).json({
        ...post,
        facebookPost: post.facebookPost,
      })
    } catch (error) {
      console.error('ERROR handler:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
