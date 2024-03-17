import { expect, test } from './fixtures'

const ITEM_ADDRESS_PATH = '/ahp/gallery/52-1'
const COLLECTION_ADDRESS_PATH = '/ahp/collection/52'
const ITEM_CHAIN = 'ahp'
const ITEM_ROYALTY_PERCENT = '7%'
const ITEM_ROYALTY_RECIPIENT = '1L2xst...ucgnNZ'

test('Gallery item Interactions', async ({ page }) => {
  await page.goto(ITEM_ADDRESS_PATH)

  //Activity tab
  await test.step('Verifies if activity tab has content', async () => {
    await page
      .getByTestId('gallery-item-tabs')
      .locator('[aria-controls="1-content"]')
      .click()
    await page.getByTestId('gallery-item-activity-filter-all').click()
    await expect(
      page.getByTestId('gallery-item-activity-table').locator('td').first(),
    ).toBeVisible()
  })

  //Details tab
  await test.step('Verifies if content inside details tab is visible', async () => {
    await page
      .getByTestId('gallery-item-description-neotabs')
      .locator('[aria-controls="2-content"]')
      .click()
    await expect(
      page.getByTestId('gallery-item-details-tab-content'),
    ).toBeVisible()
    await expect(page.getByTestId('item-details-chain')).toContainText(
      ITEM_CHAIN,
    )
    await expect(page.getByTestId('item-details-royalty')).toContainText(
      ITEM_ROYALTY_PERCENT,
    )
    await expect(
      page.getByTestId('item-details-royalty-recipient'),
    ).toContainText(ITEM_ROYALTY_RECIPIENT)
  })

  //Chart tab
  await test.step('Verify chart visibility', async () => {
    await page
      .getByTestId('gallery-item-tabs')
      .locator('[aria-controls="2-content"]')
      .click()
    await expect(page.getByTestId('gallery-item-chart')).toBeVisible()
  })

  //More Button
  await test.step('More Button Functionality', async () => {
    await page.getByTestId('gallery-item-more-button').click()
    const downloadPromise = page.waitForEvent('download')
    await page.getByTestId('gallery-item-more-dropdown-download').click()
    await downloadPromise
  })

  //Description tab
  await test.step('Verifies if the right text shows on the description tab', async () => {
    await page
      .getByTestId('gallery-item-description-neotabs')
      .locator('[aria-controls="0-content"]')
      .click()
    await expect(
      page.getByTestId('gallery-item-description-tab-content'),
    ).toBeVisible()
    await expect(
      page.getByTestId('gallery-item-description-tab-content'),
    ).toContainText('Whirls is a art piece built as a risk-taking')
  })

  //Redirection
  await test.step('Clicks on collection link on gallery item and checks redirection', async () => {
    await page.getByTestId('gallery-item-collection-link').click()
    await expect(page).toHaveURL(COLLECTION_ADDRESS_PATH)
  })
})
