import { test, expect } from '@playwright/test'

test('Restaurants page sanity test', async ({ page, context }) => {
  await page.goto('/restaurants/62df69e5d66193a33f3bc493')
  await expect(page).toHaveURL('/restaurants/62df69e5d66193a33f3bc493')
  expect(await page.title()).toEqual(
    'Foodgether for 2 Chị Em - Cơm Gà Nha Trang - Thích Minh Nguyệt'
  )
})
