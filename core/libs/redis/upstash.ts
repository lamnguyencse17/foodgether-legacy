import { Redis } from '@upstash/redis/with-fetch'

export const getRedisClient = () => {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    throw new Error(
      'UPSTASH_REDIS_URL and UPSTASH_REDIS_REST_TOKEN must be set'
    )
  }
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
}
