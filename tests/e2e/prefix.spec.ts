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
  {
    dropdownText: 'rmrk',
    chainIdText: 'rmrk',
  },
  {
    dropdownText: 'ksm',
    chainIdText: 'rmrk2',
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

test('Check if RMRK2 NFT URL is correct', async ({ page }) => {
  await page.goto('/ksm/explore/items?listed=false&search=Spirit+Key+%232112')
  await page.locator('[class="infinite-scroll-item"]').click()
  await expect(page).toHaveURL(
    '/ksm/gallery/15024340-b6e98494bff52d3b1e-SPIRIT-SPIRIT2112-00002112',
  )
})

test('Check if Ahk NFT URL is correct', async ({ page }) => {
  await page.goto('/ahk/explore/items?listed=false&search=pixelated')
  await page.locator('[class="infinite-scroll-item"]').click()
  await expect(page).toHaveURL('/ahk/gallery/224-6')
})
