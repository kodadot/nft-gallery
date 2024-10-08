import { expect, test } from './fixtures'

const chains = [
  'chain-dropdown-ahp',
  'chain-dropdown-ahk',
]

test('Landing Elements', async ({ page }) => {
  await page.goto('')
  for (const data of chains) {
    await page.getByTestId('chain-select').click()
    await page.getByTestId(data).click()
    await expect(page.getByTestId('drops')).toBeVisible()
    await expect(page.getByTestId('explore').last()).toBeVisible()
    await expect(
      page.locator('[data-testid="search-bar"] >> visible = true'),
    ).toBeVisible()
    await expect(page.getByTestId('navbar-profile-dropdown')).toBeVisible()
  }
})
