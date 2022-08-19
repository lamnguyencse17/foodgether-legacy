import { User } from '@prisma/client'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { z } from 'zod'
import { JWT_SECRET } from './config'
import { phoneNumberRegex } from './regex'

export const verifyTokenWithDb = (token: string) => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }
  return jwt.verify(token, JWT_SECRET) as Claim
}

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
