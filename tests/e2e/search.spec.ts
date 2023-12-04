import { expect, test } from './fixtures'

function imagesHaveLoaded() {
  return Array.from(document.images).every((i) => i.complete)
}

test('Check if search provide results', async ({ page }) => {
  //page.route('**', route => route.continue())
  await page.goto('/ksm')
  const searchBar = page.getByTestId('search-bar')
  await searchBar.locator('input').fill('waifu')
  await page.locator('.search-suggestion-container').hover()
  /* await Promise.all([
    page.waitForResponse(
      (resp) =>
        resp
          .url()
          .includes(
            'bafybeidqnzwlm5hvik7thsenuziurlnlkcfxuafbu2nfrqgcu4ladr2zhu'
          ) && resp.status() === 302
    ),
  ]) */
  //check contents of Collection Tab
  const tabCollection = page.getByTestId('collection-tab')
  await expect(tabCollection.locator('.neo-skeleton-item').first()).toBeVisible(
    { timeout: 30000 },
  )
  await expect(
    tabCollection.locator('.search-result-item').first(),
  ).toBeVisible({ timeout: 30000 })
  await expect(tabCollection.locator('.link-item').first()).toBeVisible({
    timeout: 30000,
  })
  await page.waitForFunction(imagesHaveLoaded, { timeout: 30000 })
  //switchs and check NFT results
  await page.locator('div[aria-controls="NFTs-content"]').click()
  const tabNft = page.getByTestId('nft-tab')
  await expect(tabNft.locator('.search-result-item').first()).toBeVisible({
    timeout: 30000,
  })
})
