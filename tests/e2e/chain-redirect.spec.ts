import { expect, test } from './fixtures'

test('Chain Redirections', async ({ page, Commands }) => {
  // Collection page
  await test.step('Expect collection to be redirected to explore collection on chain change', async () => {
    const COLLECTION_ADDRESS_PATH = '/ahp/collection/52'
    const COLLECTION_EXPLORE_PATH = '/ahk/explore/collectibles'
    const COLLECTION_NESTED_PATH_TABS = ['activity', 'swaps']
    const TARGET_CHAIN = 'ahk'

    // from items tab
    await page.goto(COLLECTION_ADDRESS_PATH)
    await Commands.switchChain(TARGET_CHAIN)
    await expect(page).toHaveURL(COLLECTION_EXPLORE_PATH)

    // from nested path tabs
    for (const tab of COLLECTION_NESTED_PATH_TABS) {
      await page.goto(`${COLLECTION_ADDRESS_PATH}/${tab}`)
      await Commands.switchChain(TARGET_CHAIN)
      await expect(page).toHaveURL(COLLECTION_EXPLORE_PATH)
    }
  })
})
