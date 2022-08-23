import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'
import { registerSchema } from '../../../libs/user'
import { IS_PRODUCTION, JWT_SECRET } from '../../../libs/config'
import { HiddenUserData, hideUserData } from '../../../libs/auth'
import { createUser, findUserByPhone } from '../../../libs/db/users'

type Data =
  | {
      message?: string
    }
  | HiddenUserData

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { name, phoneNumber, pin } = registerSchema.parse(req.body)
  const user = await findUserByPhone(phoneNumber)

  if (user) {
    return res.status(400).send({ message: 'Your phone number is taken!' })
  }

  const data = await createUser(name, phoneNumber, pin)

  const token = jwt.sign(
    { id: data.id, phoneNumber: data.phoneNumber, name: data.name },
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
  return res.status(200).json(hideUserData(data))
}
