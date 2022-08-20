import { User } from '@prisma/client'
import { JwtPayload } from 'jsonwebtoken'
import { z } from 'zod'

import { phoneNumberRegex } from './regex'

export type UserClaim = {
  id: string
  name: string
  phoneNumber: string
}

export type Claim = UserClaim & JwtPayload

export const loginSchema = z.object({
  phoneNumber: z.string().regex(phoneNumberRegex),
  pin: z.string().trim().min(4).max(8),
})

export const hideUserData = (user: User) => {
  const { pin: _, createdAt, updatedAt, ...userInfo } = user
  return userInfo
}

export type HiddenUserData = ReturnType<typeof hideUserData>
export type LoginSchemaType = z.infer<typeof loginSchema>
