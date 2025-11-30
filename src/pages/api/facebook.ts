import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/PrismaClient'
import { OpenAiService } from '../../services/OpenAiService/OpenAiService'
import { ApifyService } from '@/services/ApifyService/ApifyService'
import type { ApifyPostSuccess } from '@/services/ApifyService/types'
import { parseLlmPostsReactionsResponse } from '@/utils/parseLlmPostsReactionsResponse'

type Data = {
  data?: unknown
  error?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { method, query } = req
  const { api_secret } = query

  if (api_secret !== process.env.API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (method === 'GET') {
    try {
      const openAiService = new OpenAiService()
      const apifyService = new ApifyService()

      const currentTime = new Date()

      const systemConfiguration = await prisma.systemConfiguration.findFirstOrThrow({
        orderBy: {
          lastGenerationTime: 'desc',
        },
      })

      const fbEntitiesOfInterest = await prisma.entityOfInterest.findMany({
        where: {
          facebookPageId: {
            not: null,
          },
        },
        include: {
          facebookPage: true,
        },
      })

      const pagesUrls = fbEntitiesOfInterest
        .map((entityOfInterest) => entityOfInterest.facebookPage?.url)
        .filter((url): url is string => !!url)

      const response = await apifyService.getPostsData({
        pagesUrls: pagesUrls,
        onlyPostsNewerThan: systemConfiguration.lastGenerationTime,
        captionText: true,
      })

      console.log('RESPONSE', JSON.stringify(response, null, 2))

      const extractedPosts = (
        response.filter(
          (post) => !('error' in post) || !('errorDescription' in post),
        ) as ApifyPostSuccess[]
      )
        .map((post) => {
          const entityOfInterest = fbEntitiesOfInterest.find(
            (entity) => entity.facebookPage?.url === post.facebookUrl,
          )

          if (!entityOfInterest) {
            return null
          }

          return {
            url: post.url,
            name: post.text ?? '',
            pageUrl: post.facebookUrl,
            pageId: entityOfInterest?.facebookPageId ?? '',
          }
        })
        .filter((post): post is NonNullable<typeof post> => post !== null)

      const createdFacebookPosts = await prisma.facebookPost.createManyAndReturn({
        data: extractedPosts.map((post) => ({
          url: post.url,
          name: post.name,
          pageId: post.pageId,
        })),
        skipDuplicates: true,
      })

      await prisma.systemConfiguration.create({
        data: { lastGenerationTime: currentTime },
      })

      if (createdFacebookPosts.length === 0) {
        return res.status(200).json({
          data: {
            newReactions: 0,
          },
        })
      }

      const openaiResponse = await openAiService.callLlm(
        `Analyze the following Facebook posts from politicians: ${createdFacebookPosts.map((facebookPost, index) => `Post ${index + 1}: "${JSON.stringify(facebookPost)}"`).join('\n')}. Imagine you are in opposition to the politicians that made those posts. I want you to generate reactions for each of them. Use Slovak language. Return response in JSON format as array of objects with the following structure: { id: string, pageId: string, reaction: string }. Keep reactions in same order as posts were provided.`,
      )

      console.log('OPENAI RESPONSE', JSON.stringify(openaiResponse.content, null, 2))

      const parsedResponses = parseLlmPostsReactionsResponse(openaiResponse)

      await prisma.facebookPostReaction.createMany({
        data: parsedResponses.map((response) => {
          return {
            postId: response.id,
            userId: '1',
            reaction: response.reaction,
          }
        }),
      })

      return res.status(200).json({
        data: {
          newReactions: parsedResponses.length,
        },
      })
    } catch (error) {
      console.error('ERROR handler:', error)
      await prisma.logs.create({
        data: {
          source: 'api/facebook',
          message: JSON.stringify(error, null, 2),
        },
      })
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
