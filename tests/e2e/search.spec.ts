import { expect, test } from './fixtures'

const LANDING_PATH = '/ksm'

test('Check if search provide results', async ({ page }) => {
  await page.goto(LANDING_PATH)

  //Search term
  await test.step('Search for the term Waifu and hover over results', async () => {
    await expect(
      page.locator('[data-testid="search-bar"] >> visible = true'),
    ).toBeVisible()
    await page
      .locator('[data-testid="search-bar-input"] >> visible = true')
      .fill('waifu')
    await page
      .locator('[data-testid="search-suggestion-container"] >> visible = true')
      .hover()
  })

  //check contents of Collection Tab
  await test.step('Switches to Collection tab and wait for results to load', async () => {
    const tabCollection = page.getByTestId('collection-tab').last()
    await expect(
      tabCollection.locator('.neo-skeleton-item').first(),
    ).not.toBeVisible({ timeout: 30000 })
    await expect(
      tabCollection.locator('.search-result-item').first(),
    ).toBeVisible({ timeout: 30000 })
    await expect(tabCollection.locator('.link-item').first()).toBeVisible({
      timeout: 30000,
    })
  })

  //Switchs to NFT tab
  await test.step('Switches to NFT tab and wait for results to load', async () => {
    await page.locator('div[aria-controls="NFTs-content"]').last().click()
    const tabNft = page.getByTestId('nft-tab')
    await expect(tabNft.locator('.neo-skeleton-item').first()).not.toBeVisible({
      timeout: 30000,
    })
    await expect(
      tabNft.locator('.search-result-item >> visible = true').first(),
    ).toBeVisible({
      timeout: 30000,
    })
  })
})
