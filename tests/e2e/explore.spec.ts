import { expect, test } from './fixtures'

test('Explore collections', async ({ page, Commands }) => {
  await test.step('Goto explore collections', async () => {
    await page.goto('/ahk/explore/collectibles')
  })

  //Tabs
  await test.step('Verify tab existance', async () => {
    const tabs = page.getByTestId('gallery-explore-tabs').nth(1)
    await expect(tabs.getByText('Collections')).toBeVisible()
    await expect(tabs.getByText('Items')).toBeVisible()
  })

  //Sort Dropdown
  await test.step('Sort by Newest using filter', async () => {
    const sortDropdown = page.getByTestId('explore-sort-dropdown').nth(1)
    await sortDropdown.click()
    await sortDropdown.getByText('Newest').click()
    await page.keyboard.press('Escape')
  })

  //Lazy loading mitigation
  await test.step('Scroll down and wait for images to load', async () => {
    await Commands.scrollDownAndStop()
    await page.waitForFunction(() => {
      const images = Array.from(document.querySelectorAll('img'))
      return images.every((img) => img.complete)
    })
  })

  //Results
  await test.step('Verify if explore results have loaded accordingly', async () => {
    await expect(page.getByTestId('collection-index-0').first()).toBeVisible({
      timeout: 10000,
    })
    expect(
      page.locator('[class="collection-detail__name"]').first().innerText,
    ).not.toContain('')
  })
})

test('Explore Items', async ({ page, Commands }) => {
  await test.step('Go to explore items', async () => {
    await page.goto('/ahk/explore/items?page=1')
  })

  //Tabs
  await test.step('Verify tab existance', async () => {
    const tabs = page.getByTestId('gallery-explore-tabs').nth(1)
    await expect(tabs.getByText('Collections')).toBeVisible()
    await expect(tabs.getByText('Items')).toBeVisible()
  })

  //Filter
  await test.step('Apply filter of 100 KSM minium on results', async () => {
    const expandSearch = page.getByTestId('sidebar-price-filter')
    await expandSearch.click()
    const inputMin = expandSearch.getByTestId('input-min')
    await inputMin.fill('100')
    const btnApply = expandSearch.getByTestId('apply').first()
    await btnApply.click()
  })

  //Sort Results
  await test.step('Sort results by price, ascending', async () => {
    const exploreSort = page.getByTestId('explore-sort-dropdown').nth(1)
    await exploreSort.click()
    await page.getByTestId('price_ASC').nth(1).click()
    const btnAsc = await page.$('[value="price_ASC"]')
    await btnAsc?.click()
    await page.keyboard.press('Escape')
  })

  //mitigate lazy loading
  await test.step('Scroll down, verify first card and filter tag existance', async () => {
    await Commands.scrollDownAndStop()
    await expect(page.getByTestId('card-money').first()).toBeVisible({
      timeout: 10000,
    })
    await expect(page.getByTestId('neo-tag-component').nth(0)).toBeVisible()
    await expect(page.getByTestId('neo-tag-component').nth(1)).toBeVisible({
      timeout: 10000,
    })
  })

  //Listing price
  await test.step('Checks if first NFT card is listed and its value is equal or greater than 100 KSM', async () => {
    const firstCardMoney = page.getByTestId('card-money').first()
    const moneyStr = await firstCardMoney.innerText()
    const money = +moneyStr.split(' ')[0]
    expect(money).toBeGreaterThanOrEqual(100)
  })
})
