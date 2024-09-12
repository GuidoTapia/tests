import z from "zod"

export const externalCredentialSchema = z.object({
  user_admin_id: z.string().uuid(),
  tenant: z.string(),
  descriptor: z.string(),
  id: z.string().uuid(),
  updated_at: z.string().datetime(),
  loaded_at: z.string().datetime(),
  username: z.string(),
})

export type ExternalCredentialsSchemaDTO = z.infer<
  typeof externalCredentialSchema
>
