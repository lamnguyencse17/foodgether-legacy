import bcrypt from 'bcryptjs'
import { ENV } from '../config'
import { redisCacheUserFromPhone, redisFindUserFromPhone } from '../redis/user'
import { prisma } from './prisma'

export const findUserByPhone = async (phoneNumber: string) => {
  const key = `user:${phoneNumber}-${ENV}`
  let user = await redisFindUserFromPhone(key)
  if (user) {
    return user
  }
  user = await prisma.user.findUnique({
    where: {
      phoneNumber,
    },
  })
  if (!user) {
    return null
  }
  await redisCacheUserFromPhone(key, user)
  return user
}

export const createUser = async (
  name: string,
  phoneNumber: string,
  pin: string
) => {
  const hashPin = await bcrypt.hash(pin, 5)
  return prisma.user.create({
    data: { name, phoneNumber, pin: hashPin },
  })
}
