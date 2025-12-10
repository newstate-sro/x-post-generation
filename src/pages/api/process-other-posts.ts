import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/PrismaClient'
import { OpenAiService } from '@/services/OpenAiService/OpenAiService'
import { ApifyService } from '@/services/ApifyService/ApifyService'
import type { ApifyPostSuccess } from '@/services/ApifyService/types'
import { parseLlmPostsReactionsResponse } from '@/utils/parseLlmPostsReactionsResponse'
import {
  CategoryEuSk,
  SystemProcessingType,
  TrackedEntityType,
  type Prisma,
} from '../../../generated/prisma/client'
import { ResendService } from '@/services/ResendService/ResendService'
import z from 'zod'
import { parseLlmOwnPostsResponse } from '@/utils/parseLlmOwnPostsResponse'

type Data = {
  data?: unknown
  error?: string
}

const bodySchema = z.object({
  api_secret: z.string().min(1, 'api_secret is required'),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { method, body } = req
  const { data, error } = bodySchema.safeParse(body)

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  const { api_secret } = data

  if (api_secret !== process.env.API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (method === 'POST') {
    try {
      const apifyService = new ApifyService()
      const openAiService = new OpenAiService()
      const resendService = new ResendService()

      const currentTime = new Date()

      // get the latest system configuration for own posts processing
      const [lastProcessingConfiguration] = await Promise.all([
        prisma.systemConfiguration.findFirstOrThrow({
          where: {
            processingType: SystemProcessingType.OTHER,
          },
          orderBy: {
            processingStartedAt: 'desc',
          },
        }),
        prisma.systemConfiguration.create({
          data: {
            processingType: SystemProcessingType.OTHER,
            processingStartedAt: currentTime,
          },
        }),
      ])

      const ownTrackedEntities = await prisma.trackedEntity.findMany({
        where: {
          type: TrackedEntityType.OWN,
          promptConfiguration: {
            isActive: true,
          },
        },
        include: {
          promptConfiguration: true,
        },
      })

      const otherTrackedEntities = await prisma.trackedEntity.findMany({
        where: {
          type: TrackedEntityType.OTHER,
        },
      })

      const facebookPagesUrls = otherTrackedEntities.map(
        (trackedEntity) => trackedEntity.facebookPageUrl,
      )

      const apifyResponse = await apifyService.getPostsData({
        pagesUrls: facebookPagesUrls,
        onlyPostsNewerThan: lastProcessingConfiguration.processingStartedAt,
        captionText: true,
      })

      const extractedFacebookPostsFromApify = apifyResponse.filter(
        (facebookPostResponse) =>
          !('error' in facebookPostResponse) || !('errorDescription' in facebookPostResponse),
      ) as ApifyPostSuccess[]

      const extractedApifyPosts = extractedFacebookPostsFromApify
        .map((facebookPostResponse) => {
          const otherTrackedEntity = otherTrackedEntities.find(
            (trackedEntity) => trackedEntity.facebookPageUrl === facebookPostResponse.facebookUrl,
          )

          if (!otherTrackedEntity) {
            return null
          }

          return {
            trackedEntityId: otherTrackedEntity.id,
            facebookPostId: facebookPostResponse.postId,
            postedAt: new Date(facebookPostResponse.time),
            url: facebookPostResponse.url,
            text: facebookPostResponse.text ?? '',
            likes: facebookPostResponse.likes ?? 0,
            comments: facebookPostResponse.comments ?? 0,
            shares: facebookPostResponse.shares ?? 0,
            topReactionsCount: facebookPostResponse.topReactionsCount ?? 0,
            isVideo: facebookPostResponse.isVideo ?? false,
            viewsCount: facebookPostResponse.viewsCount ?? 0,
            fullResponse: JSON.parse(JSON.stringify(facebookPostResponse)) as Prisma.InputJsonValue,
          }
        })
        .filter((post): post is NonNullable<typeof post> => post !== null)

      const systemPromptConfiguration = await prisma.systemPromptConfiguration.findFirstOrThrow()

      // Call LLM for each other post
      const llmResponses = await Promise.all(
        extractedApifyPosts.map((post) =>
          openAiService.callLlmWithRoles(
            systemPromptConfiguration.categoryEuSkPrompt,
            JSON.stringify({
              trackedEntityId: post.trackedEntityId,
              text: post.text ?? '',
            }),
          ),
        ),
      )

      const parsedLlmResponses = parseLlmOwnPostsResponse(llmResponses)

      const createdFacebookPosts = await prisma.$transaction(
        extractedApifyPosts.map((post, apifyPostIndex) =>
          prisma.post.create({
            data: {
              trackedEntityId: post.trackedEntityId,
              categoryEuSk:
                parsedLlmResponses.find(
                  (response, llmResponseIndex) => llmResponseIndex === apifyPostIndex,
                )?.categoryEuSk ?? CategoryEuSk.NONE,
              facebookPost: {
                create: {
                  facebookPostId: post.facebookPostId,
                  url: post.url,
                  postedAt: post.postedAt,
                  text: post.text,
                  fullResponse: post.fullResponse,
                  likes: post.likes,
                  comments: post.comments,
                  shares: post.shares,
                  topReactionsCount: post.topReactionsCount,
                  isVideo: post.isVideo,
                  viewsCount: post.viewsCount,
                },
              },
            },
            include: {
              facebookPost: true,
              trackedEntity: true,
            },
          }),
        ),
      )

      const euPoliticsPrompt = systemPromptConfiguration.euPoliticsPrompt
      const skPoliticsPrompt = systemPromptConfiguration.skPoliticsPrompt

      const politicsPromptToUse = createdFacebookPosts.map((post) => {
        if (post.categoryEuSk === CategoryEuSk.EU) {
          return euPoliticsPrompt
        } else if (post.categoryEuSk === CategoryEuSk.SK) {
          return skPoliticsPrompt
        }
        return ''
      })

      const createdOwnFacebookPostReactions = await Promise.all(
        ownTrackedEntities.map(async (ownTrackedEntitiy) => {
          const openaiResponses = await Promise.all(
            createdFacebookPosts.map((post, postIndex) => {
              return openAiService.callLlmWithRoles(
                [
                  politicsPromptToUse[postIndex],
                  ownTrackedEntitiy.promptConfiguration?.toneOfVoicePrompt,
                ].join('\n'),
                ownTrackedEntitiy.promptConfiguration?.userPrompt
                  ?.replace('{{trackedEntityId}}', ownTrackedEntitiy.id)
                  .replace('{{postId}}', post.id)
                  .replace(
                    '{{promptConfigurationId}}',
                    ownTrackedEntitiy.promptConfiguration?.id ?? '',
                  )
                  .replace('{{text}}', post.facebookPost?.text ?? '') ?? '',
              )
            }),
          )

          const parsedLLMPostsReactions = parseLlmPostsReactionsResponse(openaiResponses)

          const createdFacebookPostReactions = await prisma.reaction.createManyAndReturn({
            data: parsedLLMPostsReactions.map((llmReaction) => ({
              trackedEntityId: llmReaction.trackedEntityId,
              postId: llmReaction.postId,
              promptConfigurationId: llmReaction.promptConfigurationId,
              text: llmReaction.reaction,
            })),
            skipDuplicates: true,
            include: {
              post: {
                include: {
                  facebookPost: true,
                  trackedEntity: true,
                },
              },
              trackedEntity: true,
            },
          })

          return createdFacebookPostReactions
        }),
      )
      const totalReactionsCount = createdOwnFacebookPostReactions.reduce(
        (acc, reactions) => acc + reactions.length,
        0,
      )

      // await resendService.sendReactTemplateEmail({
      //   from: process.env.RESEND_FROM_EMAIL!,
      //   // to: process.env.RESEND_TO_EMAIL!,
      //   subject: 'Newstate - Reakcie na FB posty',
      //   reactTemplate: FacebookPostsReactionsEmail({
      //     postsReactionsData: createdOwnFacebookPostReactions
      //       .filter((reactions) => reactions.length > 0)
      //       .map((reactions) => ({
      //         postUrl: reactions[0].post.facebookPost?.url ?? '',
      //         postAuthor: reactions[0].post.trackedEntity.name,
      //         postText: reactions[0].post.facebookPost?.text ?? '',
      //         reactionsData: reactions.map((reaction) => ({
      //           reactionAuthor: reaction.trackedEntity.name,
      //           reactionText: reaction.text,
      //         })),
      //       })),
      //   }),
      // })

      const completedAt = new Date()
      const updatedNewProcessingConfiguration = await prisma.systemConfiguration.update({
        where: { id: lastProcessingConfiguration.id },
        data: { processingCompletedAt: completedAt },
      })

      return res.status(200).json({
        data: {
          newPosts: createdFacebookPosts.length,
          newReactions: totalReactionsCount,
          processingStartedAt: updatedNewProcessingConfiguration.processingStartedAt,
          processingCompletedAt: updatedNewProcessingConfiguration.processingCompletedAt,
        },
      })
    } catch (error) {
      console.error('ERROR handler:', error)

      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
