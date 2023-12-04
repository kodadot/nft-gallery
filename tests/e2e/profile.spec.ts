import { expect, test } from './fixtures'

test('Profile Interactions', async ({ page, Commands }) => {
  const testAddress = 'CmWHiv7h4m9tEzKD94DH4mqwGTvsdYQe2nouWPF7ipmHpqA'
  await page.goto(`ahk/u/${testAddress}?tab=owned`)
  await Commands.scrollDownSlow()
  //test step - will check if buy now has items that are not listed
  await test.step('Buy Now', async () => {
    await Commands.acceptCookies()
    await page.getByTestId('profile-filter-button-buynow').click()
    await Commands.scrollDownSlow()
    for (const li of await page.locator('[class="nft-card"]').all()) {
      await expect(li.getByText('KSM')).toBeVisible()
    }
  })
  //test step
  await test.step('Activity Tab', async () => {
    await page.getByTestId('profile-tabs').last().click()
    //usually sale and buy are active when you enter the page
    //SALE
    await page.getByTestId('profile-activity-button-filter').nth(1).click()
    //checks if sale tag exists
    await expect(page.getByTestId('history-item-row').first()).toBeVisible()
    await expect(
      page.getByTestId('history-item-row').first().filter({ hasText: 'Sale' }),
    ).toBeVisible()
    await page.getByTestId('identity-tippy-link').first().hover()
    await expect(page.getByTestId('identity-popover-container')).toBeVisible()
    //BUY
    await page.getByTestId('profile-activity-button-filter').nth(0).click()
    await page.getByTestId('profile-activity-button-filter').nth(1).click()
    await page.getByTestId('identity-tippy-link').last().hover()
    await expect(page.getByTestId('identity-popover-container')).toBeVisible()
    await expect(
      page.getByTestId('history-item-row').first().filter({ hasText: 'Buy' }),
    ).toBeVisible()
    //TRANSFER
    await page.getByTestId('profile-activity-button-filter').nth(1).click()
    await page.getByTestId('profile-activity-button-filter').nth(3).click()
    await expect(
      page
        .getByTestId('history-item-row')
        .first()
        .filter({ hasText: 'Transfer' }),
    ).toBeVisible()
    //LIST
    await page.getByTestId('profile-activity-button-filter').nth(3).click()
    await page.getByTestId('profile-activity-button-filter').nth(4).click()
    await expect(
      page.getByTestId('history-item-row').first().filter({ hasText: 'List' }),
    ).toBeVisible()
    //ALL
    await page.getByTestId('profile-activity-button-all').click()
  })
  //test step
  await test.step('Profile Links', async () => {
    //copy address
    await page
      .getByTestId('profile-identity-buttons')
      .getByText('Copy Address')
      .click()
    await Commands.copyText(testAddress)
    //QR Code
    await page
      .getByTestId('profile-identity-buttons')
      .getByText('QR Code')
      .click()
    await expect(page.locator('[class="card-header-title"]')).toBeVisible()
    await page.keyboard.press('Escape')
    //Transfer
    await page
      .getByTestId('profile-identity-buttons')
      .getByText('Transfer')
      .click()
    await expect(page).toHaveURL(
      `/ahk/transfer?target=${testAddress}&usdamount=10&donation=true`,
    )
  })
})
