import { expect, test } from './fixtures'

test('Check if netlify deploy preview was built', async ({ page, baseURL }) => {
  //test.setTimeout(180000)
  const pr_number = process.env.PR_NUMBER
  await page.goto(`https://github.com/kodadot/nft-gallery/pull/${pr_number}`)
  await expect(
    page.getByText(
      `https://deploy-preview-${pr_number}--koda-canary.netlify.app`,
    ),
  ).toBeVisible()
  await page.goto(`${baseURL}`)
  await expect(page.getByText('Polkadot NFT')).toBeVisible()
})
