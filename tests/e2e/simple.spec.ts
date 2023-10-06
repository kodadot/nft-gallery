import { expect, test } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/')

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/)
})

test('if test passes', async ({ page }) => {
  await page.goto('')
  await expect(page).toHaveURL('http://localhost:9090/')
  await expect(page.locator('[class="navbar-brand"]')).toBeVisible()
  await expect(page.getByTestId('drops')).toBeVisible()
})
