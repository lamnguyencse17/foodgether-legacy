import type { NextApiRequest, NextApiResponse } from 'next'
import { IS_PRODUCTION, JWT_SECRET } from '../../../libs/config'
import { UserClaim } from '../../../libs/auth'
import { verifyTokenWithDb } from '../../../libs/token'
import { redisCheckBlacklistToken } from '../../../libs/redis/auth'
import cookie from 'cookie'
import { withSentry } from '@sentry/nextjs'

type Data =
  | {
      message?: string
    }
  | UserClaim

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { Authorization: token } = req.cookies
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing' })
  }
  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not defined')
    return res.status(500).json({ message: 'Something went wrong' })
  }
  const payload = await verifyTokenWithDb(token)
  if (!payload) {
    return res.status(403).json({ message: 'Invalid token' })
  }
  const { id, name, phoneNumber, exp } = payload
  const isBlacklisted = await redisCheckBlacklistToken(`${id}-${exp}`)
  if (isBlacklisted) {
    res.setHeader(
      'set-cookie',
      cookie.serialize('Authorization', token, {
        expires: new Date(Date.now() - 3600 * 24 * 1000),
        httpOnly: true,
        sameSite: 'strict',
        secure: IS_PRODUCTION,
        path: '/',
      })
    )
    return res.status(403).json({ message: 'Token is blacklisted' })
  }
  return res.status(200).json({ id, name, phoneNumber })
}

export default withSentry(handler)
