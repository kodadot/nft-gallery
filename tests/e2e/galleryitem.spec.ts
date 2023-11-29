import { expect, test } from './fixtures'

test('Gallery item Interactions', async ({ page }) => {
  await test.step('Goto Ahk gallery item', async () => {
    await page.goto('/ahk/gallery/6-10')
  })

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
  })

  //Chart tab
  await test.step('Verify chart visibility', async () => {
    await page
      .getByTestId('gallery-item-tabs')
      .locator('[aria-controls="2-content"]')
      .click()
    await expect(page.getByTestId('gallery-item-chart')).toBeVisible()
  })

  //Share Button
  await test.step('Verify if share button options work accordingly', async () => {
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
    await page.keyboard.press('Escape')
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
    ).toContainText('This anime waifu loves')
  })

  //Redirection
  await test.step('Clicks on collection link on gallery item and checks redirection', async () => {
    await page.getByTestId('gallery-item-collection-link').click()
    await expect(page).toHaveURL('/ahk/collection/6')
  })
})
