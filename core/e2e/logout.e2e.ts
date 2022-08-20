import { test, expect } from '@playwright/test'
import { User } from '@prisma/client'
import { createPrismaContext } from '../libs/db/context'
import bcrypt from 'bcryptjs'
import { getRedisClient } from '../libs/redis/upstash'
import { IS_PRODUCTION, JWT_SECRET } from '../libs/config'
import jwt from 'jsonwebtoken'
import dayjs from 'dayjs'
import { customAlphabet } from 'nanoid'
import cookie from 'cookie'

const nanoid = customAlphabet('1234567890', 6)
const genRandomPhoneNumber = () => '0919' + nanoid()

test.describe('AUTHENTICATION_LOGOUT', () => {
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
    const blacklisted = await redis.keys(`${user.id}*`)
    await redis.del(...[...keys, ...blacklisted])
  })

  test('logout successfully', async ({ page, context }) => {
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
    await page.goto('/logout')
    await expect(page).toHaveURL('/logout')
    await expect(page.locator('h2', { hasText: 'magic' })).toHaveText(
      'We are doing the magic stuff...'
    )
    const meResponse = await page.waitForResponse('**/api/auth/logout')
    expect(meResponse.ok()).toBe(true)
    const resetCookie = await meResponse.headerValue('set-cookie')
    expect(resetCookie).toBeTruthy()
    if (resetCookie) {
      const exp = dayjs(cookie.parse(resetCookie).Expires).unix()
      expect(dayjs.unix(exp).isBefore(dayjs())).toBeTruthy()
    }
  })
})
