import { expect, test } from '@playwright/test'

test('Check if RMRK2 shows Create Page', async ({ page }) => {
  await page.goto('/ksm/create')

  // Expects page to have a heading with the name of Create Collection.
  await expect(page.locator('h1.title').textContent()).toBe(
    'Create New Collection'
  )
})
