import { expect, test } from '@playwright/test'

test('if test passes', async ({ page }) => {
  await page.goto('')
  await expect(page.getByTestId('drops')).toBeVisible()
  await expect(page).toHaveURL('http://localhost:9090/')
})
