import { z } from 'zod'


export const schemaVerifySignIn = z.object({
  email: z.string().email('Provide a valid email please'),
})

export type SchemaVerifySignIn = z.infer<typeof schemaVerifySignIn>
