import { test, expect } from '@playwright/test'
test.describe.configure({ mode: 'parallel' })

test('Restaurants page sanity test', async ({ page, context }) => {
  await page.goto('/restaurants/62df69e5d66193a33f3bc493')
  await expect(page).toHaveURL('/restaurants/62df69e5d66193a33f3bc493')
  expect(await page.title()).toEqual(
    'Foodgether for 2 Chị Em - Cơm Gà Nha Trang - Thích Minh Nguyệt'
  )
})

test('Restaurants page not found page', async ({ page, context }) => {
  await page.goto('/restaurants/62df69e5d6')
  await expect(page).toHaveURL('/restaurants/62df69e5d6')
  expect(await page.title()).toEqual('Foodgether')

  const heading = page.locator('h2', { hasText: 'Uh oh' })
  await expect(heading).toHaveText(
    'Uh oh... We are still looking for this restaurant'
  )

  const paragraph = page.locator('p', { hasText: 'Come back' })
  await expect(paragraph).toHaveText('Come back later would be the best idea')
})
