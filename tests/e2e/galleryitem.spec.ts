import { expect, test } from './fixtures'

test('Element existance verification', async ({ page }) => {
  await page.goto('/ahk/gallery/6-10')
  await page.waitForLoadState('networkidle')
  //activity tab
  await page
    .getByTestId('gallery-item-tabs')
    .locator('[aria-controls="1-content"]')
    .click()
  await page.getByTestId('gallery-item-activity-filter-all').click()
  await expect(
    page.getByTestId('gallery-item-activity-table').locator('td').first(),
  ).toBeVisible()
  //details tab
  await page
    .getByTestId('gallery-item-description-neotabs')
    .locator('[aria-controls="2-content"]')
    .click()
  await expect(
    page.getByTestId('gallery-item-details-tab-content'),
  ).toBeVisible()
  //chart tab
  await page
    .getByTestId('gallery-item-tabs')
    .locator('[aria-controls="2-content"]')
    .click()
  await expect(page.getByTestId('gallery-item-chart')).toBeVisible()
  //checks if page redirects properly to collection
  await page.getByTestId('gallery-item-collection-link').click()
  await expect(page).toHaveURL('/ahk/collection/6')
})

test('Share Button Functionality', async ({ page }) => {
  await page.goto('/ahk/gallery/6-10')
  await page.waitForLoadState('networkidle')
  const shareBtn = page.getByTestId('gallery-item-share-button')
  await shareBtn.click()
  //Copy Link
  await shareBtn.getByText('Copy Link').click()
  const clipboardText1 = await page.evaluate('navigator.clipboard.readText()')
  expect(clipboardText1).toContain('/ahk/gallery/6-10')
  //Twitter
  await shareBtn.click()
  await shareBtn.getByTestId('gallery-item-share-dropdown-twitter').click()
  const newTabPromise = page.waitForEvent('popup')
  const newTab = await newTabPromise
  await newTab.waitForLoadState()
  await expect(newTab).toHaveURL(
    'https://twitter.com/i/flow/login?redirect_after_login=%2Fintent%2Ftweet%3Ftext%3DCheck%2520out%2520this%2520awesome%2520NFT%2520on%2520KodaDot%26via%3DKodaDot%26url%3Dhttp%3A%2F%2Flocalhost%3A9090%2Fahk%2Fgallery%2F6-10',
  )
  await newTab.close()
  //QR Code
  await shareBtn.click()
  await shareBtn.getByText('QR Code').click()
  await expect(
    page.getByTestId('gallery-item-share-dropdown-qrcode'),
  ).toBeVisible()
})

test('More Button Functionality', async ({ page }) => {
  await page.goto('/ahk/gallery/6-10')
  await page.waitForLoadState('networkidle')
  //more button
  await page.getByTestId('gallery-item-more-button').click()
  const downloadPromise = page.waitForEvent('download')
  await page.getByTestId('gallery-item-more-dropdown-download').click()
  await downloadPromise
})

test('Description tab', async ({ page }) => {
  await page.goto('/ahk/gallery/6-10')
  await page.waitForLoadState('networkidle')
  await page
    .getByTestId('gallery-item-description-neotabs')
    .locator('[aria-controls="0-content"]')
    .click()
  await expect(
    page.getByTestId('gallery-item-description-tab-content'),
  ).toBeVisible()
  await expect(
    page.getByTestId('gallery-item-description-tab-content'),
  ).toContainText('This anime waifu loves')
})
