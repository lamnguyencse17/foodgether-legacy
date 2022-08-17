import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { IS_PRODUCTION, JWT_SECRET } from '../../../libs/config'
import { HiddenUserData, hideUserData, loginSchema } from '../../../libs/auth'
import { findUserByPhone } from '../../../libs/db/users'
import bcrypt from 'bcryptjs'
import cookie from 'cookie'

type Data =
  | {
      message?: string
    }
  | HiddenUserData

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { phoneNumber, pin } = loginSchema.parse(req.body)
  const user = await findUserByPhone(phoneNumber)

  if (!user) {
    return res.status(403).send({message: 'Your phone number is not registered'})
  }
  const isMatch = await bcrypt.compare(pin, user.pin)

  if (!isMatch) {
    return res.status(403).send({message: 'Your pin is incorrect'})
  }

  const token = jwt.sign(
    { id: user.id, phoneNumber: user.phoneNumber, name: user.name },
    JWT_SECRET,
    {
      expiresIn: '1d',
    }
  )

  res.setHeader(
    'set-cookie',
    cookie.serialize('Authorization', token, {
      expires: new Date(Date.now() + 3600 * 24 * 1000),
      maxAge: 60 * 60 * 24,
      httpOnly: true,
      sameSite: 'strict',
      secure: IS_PRODUCTION,
      path: '/',
    })
  )
  return res.status(200).json({ ...hideUserData })
}
