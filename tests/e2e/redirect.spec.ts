import { expect, test } from '@playwright/test'

test('Should redirect from rmrk2 prefix to ksm', async ({ page }) => {
  await page.goto(
    '/rmrk2/gallery/17842583-22708b368d163c8007-CITY-LOWER_ART_DISTRICT-00000006'
  )
  await page.waitForLoadState()
  // expects redirection to occur
  await expect(page.url()).toContain(
    '/ksm/gallery/17842583-22708b368d163c8007-CITY-LOWER_ART_DISTRICT-00000006'
  )

  await page.goto('/rmrk2/explore/items?listed=true&sort=updatedAt_DESC')
  await page.waitForLoadState()
  await expect(page.url()).toContain(
    '/ksm/explore/items?listed=true&sort=updatedAt_DESC'
  )
  await expect(page).toHaveURL(
    '/ksm/explore/items?listed=true&sort=updatedAt_DESC'
  )
})
