import { expect, test } from '@playwright/test'

const SORT_SAMPLES = ['blockNumber_DESC', 'updatedAt_ASC']

test.describe('Explore collections', async () => {
  const routes = ['/rmrk/explore/collectibles', '/bsx/explore/collectibles']

  for (const route of routes)
    test(`Collections explore at ${route}`, async ({ page }) => {
      await page.goto(route)
      await testCollections(page)
    })
})

const testCollections = async (page) => {
  const tabs = await page.getByTestId('tabs')
  await tabs.nth(2).waitFor()

  await tabs.nth(2).getByText('Collections')
  await tabs.nth(2).getByText('Items')

  const exploreSort = await page.getByTestId('explore-sort-dropdown')
  await exploreSort.nth(1).click()

  await Promise.all(SORT_SAMPLES.map((sort) => page.$(`[value="${sort}"]`)))

  await Promise.all(
    [...Array(5).keys()].map(async (i) => {
      const collectionIndex = await page.getByTestId(`collection-index-${i}`)
      await collectionIndex.waitFor()
    }),
  )
}

test.describe('Explore items', async () => {
  const routes = ['/rmrk/explore/items?page=1', '/bsx/explore/items?page=1']

  for (const route of routes)
    test(`Items explore at ${route}`, async ({ page }) => {
      await page.goto(route)
      await testItems(page)
    })
})

const testItems = async (page) => {
  const tabs = await page.getByTestId('tabs')
  await tabs.nth(2).waitFor()

  await tabs.nth(2).getByText('Collections')
  await tabs.nth(2).getByText('Items')

  const expandSearch = await page.getByTestId('expand-search')
  await expandSearch.click()
  const inputMin = await expandSearch.getByTestId('input-min')
  await inputMin.type('100')
  const btnApply = await expandSearch.getByTestId('apply').first()

  await Promise.all([
    page.waitForResponse(
      (resp) => resp.url().includes('squid.subsquid.io') && resp.ok(),
    ),
    btnApply.click(),
  ])

  await page.waitForResponse(
    (resp) => resp.url().includes('image') && resp.ok(),
  )

  const exploreSort = await page.getByTestId('explore-sort-dropdown').nth(1)
  await exploreSort.click()
  await page.getByTestId('price_ASC').nth(1).click()

  const btnAsc = await page.$('[value="price_ASC"]')
  await btnAsc?.click()

  //active and deactive buy now, since its buggy
  await page.getByTestId('filter-checkbox-buynow').nth(1).click()
  await page.getByTestId('filter-checkbox-buynow').nth(1).click()

  await expect(page.getByTestId('card-money').first()).toBeVisible({
    timeout: 10000,
  })
  const firstItem = (await page.getByTestId('card-money')).first()
  const moneyStr = await firstItem.innerText()
  console.log('dinheiro antes: ', moneyStr)
  const money = +moneyStr.split(' ')[0]
  console.log('dinheiro depois: ', money)
  expect(money).toBeGreaterThanOrEqual(100)
}
