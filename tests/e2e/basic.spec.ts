import { expect, test } from './fixtures'

const chains = [
  'chain-dropdown-bsx',
  'chain-dropdown-ksm',
  'chain-dropdown-ahp',
  'chain-dropdown-ahk',
  'chain-dropdown-rmrk',
]

test('Landing Elements', async ({ page }) => {
  await page.goto('')
  for (const data of chains) {
    await page.getByTestId('chain-select').click()
    await page.getByTestId(data).click()
    await expect(page.getByTestId('drops')).toBeVisible()
    await expect(page.getByTestId('explore').last()).toBeVisible()
    await expect(page.getByTestId('search-bar')).toBeVisible()
    await expect(page.getByTestId('footer-container')).toBeVisible()
    await expect(page.getByTestId('navbar-profile-dropdown')).toBeVisible()
  }
})
