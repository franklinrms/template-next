import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email({ message: 'Invalid email!' }),
  password: z
    .string()
    .trim()
    .min(1, { message: 'Password required!' })
    .min(4, { message: 'Password must have at least 4 characters!' }),
})
