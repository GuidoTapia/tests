import z from "zod"

export const userSchema = z.object({
  id: z.string().uuid(),
  updated_at: z.string().datetime(),
  email_address: z.string(),
})

export type UserSchemaDTO = z.infer<typeof userSchema>
