import { test, expect } from '@playwright/test'
import { User } from '@prisma/client'
import { createPrismaContext } from '../libs/db/context'
import bcrypt from 'bcryptjs'
import { getRedisClient } from '../libs/redis/upstash'
import { ENV } from '../libs/config'
import { UserClaim } from '../libs/auth'

test.describe.configure({ mode: 'parallel' })
test.describe('LOGIN_PAGE_E2E_INTERACTION_FAILED', () => {
  const phoneNumber = '0919000000'

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
  const phoneNumber = '0919000000'
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
    await redis.del(`user:${phoneNumber}-${ENV}`)
  })
  test.afterAll(async () => {
    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
    await redis.del(`user:${phoneNumber}-${ENV}`)
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
})
