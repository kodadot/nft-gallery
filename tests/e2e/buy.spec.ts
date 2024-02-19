import { expect, test } from './fixtures'

const ITEMS_PATH = '/ahp/explore/items?listed=true'

test('Check buy now option', async ({ page, Commands }) => {
  await Commands.e2elogin()
  await page.goto(ITEMS_PATH)

  await test.step('Buy now from explorer', async () => {
    await page.getByTestId('item-buy').first().click()
    await expect(await page.getByTestId('confirm-modal')).toBeVisible()
  })

  await test.step('Buy from item', async () => {
    await page.getByTestId('13').click()
    await page.getByTestId('item-buy').click()
    await expect(await page.getByTestId('confirm-modal')).toBeVisible()
  })
})
