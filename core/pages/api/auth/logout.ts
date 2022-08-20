import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { verifyTokenWithDb } from '../../../libs/auth'
import { IS_PRODUCTION, JWT_SECRET } from '../../../libs/config'
import { redisBlacklistToken } from '../../../libs/redis/auth'
import cookie from 'cookie'

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { Authorization: token } = req.cookies
  if (!token) {
    return res.status(200).json({})
  }
  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not defined')
    return res.status(500).json({ message: 'Something went wrong' })
  }
  const payload = verifyTokenWithDb(token)
  if (!payload.exp) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
  await redisBlacklistToken(`${payload.id}-${payload.exp}`, payload.exp)
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
  return res.status(200).json({})
}

export default handler
