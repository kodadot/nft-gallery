import { expect, test } from '@playwright/test'

test('settings -> mint -> single nft', async ({ page }) => {
  await page.goto('/e2e-login')
  await expect(page.getByTestId('navbar-profile-dropdown')).toBeVisible()
  await expect(page.getByTestId('navbar-button-connect-wallet')).toBeHidden()
  await expect(page.getByTestId('mockAddress')).toHaveText('true', {
    timeout: 15000,
  })
  await page.goto('/')

  await page.getByTestId('navbar-profile-dropdown').click()
  await page.getByTestId('sidebar-link-settings').click()
  await expect(page.getByText('Metadata')).toBeVisible()
  await page.getByTestId('create').click()
  await page.getByTestId('create-landing-nft-button').click()
  await page.getByTestId('create-landing-single-nft-button').click()
  await expect(page.getByText('Your Awesome Art')).toBeVisible()
})
