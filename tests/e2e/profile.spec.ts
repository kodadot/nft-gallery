import { expect, test } from './fixtures'
import path from 'path'

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

test('Profile Creation Form Reset Button', async ({ page, Commands }) => {
  await Commands.e2elogin()
  await page.getByTestId('navbar-profile-dropdown').click()
  await Commands.scrollDownSlow()
  await page.getByTestId('view-profile-button').click()
  await expect(page.getByTestId('profile-button-multi-action'))
    .toContainText('Create Profile')
    .then(async () => {
      await page.getByTestId('profile-button-multi-action').click()
      await expect(page.getByTestId('profile-creation-modal')).toBeVisible()
      await page.getByTestId('create-profile-button').click()
      await page.getByTestId('start-fresh-profile').click()
      await page.waitForSelector('form')
    })

  async function fillForm(page) {
    // Fill out the name and bio
    await page.fill('[data-testid="profile-name"]', 'John Doe')
    await page.fill('[data-testid="profile-bio"]', 'Test bio')
    await Commands.scrollDownSlow()
    // Upload an image
    await expect(page.getByTestId('upload-profile-image')).toBeVisible()
    const fileChooserPromise = page.waitForEvent('filechooser')
    await page.getByText('Click To Select A File').nth(0).click()
    const fileChooser = await fileChooserPromise
    await fileChooser.setFiles(path.join(__dirname, 'unsplash-image.jpg'))
    await page.waitForSelector('img[alt="Selected file"]')
    const resetButton = await page.getByTestId('reset-profile-form')
    await expect(resetButton).toBeVisible()
    await resetButton.click()
    await expect(resetButton).toHaveText('You sure? - Click Again')
    // Check if the button is disabled immediately after clicking
    await expect(resetButton).toBeDisabled()
    // Wait for the button to become enabled again (after 1.5 seconds)
    await page.waitForTimeout(1600)
    await expect(resetButton).toBeEnabled()
    await resetButton.click()
    // Check if form fields are reset
    await expect(page.locator('[data-testid="profile-name"]')).toHaveValue('')
    await expect(page.locator('[data-testid="profile-bio"]')).toHaveValue('')
    await expect(page.locator('img[alt="Selected file"]')).not.toBeVisible()

    await expect(page.getByTestId('profile-creation-modal')).not.toBeVisible()
  }

  await fillForm(page)
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
