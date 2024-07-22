import { expect, test } from './fixtures'

const CHAINS = [
  {
    dropdownText: 'ahp',
    chainIdText: 'ahp',
  },
  {
    dropdownText: 'ahk',
    chainIdText: 'ahk',
  },
]

test('Switch network', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState()
  for (const data of CHAINS) {
    await test.step(`Switching to ${data.chainIdText}`, async () => {
      await page.getByTestId('chain-select').click()
      await page.getByTestId(`chain-dropdown-${data.dropdownText}`).click()
      await expect(page.getByTestId('chain')).toHaveText(data.chainIdText)
    })
  }
})

test('Check if Ahk NFT URL is correct', async ({ page }) => {
  await page.goto('/ahk/explore/items?listed=false&search=pixelated')
  await page.locator('[class="infinite-scroll-item"]').click()
  await expect(page).toHaveURL('/ahk/gallery/224-6')
})
