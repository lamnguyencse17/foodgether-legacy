import type { NextApiRequest, NextApiResponse } from 'next'
import { JWT_SECRET } from '../../../libs/config'
import { UserClaim, verifyTokenWithDb } from '../../../libs/auth'

type Data =
  | {
      message?: string
    }
  | UserClaim

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { Authorization: token } = req.cookies
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing' })
  }
  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not defined')
    return res.status(500).json({ message: 'Something went wrong' })
  }
  const { id, name, phoneNumber } = verifyTokenWithDb(token)
  return res.status(200).json({ id, name, phoneNumber })
}
