import { type Prefix } from '@kodadot1/static'
import { expect, test } from './fixtures'

const CHAINS: {
  dropdownText: Prefix
  chainIdText: string
}[] = [
  {
    dropdownText: 'ahp',
    chainIdText: 'ahp',
  },
  {
    dropdownText: 'ahk',
    chainIdText: 'ahk',
  },
]

test('Switch network', async ({ page, Commands }) => {
  await page.goto('/')
  await page.waitForLoadState()
  for (const data of CHAINS) {
    await test.step(`Switching to ${data.chainIdText}`, async () => {
      await Commands.switchChain(data.dropdownText)
      await expect(page.getByTestId('chain')).toHaveText(data.chainIdText)
    })
  }
})

test('Check if Ahk NFT URL is correct', async ({ page }) => {
  await page.goto('/ahk/explore/items?listed=false&search=pixelated')
  await page.locator('[class="infinite-scroll-item"]').click()
  await expect(page).toHaveURL('/ahk/gallery/224-6')
})
