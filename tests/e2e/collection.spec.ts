import { expect, test } from './fixtures'

const COLLECTION_ADDRESS_PATH = '/ahp/collection/38/'
const COLLECTION_NAME = 'Pare1d0scope'
const COLLECTION_OWNER = '15CoYMEnJhhWHvdEPXDuTBnZKXwrJzMQdcMwcHGsVx5kXYvW'

test('Collection interactions', async ({ page, Commands }) => {
  await page.goto(COLLECTION_ADDRESS_PATH)
  await Commands.scrollDownAndStop()
  await test.step('Check collection name and description', async () => {
    await expect(page.getByTestId('collection-banner-name')).toContainText(
      COLLECTION_NAME,
    )
    //description show more
    await page.getByTestId('description-show-less-more-button').click()
    //collection description
    await expect(page.getByTestId('collection-description')).toContainText(
      'Geometry',
    )
  })

  //ITEMS TAB ----------------------------
  //Buy Now Filter
  await test.step('Verify if checking buy now filter only yield results with price ', async () => {
    await page.getByTestId('filter-checkbox-buynow').nth(1).click()
    await Commands.scrollDownAndStop()
    for (const el of await page
      .locator('[class="infinite-scroll-item"]')
      .all()) {
      await expect(el).toContainText('DOT')
    }
  })

  //Buy Now Button on nft card opens wallet sidebar
  await test.step('Verifies if buy now button on first NFT card opens connect wallet sidebar', async () => {
    await page.locator('[class="infinite-scroll-item"]').first().hover()
    await page.getByTestId('item-buy').first().click()
    await expect(page.getByTestId('wallet-connect-sidebar-modal')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(
      page.getByTestId('wallet-connect-sidebar-modal'),
    ).not.toBeVisible()
  })

  //cart test
  await test.step('Add two first nfts to cart and check if they got inserted', async () => {
    await page.locator('[class="infinite-scroll-item"]').nth(0).hover()
    await page.getByTestId('item-add-to-cart').nth(0).click()
    await page.locator('[class="infinite-scroll-item"]').nth(1).hover()
    await page.getByTestId('item-add-to-cart').nth(1).click()
    await page.getByTestId('navbar-button-cart').click()
    await expect(page.getByTestId('shopping-cart-modal')).toBeVisible()
    await expect(page.getByTestId('shopping-cart-item').nth(0)).toContainText(
      COLLECTION_NAME,
    )
    await expect(page.getByTestId('shopping-cart-item').nth(1)).toContainText(
      COLLECTION_NAME,
    )
    await page.getByTestId('modal-close-button').click()
  })

  //art view
  await test.step('Activates art view and check if NFT name was hidden', async () => {
    await page.getByTestId('advanced-filter-collapsible').first().click()
    await page.getByTestId('filter-artview-checkbox').nth(1).click()
    await Commands.scrollDownAndStop()
    await expect(page.getByTestId('nft-name')).not.toBeVisible()
    await page.getByTestId('filter-artview-checkbox').nth(1).click()
  })

  //ACTIVITY TAB ----------------------------
  await test.step('Switches to activity tab', async () => {
    await page.getByTestId('collection-tab-activity').nth(1).click()
    await Commands.scrollDownAndStop()
  })

  //chart
  await test.step('Checks chart visibility', async () => {
    await expect(page.getByTestId('collection-activity-chart')).toBeVisible()
  })

  //Holders Tab
  await test.step('Holders tab Interactions', async () => {
    const holdersTab = page.getByTestId('collection-holders-container')
    //check if nft details on Holders tab has content
    await page.getByTestId('collection-holder-nft-details').first().click()
    await expect(holdersTab).toContainText(COLLECTION_NAME)
    //check if popover on Holders is present
    await expect(
      page.getByTestId('collection-nft-holder').first(),
    ).toBeVisible()
    await page.getByTestId('collection-nft-holder-address').first().hover()
    await expect(page.getByTestId('identity-popover-container')).toBeVisible()
  })

  //event filters
  await test.step('Event Filters(sale,list,mint,transfer)', async () => {
    const eventTable = page.getByTestId('nfts-event-table')
    const saleFilter = page.getByTestId('event-checkbox-filter-sale').nth(1)
    const listingFilter = page
      .getByTestId('event-checkbox-filter-listing')
      .nth(1)
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
  })

  //Creator link
  await test.step('Check if creator address redirects to proper page', async () => {
    await page.getByTestId('collection-creator-address').click()
    await expect(page).toHaveURL(`/ahp/u/${COLLECTION_OWNER}`)
  })
})
