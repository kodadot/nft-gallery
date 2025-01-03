import { expect, test } from './fixtures'

test('show offer modal', async ({ page, Commands }) => {
  await Commands.e2elogin()
  await page.goto('/ahp/gallery/256-4235681345')
  await page.getByTestId('gallery-item-trade-make-offer').click()

  // at least show the offer modal
  await expect(page.locator('.modal-card-title')).toHaveText('Create Offer')
})
