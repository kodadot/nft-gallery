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

  const exploreSort = await page.getByTestId('explore-sort')
  await exploreSort.nth(2).click()

  await Promise.all(SORT_SAMPLES.map((sort) => page.$(`[value="${sort}"]`)))

  await Promise.all(
    [...Array(5).keys()].map(async (i) => {
      const collectionIndex = await page.getByTestId(`collection-index-${i}`)
      await collectionIndex.waitFor()
    })
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
  const btnApply = await expandSearch.getByTestId('apply')

  await Promise.all([
    page.waitForResponse(
      (resp) => resp.url().includes('squid.subsquid.io') && resp.ok()
    ),
    btnApply.click(),
  ])

  await page.waitForResponse(
    (resp) => resp.url().includes('image') && resp.ok()
  )

  const exploreSort = await page.getByTestId('explore-sort')
  await exploreSort.nth(2).click()

  const btnAsc = await page.$('[value="price_ASC"]')
  await btnAsc?.click()

  const firstItem = (await page.getByTestId('card-money')).first()
  const moneyStr = await firstItem.innerText()
  const money = +moneyStr.split(' ')[0]
  expect(money).toBeGreaterThanOrEqual(100)
}
