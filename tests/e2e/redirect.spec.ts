import { expect, test } from './fixtures'

test('Redirections', async ({ page }) => {
  //Gallery

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
    await expect(page).toHaveURL('/ahp/transfer')
  })
})
