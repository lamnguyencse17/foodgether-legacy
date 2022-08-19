import { test, expect } from '@playwright/test'

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
  await page.locator('#phoneNumber').type('0919696148')
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
