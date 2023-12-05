import { expect, test } from './fixtures'

test('Redirections', async ({ page }) => {
  //Gallery
  await test.step('Expect gallery Item url to be properly redirected', async () => {
    await page.goto(
      '/rmrk2/gallery/17842583-22708b368d163c8007-CITY-LOWER_ART_DISTRICT-00000006',
    )
    await expect(page).toHaveURL(
      '/ksm/gallery/17842583-22708b368d163c8007-CITY-LOWER_ART_DISTRICT-00000006',
    )
  })

  //Explore Collections
  await test.step('Expect Explore url to be properly redirected', async () => {
    await page.goto('/ksm/explore/collections')
    await expect(page).toHaveURL('/ksm/explore/collectibles')
  })

  //Collection
  await test.step('Expect collection url to be properly redirected', async () => {
    await page.goto('/ahk/explore/gallery')
    await expect(page).toHaveURL('/ahk/explore/items')
  })

  //Statemine
  await test.step('Expect url with stmn to be properly redirected', async () => {
    await page.goto('/stmn/explore/items')
    await expect(page).toHaveURL('/ahk/explore/items')
  })

  //Transfer
  await test.step('Expect collection that has /transfer', async () => {
    await page.goto('/transfer')
    await expect(page).toHaveURL('/ksm/transfer')
  })
})
