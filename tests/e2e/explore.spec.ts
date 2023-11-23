import { expect, test } from './fixtures'

const collectionRoutes = [
  '/rmrk/explore/collectibles',
  '/ahk/explore/collectibles',
]

for (const route of collectionRoutes) {
  test(`Collections explore at ${route}`, async ({ page, Commands }) => {
    await page.goto(route)
    const tabs = page.getByTestId('gallery-explore-tabs').nth(1)
    await expect(tabs.getByText('Collections')).toBeVisible()
    await expect(tabs.getByText('Items')).toBeVisible()
    const sortDropdown = page.getByTestId('explore-sort-dropdown').nth(1)
    await sortDropdown.click()
    await sortDropdown.getByText('Newest').click()
    await page.keyboard.press('Escape')
    await Commands.scrollDownAndStop()
    await page.waitForFunction(() => {
      const images = Array.from(document.querySelectorAll('img'))
      return images.every((img) => img.complete)
    })
    await expect(page.getByTestId('collection-index-0').first()).toBeVisible({
      timeout: 10000,
    })
    expect(
      page.locator('[class="collection-detail__name"]').first().innerText,
    ).not.toContain('')
  })
}
const routes = ['/rmrk/explore/items?page=1', '/ahk/explore/items?page=1']

for (const route of routes) {
  test(`Explore Items on ${route}`, async ({ page, Commands }) => {
    await page.goto(route)
    const tabs = page.getByTestId('gallery-explore-tabs').nth(1)
    await expect(tabs.getByText('Collections')).toBeVisible()
    await expect(tabs.getByText('Items')).toBeVisible()
    const expandSearch = await page.getByTestId('sidebar-price-filter')
    await expandSearch.click()
    const inputMin = await expandSearch.getByTestId('input-min')
    await inputMin.type('100')
    const btnApply = await expandSearch.getByTestId('apply').first()
    await Promise.all([
      page.waitForResponse(
        (resp) => resp.url().includes('imagedelivery.net') && resp.ok(),
      ),
      btnApply.click(),
    ])
    const exploreSort = await page.getByTestId('explore-sort-dropdown').nth(1)
    await exploreSort.click()
    await page.getByTestId('price_ASC').nth(1).click()
    const btnAsc = await page.$('[value="price_ASC"]')
    await btnAsc?.click()
    //active and deactive buy now, since its buggy
    await page.getByTestId('filter-checkbox-buynow').nth(1).click()
    await page.getByTestId('filter-checkbox-buynow').nth(1).click()
    await Commands.scrollDownAndStop()
    await expect(page.getByTestId('card-money').first()).toBeVisible({
      timeout: 10000,
    })
    const firstItem = (await page.getByTestId('card-money')).first()
    const moneyStr = await firstItem.innerText()
    const money = +moneyStr.split(' ')[0]
    expect(money).toBeGreaterThanOrEqual(100)
  })
}
