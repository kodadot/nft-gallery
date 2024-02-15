import { expect, test } from './fixtures'

const TRANSFER_PATH = '/dot/transfer'

test('Transfer Page Functionality', async ({ page, Commands, baseURL }) => {
  await Commands.e2elogin()
  await page.goto(TRANSFER_PATH)

  const UserAddress =
    await test.step('Gets user address via attribute', async () => {
      const UserAddress = await page
        .getByTestId('avatar-identity-icon')
        .getAttribute('data-key')
      return UserAddress
    })

  //Copy address
  await test.step('Copy user address and verifies clipboard content', async () => {
    await page.getByTestId('transfer-copy-sender-address').click()
    await Commands.copyText(`${UserAddress}`)
  })

  //Wrong address format
  await test.step('Inserts invalid address and verifies if error message appears', async () => {
    await page.getByTestId('global-address-input').fill('0xwer6544443653444422')
    await expect(
      page.getByTestId('addresschecker-infobox-invalid'),
    ).toBeVisible()
  })

  //Fill form
  await test.step('Add and Fill input recipients', async () => {
    await page.getByTestId('global-address-input').nth(0).fill(`${UserAddress}`)
    await page.getByTestId('transfer-input-amount-token').nth(0).fill('1')
    //add recipient
    await page.getByTestId('transfer-icon-add-recipient').click()
    //fill polkadot Address and amount on last field
    await page.getByTestId('global-address-input').nth(1).fill(`${UserAddress}`)
    await page.getByTestId('transfer-input-amount-token').nth(1).fill('5')
  })

  //Send same amount Switch
  await test.step('Enables same amount switch and verifies its content', async () => {
    await page.getByTestId('transfer-switch-same').click()
    //checks if second address input converted itself according to same amount switch
    await expect(
      page.getByTestId('transfer-input-amount-token').nth(1),
    ).toHaveValue('1')
  })

  await test.step('Test if total sums up', async () => {
    const total = (
      await page.getByTestId('transfer-total-amount').innerText()
    ).valueOf()
    const totalNumber = +total.split(' ')[0]
    expect(totalNumber).toBeGreaterThan(0)
  })

  //Recurring payment
  await test.step('Switchs to USD tab, fill inputs and verifies if total sums up', async () => {
    await page.getByTestId('transfer-tab-usd').click()
    await page.getByTestId('transfer-switch-same').click()
    await page.getByTestId('transfer-input-amount-usd').nth(0).fill('5')
    await page.getByTestId('global-address-input').nth(1).fill(`${UserAddress}`)
    await page.getByTestId('transfer-input-amount-usd').nth(1).fill('10')
    await page.getByTestId('transfer-button-options').click()
    await page.getByTestId('transfer-dropdown-recurring').click()
    Commands.copyText(
      `${baseURL}/dot/transfer?target=${UserAddress}&usdamount=5&target1=${UserAddress}&usdamount1=10`,
    )
  })

  //removes last transfer recipient
  await page.getByTestId('transfer-remove-recipient').last().click()

  //Pay me
  await test.step('Verifies if pay me button provides correct clipboard format', async () => {
    await page.getByTestId('transfer-input-amount-usd').fill('4')
    await page.getByTestId('transfer-button-options').click()
    await page.getByTestId('transfer-dropdown-pay-me').click()
    Commands.copyText(
      `${baseURL}/dot/transfer?target=${UserAddress}&usdamount=4`,
    )
  })

  //verify if network fee is present
  await expect(page.getByTestId('transfer-network-fee')).toBeVisible()

  //Address conversion
  await test.step('Switch to KSM and convert address to proper chain', async () => {
    //change to KSM chain
    await page
      .getByTestId('transfer-token-tabs-container')
      .getByText('KSM')
      .click()
    await page.getByTestId('global-address-input').nth(0).fill(`${UserAddress}`)
    await expect(
      page.getByTestId('addresschecker-infobox-invalid'),
    ).toBeVisible()
    await page.getByTestId('addresschecker-button-change-to').click()
    await expect(
      page.getByTestId('addresschecker-infobox-convertion-success'),
    ).toBeVisible()
  })
})
