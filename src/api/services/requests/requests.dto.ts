import z from "zod"

export const requestSchema = z.object({
  creds_external_descriptor: z.string(),
  user_admin_id: z.string().uuid(),
  creds_internal_descriptor: z.string(),
  creds_external_username: z.string(),
  api_operation: z.string(),
  originating_ip: z.string().ip(),
  id: z.string().uuid(),
  creds_external_id: z.string().uuid(),
  user_admin_email_address: z.string().email(),
  creds_internal_id: z.string().uuid(),
  tenant: z.string(),
  status_code: z.number().int(),
  request_sanitized: z.string(),
  invoked_at: z.string().datetime(),
  creds_internal_api_key_first_eight_chars: z.string(),
  derived_url: z.string().url(),
})

export type RequestSchemaDTO = z.infer<typeof requestSchema>
