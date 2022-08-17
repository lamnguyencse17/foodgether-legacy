import { User } from '@prisma/client'
import { getRedisClient } from './upstash'

export const redisFindUserFromPhone = async (key: string) => {
  const redis = getRedisClient()
  const rawUser = await redis.get<string>(key)
  if (!rawUser) {
    return null
  }
  return Object(rawUser) as User
}

export const redisCacheUserFromPhone = async (key: string, user: User) => {
  const redis = getRedisClient()
  return redis.set(key, JSON.stringify(user), {
    ex: 60 * 5,
  })
}
