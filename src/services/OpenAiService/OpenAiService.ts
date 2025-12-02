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

  /**
   * Sends a structured chat prompt with system and user roles to the OpenAI model.
   *
   * Uses LangChain's ChatOpenAI model (gpt-4o) to process a conversation with
   * explicit role-based messages. The system role defines the AI's behavior and
   * context, while the user role contains the actual query or instruction.
   *
   * LangChain automatically converts the role-based message array into the
   * appropriate message types (SystemMessage and HumanMessage) for the OpenAI
   * Chat Completions API. This allows for more structured and controlled
   * conversations compared to a single prompt.
   *
   * @param systemRolePrompt - The system message that sets the AI's role,
   *                          behavior, and context. This message helps guide the
   *                          model's responses and can include instructions,
   *                          constraints, or background information. In LangChain,
   *                          this is converted to a SystemMessage internally.
   *
   * @param userRolePrompt - The user message containing the actual query,
   *                        instruction, or content for the AI to process. In
   *                        LangChain, this is converted to a HumanMessage
   *                        internally.
   *
   * @returns Promise that resolves to an AIMessageChunk containing the model's
   *          response. The response includes the generated text content along
   *          with metadata such as token usage, model information, and response
   *          structure.
   *
   * @example
   * ```typescript
   * const service = new OpenAiService()
   * const response = await service.callLlmWithRoles(
   *   "You are a helpful assistant that explains concepts clearly.",
   *   "What is machine learning?"
   * )
   * console.log(response.content) // Detailed explanation of machine learning
   * ```

   */
  public async callLlmWithRoles(
    systemRolePrompt: string,
    userRolePrompt: string,
  ): Promise<AIMessageChunk<MessageStructure>> {
    try {
      const response = await this.llm.invoke([
        {
          role: 'system',
          content: systemRolePrompt,
        },
        {
          role: 'user',
          content: userRolePrompt,
        },
      ])
      return response
    } catch (error) {
      console.error('ERROR callLlm:', error)
      throw error
    }
  }
}
