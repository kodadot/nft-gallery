import { expect, test } from '@playwright/test'

function imagesHaveLoaded() {
  return Array.from(document.images).every((i) => i.complete)
}

test('Check if search provide results', async ({ page }) => {
  await page.goto('/ksm')
  const searchBar = page.getByTestId('search-bar')
  await searchBar.locator('input').fill('waifu')
  await page.locator('.search-suggestion-container').hover()
  //check contents of Collection Tab
  const tabCollection = page.getByTestId('collection-tab')
  await expect(tabCollection.locator('.neo-skeleton-item').first()).toBeVisible(
    { timeout: 30000 }
  )
  await expect(
    tabCollection.locator('.search-result-item').first()
  ).toBeVisible({ timeout: 30000 })
  await expect(tabCollection.getByText('bsx').first()).toBeVisible()
  await page.waitForFunction(imagesHaveLoaded, { timeout: 30000 })
  //switchs and check NFT results
  await page.locator('div[aria-controls="NFTs-content"]').click()
  const tabNft = page.getByTestId('nft-tab')
  await expect(tabNft.locator('.search-result-item').first()).toBeVisible({
    timeout: 30000,
  })
  await searchBar.locator('input').fill('')
})
