import { expect, test } from './fixtures'

const KSM_TEST_ADDRESS = 'CmWHiv7h4m9tEzKD94DH4mqwGTvsdYQe2nouWPF7ipmHpqA'
const DOT_TEST_ADDRESS = '1vQCgtkdWs4r9RAWvdmUyr1kJgR9pmka2dUVFfrFxPYo1CP'

test('Profile Interactions', async ({ page, Commands, baseURL }) => {
  await page.goto(`ahk/u/${KSM_TEST_ADDRESS}?tab=activity`)
  await Commands.scrollDownSlow()

  //Activity
  await test.step('Activity Tab', async () => {
    await expect(page.getByTestId('profile-tabs').last()).toBeVisible()
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

  //PROFILE LINKS
  await test.step('Profile Links', async () => {
    await expect(page.getByTestId('profile-button-multi-action')).toContainText(
      'Follow',
    )
    //copy address
    await page.getByTestId('profile-wallet-links-button').click()
    await page.getByTestId('profile-wallet-links-button-copy').click()
    await Commands.copyText(KSM_TEST_ADDRESS)
    //Transfer
    await page.getByTestId('profile-wallet-links-button').click()
    await page.getByTestId('profile-wallet-links-button-transfer').click()
    await page.waitForURL(`${baseURL}/ahk/transfer**`)
    const pageUrl = page.url()
    expect(pageUrl).toContain(`/ahk/transfer?target=${KSM_TEST_ADDRESS}`)
  })
})

test('Verify if there are no Assets on Selected chain', async ({
  page,
  Commands,
}) => {
  await page.goto(`ahp/u/${DOT_TEST_ADDRESS}`)
  await Commands.scrollDownSlow()
  await expect(page.getByTestId('profile-no-assets-container')).toBeVisible({
    timeout: 25000,
  })
  await expect(page.getByTestId('profile-no-assets-button')).toBeVisible()
})

test('Profile - is Buy now working?', async ({ page, Commands }) => {
  await page.goto(
    `ahk/u/${KSM_TEST_ADDRESS}?buy_now=true&tab=owned&buy=true&sale=true&collections=334`,
  )
  //test step - will check if buy now has items that are not listed
  await test.step('Buy Now', async () => {
    await Commands.acceptCookies()
    await Commands.scrollDownSlow()
    for (const li of await page.locator('[class="nft-card"]').all()) {
      await expect(li.getByText('KSM')).toBeVisible()
    }
  })
})
