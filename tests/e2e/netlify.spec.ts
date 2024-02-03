import { expect, test } from './fixtures'

test('Check if netlify deploy preview was built', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}`)
  await expect(page.getByText('Polkadot NFT')).toBeVisible()
  /*
  const responsePromise = page.waitForResponse(
    (response) => response.url() === `${baseURL}` && response.status() === 200,
  )
  const response = await responsePromise
  await response
  */
})
