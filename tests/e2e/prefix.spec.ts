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
