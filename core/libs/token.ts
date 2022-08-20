import jwt from 'jsonwebtoken'
import { Claim } from './auth'

import { JWT_SECRET } from './config'
import { findUserByPhone } from './db/users'

export const verifyTokenWithDb = async (token: string) => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }
  const userClaim = jwt.verify(token, JWT_SECRET) as Claim
  const user = await findUserByPhone(userClaim.phoneNumber)
  if (!user) {
    return null
  }
  if (user.id === userClaim.id) {
    return userClaim
  }
  return null
}
