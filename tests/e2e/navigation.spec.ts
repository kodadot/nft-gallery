import { expect, test } from './fixtures'

test('settings -> mint -> single nft', async ({ page, Commands }) => {
  await Commands.e2elogin()
  await page.goto('/')
  await page.getByTestId('navbar-profile-dropdown').click()
  await page.getByTestId('sidebar-link-settings').click()
  await expect(page.getByText('Minting Settings')).toBeVisible()
  await expect(page.getByText('Partykit')).toBeVisible()
  await expect(page.getByText('User Data')).toBeVisible()
  await expect(page.getByText('Go Back')).toBeVisible()
})
