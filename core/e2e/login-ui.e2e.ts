import { test, expect } from '@playwright/test'

test.describe.configure({ mode: 'parallel' })
test.describe('LOGIN_PAGE_E2E_TEST', () => {
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
})
