import { test, expect } from '@playwright/test'
import { User } from '@prisma/client'
import { createPrismaContext } from '../libs/db/context'
import bcrypt from 'bcryptjs'
import { getRedisClient } from '../libs/redis/upstash'
import { ENV, IS_PRODUCTION, JWT_SECRET } from '../libs/config'
import jwt, { JwtPayload } from 'jsonwebtoken'
import dayjs from 'dayjs'
import { UserClaim } from '../libs/auth'
import { customAlphabet } from 'nanoid'
import { redisBlacklistToken } from '../libs/redis/auth'

const nanoid = customAlphabet('1234567890', 6)
const genRandomPhoneNumber = () => '0919' + nanoid()

test.describe('AUTHENTICATION_ME_INTERACTION', () => {
  const name = 'Lam Nguyen'
  const phoneNumber = genRandomPhoneNumber()
  const pin = '123456'
  const { prisma } = createPrismaContext()
  const redis = getRedisClient()
  let user: User
  test.beforeAll(async () => {
    const hashedPin = await bcrypt.hash(pin, 5)
    user = await prisma.user.create({
      data: {
        phoneNumber,
        pin: hashedPin,
        name,
      },
    })
  })
  test.afterAll(async () => {
    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
    const keys = await redis.keys(`user:${phoneNumber}*`)
    keys.concat(await redis.keys(`${user.id}*`))
    await redis.del(...keys)
  })

  test('/me successfully', async ({ page, context }) => {
    const token = jwt.sign(
      { id: user.id, phoneNumber: user.phoneNumber, name: user.name },
      JWT_SECRET,
      {
        expiresIn: '1d',
      }
    )
    await context.addCookies([
      {
        name: 'Authorization',
        expires: dayjs().add(1, 'day').unix(),
        httpOnly: true,
        sameSite: 'Strict',
        secure: IS_PRODUCTION,
        url: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
        value: token,
      },
    ])
    await page.goto('/')
    const meResponse = await page.waitForResponse('**/api/auth/me')
    expect(meResponse.ok()).toBe(true)
    const meBody = (await meResponse.json()) as UserClaim
    expect(meBody.id).toEqual(user.id)
    expect(meBody).toEqual({
      id: user.id,
      name,
      phoneNumber,
    })
  })

  test('/me fake id => not logged in', async ({ page, context }) => {
    const token = jwt.sign(
      {
        id: '6300aea9d4d0244cdac23100',
        phoneNumber: user.phoneNumber,
        name: user.name,
      },
      JWT_SECRET,
      {
        expiresIn: '1d',
      }
    )
    await context.addCookies([
      {
        name: 'Authorization',
        expires: dayjs().add(1, 'day').unix(),
        httpOnly: true,
        sameSite: 'Strict',
        secure: IS_PRODUCTION,
        url: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
        value: token,
      },
    ])
    await page.goto('/')
    const meResponse = await page.waitForResponse('**/api/auth/me')
    expect(meResponse.ok()).toBe(false)
    expect(meResponse.status()).toBe(403)
    expect(await meResponse.json()).toEqual({
      message: 'Invalid token',
    })
  })

  test('/me blacklisted', async ({ page, context }) => {
    const token = jwt.sign(
      {
        id: user.id,
        phoneNumber: user.phoneNumber,
        name: user.name,
      },
      JWT_SECRET,
      {
        expiresIn: '1d',
      }
    )
    const payload = jwt.decode(token) as JwtPayload
    const key = `${payload.id}-${payload.exp}`
    await redisBlacklistToken(key, payload.exp as number)
    await context.clearCookies()
    await context.addCookies([
      {
        name: 'Authorization',
        expires: dayjs().add(1, 'day').unix(),
        httpOnly: true,
        sameSite: 'Strict',
        secure: IS_PRODUCTION,
        url: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
        value: token,
      },
    ])
    await page.goto('/')
    const meResponse = await page.waitForResponse('**/api/auth/me')
    expect(meResponse.ok()).toBe(false)
    expect(meResponse.status()).toBe(403)
    expect(await meResponse.json()).toEqual({
      message: 'Token is blacklisted',
    })
    const redis = getRedisClient()
    await redis.del(key)
  })

  test('/me not login', async ({ page, context }) => {
    await context.clearCookies()
    await page.goto('/')
    const meResponse = await page.waitForResponse('**/api/auth/me')
    expect(meResponse.ok()).toBe(false)
    expect(meResponse.status()).toBe(401)
    expect(await meResponse.json()).toEqual({
      message: 'Authorization token is missing',
    })
  })
})
