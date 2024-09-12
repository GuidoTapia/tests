import z from "zod"

export const internalCredentialSchema = z.object({
  creds_external_id: z.string().uuid(),
  descriptor: z.string(),
  id: z.string().uuid(),
  updated_at: z.string().datetime(),
  loaded_at: z.string().datetime(),
  api_operations_allowed: z.array(z.string()),
  api_key_first_eight_chars: z.string(),
  api_key_hash: z.string(),
  api_key: z.string().nullish(),
})

export type InternalCredentialsSchemaDTO = z.infer<
  typeof internalCredentialSchema
>
