import type { AIMessageChunk } from '@langchain/core/messages'

type ParsedPostsReactionsResponse = {
  facebookPostId: string
  reaction: string
}

/**
 * Parses the content from a LangChain AIMessage response.
 * Extracts JSON from markdown code blocks and parses it.
 *
 * @param llmResponse - The AIMessageChunk response from LangChain
 * @returns Parsed array of posts reactions response objects
 */
export function parseLlmPostsReactionsResponse(
  llmResponse: AIMessageChunk,
): ParsedPostsReactionsResponse[] {
  let content = llmResponse.content

  if (typeof content !== 'string') {
    throw new Error('Expected string content in LLM response')
  }

  // Remove markdown code block markers (```json and ```)
  content = content
    .replace(/^```json\s*/i, '')
    .replace(/\s*```$/g, '')
    .trim()

  try {
    const parsed = JSON.parse(content)
    return Array.isArray(parsed) ? parsed : [parsed]
  } catch (error) {
    console.error('ERROR parseLlmPostsReactionsResponse:', error)
    throw new Error(`Failed to parse LLM response as JSON: ${error}`)
  }
}
