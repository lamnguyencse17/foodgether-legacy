import { test, expect } from '@playwright/test'
import { User } from '@prisma/client'
import { createPrismaContext } from '../libs/db/context'
import bcrypt from 'bcryptjs'

test.describe('LOGIN_PAGE_E2E_TEST', () => {
  const name = 'Lam Nguyen'
  const phoneNumber = '0919000000'
  const pin = '123456'
  const { prisma } = createPrismaContext()
  let user: User
  test.beforeAll(async () => {
    const hashedPin = await bcrypt.hash(pin, 10)
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
  })
  test('Login page sanity test', async ({ page, context }) => {
    await page.goto('/login')
    await expect(page).toHaveURL('/login')
    expect(await page.title()).toEqual('FOODGETHER LOGIN')
  })

  test('Login page phoneNumber empty', async ({ page, context }) => {
    await page.goto('/login')
    await expect(page).toHaveURL('/login')
    expect(await page.title()).toEqual('FOODGETHER LOGIN')
    const loginButton = page.locator('button', { hasText: 'Sign in' })
    await page.locator('#phoneNumber').type('')
    await loginButton.click()
    await expect(page.locator('#phoneNumber')).toHaveAttribute(
      'aria-invalid',
      'true'
    )
  })

  test('Login page all empty', async ({ page, context }) => {
    await page.goto('/login')
    await expect(page).toHaveURL('/login')
    expect(await page.title()).toEqual('FOODGETHER LOGIN')
    const loginButton = page.locator('button', { hasText: 'Sign in' })
    await page.locator('#phoneNumber').type('')
    await page.locator('#pin').type('')
    await loginButton.click()
    await expect(page.locator('#phoneNumber')).toHaveAttribute(
      'aria-invalid',
      'true'
    )
    await expect(page.locator('#pin')).toHaveAttribute('aria-invalid', 'true')
  })

  test('Login page submitting and failed', async ({ page, context }) => {
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

  test('Login page login success', async ({ page, context }) => {
    await page.goto('/login')
    await expect(page).toHaveURL('/login')
    expect(await page.title()).toEqual('FOODGETHER LOGIN')
    await page.locator('#phoneNumber').type(phoneNumber)
    await page.locator('#pin').type(pin)
    await page.locator('button', { hasText: 'Sign in' }).click()
    const response = await page.waitForResponse('**/api/auth/login')
    const cookie = (await response.allHeaders())['set-cookie']
    expect(cookie).toContain('Authorization')
    page.waitForURL('**/').then(async () => {
      await expect(page).toHaveURL('/')
    })
  })
})
