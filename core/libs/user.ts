import { z } from 'zod'

export type UserInfo = {
  name: string
  phoneNumber: string
  pin: string
}

export const registerSchema = z.object({
  name: z.string().trim(),
  phoneNumber: z
    .string()
    .regex(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/),
  pin: z.string().trim().min(4).max(8),
})

export type RegisterSchemaType = z.infer<typeof registerSchema>
