import { prisma } from '@/lib/PrismaClient'
import { NextApiRequest, NextApiResponse } from 'next'
import z from 'zod'
import { FacebookPost, Post, Reaction, TrackedEntity } from '../../../generated/prisma/client'

type Pagination = {
  limit: number
  total: number
  currentPage: number
  totalPages: number
}

type Data = {
  data: (Post & {
    reactions: Reaction[]
    facebookPost: FacebookPost
    trackedEntity: TrackedEntity
  })[]
  pagination: Pagination
}
type ErrorResponse = {
  error: string
}

const createPagination = (total: number, page: number, limit: number) => {
  const totalPages = Math.ceil(total / limit)

  return { limit, total, currentPage: page, totalPages }
}

const paramsSchema = z.object({
  api_secret: z.string().min(1, 'api_secret is required'),
  limit: z.coerce
    .number()
    .min(1, 'limit is required')
    .max(20, 'limit must be less than or equal to 20'),
  page: z.coerce.number().min(1, 'page is required'),
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

  const { api_secret, limit, page } = data

  if (api_secret !== process.env.API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (method === 'GET') {
    try {
      const posts = await prisma.post.findMany({
        take: limit,
        skip: (page - 1) * limit,
        include: {
          reactions: true,
          facebookPost: true,
          trackedEntity: true,
        },
        where: {
          facebookPost: {
            isNot: null,
          },
        },
        orderBy: {
          facebookPost: {
            postedAt: 'desc',
          },
        },
      })
      const total = await prisma.post.count({
        where: {
          facebookPost: {
            isNot: null,
          },
        },
      })

      const responseData = posts.map((post) => ({
        ...post,
        facebookPost: post.facebookPost!,
      }))

      return res.status(200).json({
        data: responseData,
        pagination: createPagination(total, page, limit),
      })
    } catch (error) {
      console.error('ERROR handler:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
