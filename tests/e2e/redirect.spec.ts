import { expect, test } from '@playwright/test'

test('Should redirect from rmrk2 prefix to ksm', async ({ page }) => {
  await page.goto(
    '/rmrk2/gallery/17842583-22708b368d163c8007-CITY-LOWER_ART_DISTRICT-00000006',
  )
  // expects gallery redirection to occur
  await expect(page).toHaveURL(
    '/ksm/gallery/17842583-22708b368d163c8007-CITY-LOWER_ART_DISTRICT-00000006',
  )

  await page.goto('/rmrk2/explore/items?listed=true&sort=updatedAt_DESC')
  // expects item redirection to occur
  await expect(page).toHaveURL(
    '/ksm/explore/items?listed=true&sort=updatedAt_DESC',
  )
})
