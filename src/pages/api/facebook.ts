import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/PrismaClient'
import { OpenAiService } from '@/services/OpenAiService/OpenAiService'
import { ApifyService } from '@/services/ApifyService/ApifyService'
import type { ApifyPostSuccess } from '@/services/ApifyService/types'
import { parseLlmPostsReactionsResponse } from '@/utils/parseLlmPostsReactionsResponse'
import { TrackedEntityType } from '../../../generated/prisma/enums'
import type { Prisma } from '../../../generated/prisma/client'

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
          lastProcessingTime: 'desc',
        },
      })

      const fbEntitiesOfInterest = await prisma.trackedEntity.findMany()
      const facebookPagesUrls = fbEntitiesOfInterest.map(
        (entityOfInterest) => entityOfInterest.facebookPageUrl,
      )

      // get posts data from Apify
      const response = await apifyService.getPostsData({
        pagesUrls: facebookPagesUrls,
        onlyPostsNewerThan: systemConfiguration.lastProcessingTime,
        captionText: true,
      })

      const extractedFacebookPostsFromApify = (
        response.filter(
          (post) => !('error' in post) || !('errorDescription' in post),
        ) as ApifyPostSuccess[]
      )
        .map((post) => {
          const entityOfInterest = fbEntitiesOfInterest.find(
            (entity) => entity.facebookPageUrl === post.facebookUrl,
          )

          if (!entityOfInterest) {
            return null
          }

          return {
            trackedEntityId: entityOfInterest.id,
            postId: post.postId,
            timestamp: new Date(post.timestamp),
            url: post.url,
            text: post.text ?? '',
            likes: post.likes,
            comments: post.comments,
            shares: post.shares,
            topReactionsCount: post.topReactionsCount,
            isVideo: post.isVideo ?? false,
            viewsCount: post.viewsCount ?? 0,
            fullResponse: JSON.parse(JSON.stringify(post)) as Prisma.InputJsonValue,
          }
        })
        .filter((post): post is NonNullable<typeof post> => post !== null)

      const createdFacebookPosts = await prisma.facebookPost.createManyAndReturn({
        data: extractedFacebookPostsFromApify,
        skipDuplicates: true,
        include: {
          trackedEntity: true,
        },
      })

      if (createdFacebookPosts.length === 0) {
        return res.status(200).json({
          data: {
            newOwnPosts: 0,
            newOtherPosts: 0,
          },
        })
      }

      // we don't want to generate reactions for OWN tracked entities
      const otherFacebookPosts = createdFacebookPosts.filter(
        (post) => post.trackedEntity.type === TrackedEntityType.OTHER,
      )

      const ownFacebookPosts = createdFacebookPosts.filter(
        (post) => post.trackedEntity.type === TrackedEntityType.OWN,
      )

      const openaiResponse = await openAiService.callLlm(
        `Analyze the following Facebook posts from politicians: ${otherFacebookPosts
          .map(
            (facebookPost, index) =>
              `Post ${index + 1}: "${JSON.stringify({
                facebookPostId: facebookPost.id,
                text: facebookPost.text,
              })}"`,
          )
          .join(
            '\n',
          )}. Imagine you are in opposition to the politicians that made those posts. I want you to generate reactions for each of them. Use Slovak language. Return response in JSON format as array of objects with the following structure: { facebookPostId: string, reaction: string }. Content of posts is in 'text' property. Keep reactions in same order as posts were provided. Return just the array of JSON objects, no other text.`,
      )

      const parsedLLMPostsReactions = parseLlmPostsReactionsResponse(openaiResponse)

      const createdFacebookPostReactions = await prisma.facebookPostReaction.createManyAndReturn({
        data: parsedLLMPostsReactions,
      })

      // Add new system configuration to store the time of the last processing once whole process is finished
      // current time created at the beginning of the process to not loose any posts created during the processing
      await prisma.systemConfiguration.create({
        data: { lastProcessingTime: currentTime },
      })

      return res.status(200).json({
        data: {
          newOwnPosts: ownFacebookPosts.length,
          newOtherPosts: otherFacebookPosts.length,
          newOtherPostsReactions: createdFacebookPostReactions.length,
          processingStartedAt: currentTime,
        },
      })
    } catch (error) {
      console.error('ERROR handler:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
