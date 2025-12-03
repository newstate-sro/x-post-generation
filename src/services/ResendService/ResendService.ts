import { Resend } from 'resend'
import * as React from 'react'

export class ResendService {
  private readonly resend: Resend

  constructor() {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured')
    }
    this.resend = new Resend(process.env.RESEND_API_KEY)
  }

  /**
   * Sends an email using a react-email template component.
   *
   * Renders and sends email templates defined using the react-email library.
   * Templates are React components built with @react-email/components that
   * get automatically converted to HTML by Resend's API.
   *
   * @param options - Configuration object for the email
   * @param options.to - Recipient email address(es). Can be a string or array of strings.
   * @param options.from - Sender email address. Must be a verified domain in Resend.
   * @param options.subject - Email subject line.
   * @param options.reactTemplate - React component defined using react-email components
   *                                 (e.g., Html, Body, Button from @react-email/components).
   *
   * @returns Promise that resolves to Resend's email send response containing
   *          the email ID and status information.
   *
   * @example
   * ```typescript
   * import { Html, Body, Button } from '@react-email/components'
   *
   * const service = new ResendService()
   * const EmailTemplate = () => (
   *   <Html>
   *     <Body>
   *       <Button href="https://example.com">Click me</Button>
   *     </Body>
   *   </Html>
   * )
   *
   * await service.sendReactTemplateEmail({
   *   to: 'user@example.com',
   *   from: 'noreply@example.com',
   *   subject: 'Welcome',
   *   reactTemplate: <EmailTemplate />
   * })
   * ```
   */
  public async sendReactTemplateEmail({
    to,
    from,
    subject,
    reactTemplate,
  }: {
    to: string | string[]
    from: string
    subject: string
    reactTemplate: React.ReactNode
  }) {
    try {
      const response = await this.resend.emails.send({
        from,
        to,
        subject,
        react: reactTemplate,
      })

      return response
    } catch (error) {
      console.error('ERROR sendReactTemplateEmail:', error)
      throw error
    }
  }

  /**
   * Sends an email using a Resend template ID.
   *
   * Uses a pre-configured template from Resend's template system. Templates
   * must be created in the Resend dashboard and can include variable placeholders
   * that are replaced with the provided values.
   *
   * @param options - Configuration object for the email
   * @param options.to - Recipient email address(es). Can be a string or array of strings.
   * @param options.from - Sender email address. Must be a verified domain in Resend.
   * @param options.subject - Email subject line.
   * @param options.template - Template configuration object
   * @param options.template.id - The template ID from Resend dashboard
   * @param options.template.variables - Optional key-value pairs to replace template variables
   *
   * @returns Promise that resolves to Resend's email send response containing
   *          the email ID and status information.
   *
   * @example
   * ```typescript
   * const service = new ResendService()
   *
   * await service.sendTemplateEmail({
   *   to: 'user@example.com',
   *   from: 'noreply@example.com',
   *   subject: 'Welcome',
   *   template: {
   *     id: 'template_abc123',
   *     variables: {
   *       name: 'John',
   *       code: 12345
   *     }
   *   }
   * })
   * ```
   */
  public async sendTemplateEmail({
    to,
    from,
    subject,
    template,
  }: {
    to: string | string[]
    from: string
    subject: string
    template: {
      id: string
      variables?: Record<string, string | number>
    }
  }) {
    try {
      const response = await this.resend.emails.send({
        from,
        to,
        subject,
        template,
      })

      return response
    } catch (error) {
      console.error('ERROR sendTemplateEmail:', error)
      throw error
    }
  }
}
