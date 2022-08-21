import { test, expect } from '@playwright/test'
import { User } from '@prisma/client'
import { createPrismaContext } from '../libs/db/context'
import bcrypt from 'bcryptjs'
import { getRedisClient } from '../libs/redis/upstash'
import jwt from 'jsonwebtoken'
import { UserClaim } from '../libs/auth'

import { customAlphabet } from 'nanoid'
import dayjs from 'dayjs'
import { IS_PRODUCTION, JWT_SECRET } from '../libs/config'

const nanoid = customAlphabet('1234567890', 6)
const genRandomPhoneNumber = () => '0919' + nanoid()

test.describe.configure({ mode: 'parallel' })
test.describe('LOGIN_PAGE_E2E_INTERACTION_FAILED', () => {
  const phoneNumber = genRandomPhoneNumber()

  test('Login page submitting and failed', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveURL('/login')
    expect(await page.title()).toEqual('FOODGETHER LOGIN')
    const loginButton = page.locator('button', { hasText: 'Sign in' })
    await page.locator('#phoneNumber').type(phoneNumber)
    await page.locator('#pin').type('55555')
    await loginButton.click()
    const response = await page.waitForResponse('**/api/auth/login')
    expect(response.ok()).toBe(false)
    const { message } = await response.json()
    expect(message).toEqual('Your phone number or pin is invalid')
    await expect(page.locator('.chakra-alert__title')).toHaveText(
      'Your phone number or pin is invalid'
    )
  })
})

test.describe('LOGIN_PAGE_E2E_INTERACTION_SUCCESS', () => {
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

  test('Login page login success', async ({ page, context }) => {
    await page.goto('/login')
    await expect(page).toHaveURL('/login')
    expect(await page.title()).toEqual('FOODGETHER LOGIN')
    await page.locator('#phoneNumber').type(phoneNumber)
    await page.locator('#pin').type(pin)
    await page.locator('button', { hasText: 'Sign in' }).click()
    const loginResponse = await page.waitForResponse('**/api/auth/login')
    const cookie = (await loginResponse.allHeaders())['set-cookie']
    expect(cookie).toContain('Authorization')
    page
      .waitForURL('**/', {
        waitUntil: 'networkidle',
      })
      .then(async () => {
        await expect(page).toHaveURL('/')
      })
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
    await page.goto('/login')
    await page.waitForURL('**/', {
      waitUntil: 'networkidle',
    })
    await expect(page).toHaveURL('/')
  })
})
