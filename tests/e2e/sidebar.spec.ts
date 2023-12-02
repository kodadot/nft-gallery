import { expect, test } from './fixtures'

test('Sidebar Interactions', async ({ page, Commands }) => {
  await Commands.e2elogin()
  await page.goto('/ahk')
  await page.waitForLoadState('networkidle')
  //checks if sidebar closes when clicking another sidebar
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
