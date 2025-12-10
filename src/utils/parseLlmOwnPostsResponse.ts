import type { AIMessageChunk } from '@langchain/core/messages'

type ParsedOwnPostResponse = {
  trackedEntityId: string
  postId: string
  text: string
  categoryEuSk: 'EU' | 'SK' | 'NONE'
}

/**
 * Parses a single AIMessageChunk response content.
 * Extracts JSON from markdown code blocks and parses it.
 *
 * @param content - The string content from AIMessageChunk
 * @returns Parsed array of own posts response objects
 */
function parseSingleResponse(content: string): ParsedOwnPostResponse[] {
  // Remove markdown code block markers (```json and ```)
  const cleanedContent = content
    .replace(/^```json\s*/i, '')
    .replace(/\s*```$/g, '')
    .trim()

  try {
    const parsed = JSON.parse(cleanedContent)
    return Array.isArray(parsed) ? parsed : [parsed]
  } catch (error) {
    console.error('ERROR parseLlmOwnPostsResponse:', error)
    throw new Error(`Failed to parse LLM response as JSON: ${error}`)
  }
}

/**
 * Parses the content from an array of LangChain AIMessage responses.
 * Extracts JSON from markdown code blocks and parses each response.
 *
 * @param llmResponses - Array of AIMessageChunk responses from LangChain
 * @returns Parsed array of own posts response objects (flattened from all responses)
 */
export function parseLlmOwnPostsResponse(llmResponses: AIMessageChunk[]): ParsedOwnPostResponse[] {
  const allPosts: ParsedOwnPostResponse[] = []

  for (const llmResponse of llmResponses) {
    if (typeof llmResponse.content !== 'string') {
      throw new Error('Expected string content in LLM response')
    }

    const parsed = parseSingleResponse(llmResponse.content)
    allPosts.push(...parsed)
  }

  return allPosts
}
