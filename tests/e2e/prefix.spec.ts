import { expect, test } from '@playwright/test'

test('Switch network', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState()
  //BSX
  await page.getByTestId('chain-select').click()
  await page.getByTestId('chain-dropdown-bsx').click()
  await expect(page.getByTestId('chain')).toHaveText('bsx')
  //AHP
  await page.getByTestId('chain-select').click()
  await page.getByTestId('chain-dropdown-ahp').click()
  await expect(page.getByTestId('chain')).toHaveText('ahp')
  //AHK
  await page.getByTestId('chain-select').click()
  await page.getByTestId('chain-dropdown-ahk').click()
  await expect(page.getByTestId('chain')).toHaveText('ahk')
  //RMRK2
  await page.getByTestId('chain-select').click()
  await page.getByTestId('chain-dropdown-ksm').click()
  await expect(page.getByTestId('chain')).toHaveText('rmrk2')
  //RMRK1
  await page.getByTestId('chain-select').click()
  await page.getByTestId('chain-dropdown-rmrk').click()
  await expect(page.getByTestId('chain')).toHaveText('rmrk')
})

test('Check if RMRK2 NFT URL is correct', async ({ page }) => {
  //RMRK2
  await page.goto('/ksm/explore/items?listed=false&search=Spirit+Key+%232112')
  await page.locator('[class="infinite-scroll-item"]').click()
  await expect(page).toHaveURL(
    '/ksm/gallery/15024340-b6e98494bff52d3b1e-SPIRIT-SPIRIT2112-00002112',
  )
})

//will not work because filtering on Assethubs still not implemented
/*
test('Check if Ahk NFT URL is correct', async ({ page }) => {
  //AHK
  await page.goto('/ahk/explore/items?listed=false&search=Susanne')
  await page.locator('[class="infinite-scroll-item"]').click()
  await expect(page).toHaveURL('/ahk/gallery/111-2')
})
*/
