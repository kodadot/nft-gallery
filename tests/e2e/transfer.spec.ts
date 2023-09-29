import { expect, test } from './fixtures'

test('Transfer Page Functionality', async ({ page, Commands }) => {
  await Commands.e2elogin()
  await page.goto('/dot/transfer')
  const UserAddress = await page
    .getByTestId('transfer-sender-full-address')
    .getAttribute('key')
  await page.getByTestId('transfer-copy-sender-address').click()
  await Commands.copyText(`${UserAddress}`)
  await page
    .getByPlaceholder('Enter wallet address')
    .fill('0xwer6544443653444422')
  await expect(page.getByTestId('addresschecker-infobox-invalid')).toBeVisible()
  await test.step('Add and Fill input recipients', async () => {
    await page
      .getByPlaceholder('Enter wallet address')
      .nth(0)
      .fill(`${UserAddress}`)
    await page.getByTestId('transfer-input-amount-token').nth(0).fill('1')
    //add recipient
    await page.getByTestId('transfer-icon-add-recipient').click()
    //fill polkadot Address and amount on last field
    await page
      .getByPlaceholder('Enter wallet address')
      .nth(1)
      .fill(`${UserAddress}`)
    await page.getByTestId('transfer-input-amount-token').nth(1).fill('5')
  })
  //triggers switch to send same amount
  await page.getByTestId('transfer-switch-same').click()
  //checks if second address input converted itself according to same amount switch
  await expect(
    page.getByTestId('transfer-input-amount-token').nth(1)
  ).toHaveValue('1')
  await test.step('Test if total sums up', async () => {
    const total = (
      await page.getByTestId('transfer-total-amount').innerText()
    ).valueOf()
    const totalNumber = +total.split(' ')[0]
    expect(totalNumber).toBeGreaterThan(0)
    await test.step('Recurring Payment Button', async () => {
      await page.getByTestId('transfer-tab-usd').click()
      await page.getByTestId('transfer-input-amount-usd').nth(0).fill('5')
      await page.getByTestId('transfer-button-options').click()
      await page.getByTestId('transfer-dropdown-recurring').click()
      Commands.copyText(
        `http://localhost:9090/dot/transfer?target=${UserAddress}&target1=${UserAddress}&usdamount=5`
      )
    })
    //removes last transfer recipient
    await page.getByTestId('transfer-remove-recipient').last().click()
    await test.step('Pay me Button', async () => {
      await page.getByTestId('transfer-input-amount-usd').fill('4')
      await page.getByTestId('transfer-button-options').click()
      await page.getByTestId('transfer-dropdown-pay-me').click()
      Commands.copyText(
        `http://localhost:9090/dot/transfer?target=${UserAddress}&usdamount=4`
      )
    })
    //verify if network fee is present
    await expect(page.getByTestId('transfer-network-fee')).toBeVisible()
    //last step
    await test.step('Switch to KSM and convert address to proper chain', async () => {
      //change to KSM chain
      await page
        .getByTestId('transfer-token-tabs-container')
        .getByText('KSM')
        .click()
      //hard timeout because next step won't work without it
      await page.waitForTimeout(5000)
      await page
        .getByPlaceholder('Enter wallet address')
        .nth(0)
        .fill(`${UserAddress}`)
      await expect(
        page.getByTestId('addresschecker-infobox-invalid')
      ).toBeVisible()
      await page.getByTestId('addresschecker-button-change-to').click()
      await expect(
        page.getByTestId('addresschecker-infobox-convertion-success')
      ).toBeVisible()
    })
  })
})
