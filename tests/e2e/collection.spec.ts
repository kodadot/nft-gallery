import { expect, test } from './fixtures'

const collectionName = 'Pare1d0scope'
const collectionAddress = '/ahp/collection/38/'

test('Collection interactions', async ({ page, Commands }) => {
  await page.goto(collectionAddress)
  await Commands.scrollDownAndStop()
  await expect(page.getByTestId('collection-banner-name')).toContainText(
    collectionName,
  )
  //description show more
  await page.getByTestId('description-show-less-more-button').click()
  //collection description
  await expect(page.getByTestId('collection-description')).toContainText(
    'Geometry',
  )
  //Share Button
  const shareBtn = page.getByTestId('share-button').first()
  await shareBtn.click()
  await page.getByTestId('hero-copy-link-dropdown').first().click()
  await Commands.copyText('http://localhost:9090/ahp/collection/38')
  await shareBtn.click()
  await page.getByTestId('hero-share-QR-dropdown').first().click()
  await expect(page.getByTestId('hero-share-qrcode-modal')).toBeVisible()
  await page.keyboard.press('Escape')
  await shareBtn.click()
  await Commands.checkNewTab(
    'https://twitter.com',
    await page.getByTestId('hero-share-twitter-dropdown').first().click(),
  )
  //ITEMS TAB ----------------------------
  //Buy Now Filter
  await page.getByTestId('filter-checkbox-buynow').nth(1).click()
  await Commands.scrollDownAndStop()
  for (const el of await page.locator('[class="infinite-scroll-item"]').all()) {
    await expect(el).toContainText('DOT')
  }
  //Buy Now Button on nft card opens wallet sidebar
  await page.locator('[class="infinite-scroll-item"]').first().hover()
  await page.getByTestId('item-buy').first().click()
  await expect(page.getByTestId('wallet-connect-sidebar-modal')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(
    page.getByTestId('wallet-connect-sidebar-modal'),
  ).not.toBeVisible()
  //cart test
  await page.locator('[class="infinite-scroll-item"]').nth(0).hover()
  await page.getByTestId('item-add-to-cart').nth(0).click()
  await page.locator('[class="infinite-scroll-item"]').nth(1).hover()
  await page.getByTestId('item-add-to-cart').nth(1).click()
  await page.getByTestId('navbar-button-cart').click()
  await expect(page.getByTestId('shopping-cart-modal')).toBeVisible()
  await expect(page.getByTestId('shopping-cart-item').nth(0)).toContainText(
    collectionName,
  )
  await expect(page.getByTestId('shopping-cart-item').nth(1)).toContainText(
    collectionName,
  )
  await page.getByTestId('modal-close-button').click()
  //art view
  await page.getByTestId('advanced-filter-collapsible').first().click()
  await page.getByTestId('filter-artview-checkbox').nth(1).click()
  await expect(page.getByTestId('nft-name')).not.toBeVisible()
  await page.getByTestId('filter-artview-checkbox').nth(1).click()
  //ACTIVITY TAB ----------------------------
  await page.getByTestId('collection-tab-activity').nth(1).click()
  await Commands.scrollDownAndStop()
  //chart
  await expect(page.getByTestId('collection-activity-chart')).toBeVisible()
  //Holders Tab
  const holdersTab = page.getByTestId('collection-holders-container')
  //check if nft details on Holders tab has content
  await page.getByTestId('collection-holder-nft-details').first().click()
  await expect(holdersTab).toContainText(collectionName)
  //check if popover on Holders is present
  await expect(page.getByTestId('collection-nft-holder').first()).toBeVisible()
  await page.getByTestId('collection-nft-holder-address').first().hover()
  await expect(page.getByTestId('identity-popover-container')).toBeVisible()
  //event filters
  const eventTable = page.getByTestId('nfts-event-table')
  const saleFilter = page.getByTestId('event-checkbox-filter-sale').nth(1)
  const listingFilter = page.getByTestId('event-checkbox-filter-listing').nth(1)
  const mintFilter = page.getByTestId('event-checkbox-filter-mint').nth(1)
  const transferFilter = page
    .getByTestId('event-checkbox-filter-transfer')
    .nth(1)
  await saleFilter.check()
  await expect(eventTable).toContainText('Sale')
  await saleFilter.uncheck()
  await listingFilter.check()
  await expect(eventTable).toContainText('List')
  await listingFilter.uncheck()
  await mintFilter.check()
  await expect(eventTable).toContainText('Mint')
  await mintFilter.uncheck()
  await transferFilter.check()
  await expect(eventTable).toContainText('Transfer')
  //check if creator address redirects to proper page
  await page.getByTestId('collection-creator-address').click()
  await expect(page).toHaveURL(
    '/ahp/u/15CoYMEnJhhWHvdEPXDuTBnZKXwrJzMQdcMwcHGsVx5kXYvW',
  )
})
