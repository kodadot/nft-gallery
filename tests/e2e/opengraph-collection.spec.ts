import { expect, test } from './fixtures'

//checks collection metadata

const collectionMetadata = [
  {
    metaLocator: '[name="name"]',
    attr: 'content',
    content: 'KodaDot NFT Marketplace',
  },
  {
    metaLocator: '[name="description"]',
    attr: 'content',
    content: 'Amazing collection of generative AI waifus ❤️ ',
  },
  {
    metaLocator: '[property="og:url"]',
    attr: 'content',
    content: '/ahk/collection/165',
  },
  {
    metaLocator: '[property="og:title"]',
    attr: 'content',
    content: 'Berlin (Generative) Waifus',
  },
  {
    metaLocator: '[property="og:description"]',
    attr: 'content',
    content: 'Amazing collection of generative AI waifus ❤️ ',
  },
  {
    metaLocator: '[property="og:image"]',
    attr: 'content',
    content:
      'https://og-image-green-seven.vercel.app/Berlin%20(Generative)%20Waifus.jpeg?price=Items%3A12&image=https%3A%2F%2Fimage-beta.w.kodadot.xyz%2Fipfs%2Fbafybeicaq3tyi5z3uj2oqkern656y2cqnvbu6yjmzo5b23vnilndh7kezq',
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
]

test('Collection Opengraph', async ({ page }) => {
  await page.goto('/ahk/collection/165')
  for (const data of collectionMetadata) {
    await expect(page.locator(`meta${data.metaLocator}`)).toHaveAttribute(
      data.attr,
      data.content,
    )
    await expect(page.locator(`meta${data.metaLocator}`)).toHaveCount(1)
  }
})
