import { expect, test } from './fixtures'

test('Load top collections after back button', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('main')).toContainText('Top Collections')

  let image = await page
    .locator('[data-testid="top-collection-index-0"] .bg-cover')
    .getAttribute('style')
  await expect(image?.includes('image-beta.w.kodadot.xyz')).toEqual(true)

  await page.getByTestId('top-collection-index-0').click()
  await page.waitForLoadState('networkidle')
  const collectionName = await page
    .getByTestId('collection-banner-name')
    .textContent()
  expect(collectionName).not.toEqual('--')

  await page.goBack()
  image = await page
    .locator('[data-testid="top-collection-index-0"] .bg-cover')
    .getAttribute('style')
  await expect(image?.includes('image-beta.w.kodadot.xyz')).toEqual(true)
})
