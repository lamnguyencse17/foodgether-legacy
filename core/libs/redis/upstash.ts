import { Redis } from '@upstash/redis'

export const getRedisClient = () => {
  if (!process.env.UPSTASH_REDIS_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error(
      'UPSTASH_REDIS_URL and UPSTASH_REDIS_REST_TOKEN must be set'
    )
  }
  return new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
}