import { expect, test } from '@playwright/test'

test('Check if RMRK2 shows Create Page', async ({ page }) => {
  await page.goto('/ksm/create')

  // Expects page to have a heading with the name of Create Collection.
  const heading = await page.$('h1.title')
  expect(await heading?.textContent()).toContain('What Do You Wish To Create?')
})
