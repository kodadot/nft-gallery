import { expect, test } from './fixtures'

test('Sidebar Interactions', async ({ page, Commands }) => {
  await Commands.e2elogin()
  await page.goto('/ahk')
  //click on settings and check if page redirects correctly
  await page.getByTestId('navbar-profile-dropdown').click()
  await page.getByTestId('sidebar-link-settings').click()
  await expect(page).toHaveURL('/settings')
  await expect(page.getByTestId('sidebar-wallet-container')).toBeHidden()
})
