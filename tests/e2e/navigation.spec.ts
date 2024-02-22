import { expect, test } from './fixtures'

test('settings -> mint -> single nft', async ({ page, Commands }) => {
  await Commands.e2elogin()
  await page.goto('/')

  await page.getByTestId('navbar-profile-dropdown').click()
  await page.getByTestId('sidebar-link-settings').click()
  await expect(page.getByText('Metadata')).toBeVisible()
  await page.getByTestId('create').click()
  await page.getByTestId('create-landing-nft-button').click()
  await page.getByTestId('create-landing-single-nft-button').click()
  await expect(page.getByText('Your Awesome Art')).toBeVisible()
})
