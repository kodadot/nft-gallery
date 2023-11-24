import { expect, test } from './fixtures'

const itemMetadata = [
  {
    metaLocator: '[name="name"]',
    attr: 'content',
    content: 'KodaDot NFT Marketplace',
  },
  {
    metaLocator: '[name="description"]',
    attr: 'content',
    content: 'Konnichiwa!',
  },
  {
    metaLocator: '[property="og:url"]',
    attr: 'content',
    content: 'http://localhost:9090',
  },
  {
    metaLocator: '[property="og:title"]',
    attr: 'content',
    content: 'Berlin summer waifu #2',
  },
  {
    metaLocator: '[property="og:description"]',
    attr: 'content',
    content: 'Konnichiwa!',
  },
  {
    metaLocator: '[property="og:image"]',
    attr: 'content',
    content:
      '2Fipfs%2Fbafybeifjk7i2o4xycsbg2dhiciwp4idqzarhschiuimznyrj6cb77a2pry',
  },
  {
    metaLocator: '[property="twitter:site"]',
    attr: 'content',
    content: '@KodaDot',
  },
  {
    metaLocator: '[property="twitter:title"]',
    attr: 'content',
    content: 'KodaDot - NFT Market Explorer',
  },
  {
    metaLocator: '[property="twitter:description"]',
    attr: 'content',
    content: 'One Stop NFT Shop on Polkadot',
  },
  {
    metaLocator: '[property="twitter:image"]',
    attr: 'content',
    content: 'http://localhost:9090/k_card.png',
  },
]

test('Item Opengraph', async ({ page }) => {
  await page.goto('/ahk/gallery/165-2')
  for (const data of itemMetadata) {
    await expect(page.locator(`meta${data.metaLocator}`)).toHaveAttribute(
      data.attr,
      new RegExp(data.content),
    )
    await expect(page.locator(`meta${data.metaLocator}`)).toHaveCount(1)
  }
  await expect(page.getByTestId('metadata-link')).toHaveAttribute(
    'href',
    'https://image-beta.w.kodadot.xyz/ipfs/bafkreicpxyw67alyt53ql4sq5mo5vj23633igsxxyqowbui2qg4322e4wi',
  )
})
