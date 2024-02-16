import { expect, test } from './fixtures'

const LANDING_PATH = '/ahk'

test('Sidebar Interactions', async ({ page, Commands }) => {
  await Commands.e2elogin()
  await page.goto(LANDING_PATH)
  await test.step('Switches trough sidebars and check if they overlap each other', async () => {
    //profile
    await page.getByTestId('navbar-profile-dropdown').click()
    await expect(page.getByTestId('sidebar-wallet-container')).toBeVisible()
    //cart
    await page.getByTestId('navbar-button-cart').click()
    await expect(page.getByTestId('sidebar-wallet-container')).toBeHidden()
    //notification
    await page.getByTestId('navbar-button-notification').click()
    await expect(page.getByTestId('shopping-cart-modal-container')).toBeHidden()
    //profile
    await page.getByTestId('navbar-profile-dropdown').click()
    await expect(page.getByTestId('notification-modal-container')).toBeHidden()
  })
  await test.step('Check if sidebar closes when clicking navbar links', async () => {
    await page.getByTestId('navbar-profile-dropdown').click()
    await page.getByTestId('classic').click()
    await expect(page.getByTestId('sidebar-wallet-container')).toBeHidden()
  })
  await test.step('Check if Add funds modal opens', async () => {
    await page.getByTestId('navbar-profile-dropdown').click()
    //wait for balances to load
    await expect(page.getByTestId('button-add-funds-empty')).toBeVisible({
      timeout: 10000,
    })
    await page.getByTestId('button-add-funds-empty').click()
    await expect(page.getByTestId('on-ramp-modal')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByTestId('on-ramp-modal')).not.toBeVisible()
  })
})
