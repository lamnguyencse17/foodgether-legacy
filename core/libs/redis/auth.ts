import dayjs from 'dayjs'
import { getRedisClient } from './upstash'

export const redisBlacklistToken = async (key: string, exp: number) => {
  const now = dayjs().unix()
  const left = exp - now
  const redis = getRedisClient()
  return redis.set(key, 'true', {
    ex: left,
  })
}

export const redisCheckBlacklistToken = async (key: string) => {
  const redis = getRedisClient()
  const isBlacklisted = (await redis.get<string>(key)) == 'true'
  return isBlacklisted
}
