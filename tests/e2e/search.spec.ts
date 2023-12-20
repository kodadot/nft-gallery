import { expect, test } from './fixtures'

const LANDING_PATH = '/ksm'

test('Check if search provide results', async ({ page }) => {
  await page.goto(LANDING_PATH)

  //Search term
  await test.step('Search for the term Waifu and hover over results', async () => {
    const searchBar = page.getByTestId('search-bar')
    await searchBar.locator('input').fill('waifu')
    await page.locator('.search-suggestion-container').hover()
  })

  //check contents of Collection Tab
  await test.step('Switches to Collection tab and wait for results to load', async () => {
    const tabCollection = page.getByTestId('collection-tab')
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
    await page.locator('div[aria-controls="NFTs-content"]').click()
    const tabNft = page.getByTestId('nft-tab')
    await expect(tabNft.locator('.neo-skeleton-item').first()).not.toBeVisible({
      timeout: 30000,
    })
    await expect(tabNft.locator('.search-result-item').first()).toBeVisible({
      timeout: 30000,
    })
  })
})
