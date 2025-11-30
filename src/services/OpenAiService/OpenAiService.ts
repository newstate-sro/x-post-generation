import { AIMessageChunk, MessageStructure } from '@langchain/core/messages'
import { ChatOpenAI } from '@langchain/openai'

export class OpenAiService {
  private readonly llm: ChatOpenAI

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured')
    }
    this.llm = new ChatOpenAI({
      modelName: 'gpt-4o',
      openAIApiKey: process.env.OPENAI_API_KEY,
    })
  }

  /**
   * Sends a chat prompt to the OpenAI model and returns the AI response.
   *
   * Uses the ChatOpenAI model (gpt-4o) configured in the constructor to process
   * the input prompt and generate a response. The method handles the full
   * request/response cycle with the OpenAI Chat Completions API.
   *
   * @param prompt - The text prompt to send to the AI model. Can be a simple
   *                 string or a formatted message that will be converted to a
   *                 HumanMessage internally by LangChain.
   *
   * @returns Promise that resolves to an AIMessageChunk containing the model's
   *          response. The response includes the generated text content along
   *          with metadata such as token usage, model information, and response
   *          structure.
   *
   * @example
   * ```typescript
   * const service = new OpenAiService()
   * const response = await service.callLlm("What is the capital of France?")
   * console.log(response.content) // "The capital of France is Paris."
   * ```
   */
  public async callLlm(prompt: string): Promise<AIMessageChunk<MessageStructure>> {
    try {
      const response = await this.llm.invoke(prompt)
      return response
    } catch (error) {
      console.error('ERROR callLlm:', error)
      throw error
    }
  }
}
