import { test, expect } from '@playwright/test'

test('Login page sanity test', async ({ page, context }) => {
  await page.goto('/login')
  await expect(page).toHaveURL('/login')
  expect(await page.title()).toEqual('FOODGETHER LOGIN')
})
