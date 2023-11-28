import { expect, test } from './fixtures'

test('Create NFT', async ({ page, Commands }) => {
  const numOfCopies = 5
  await Commands.e2elogin()
  //await page.goto('/ahk/create')
  await page.goto('/ksm/create')
  await page.getByTestId('create-landing-nft-button').click()
  await expect(page).toHaveURL('/ksm/create?select=nft')
  //Single NFT
  await test.step('Single NFT', async () => {
    await Commands.acceptCookies()
    //select single nft creation
    await page.getByTestId('create-landing-single-nft-button').click()
    //upload NFT image
    await page.setInputFiles(
      'input[type="file"]',
      'tests/e2e/unsplash-image.jpg',
    )
    //set name
    await page
      .getByTestId('create-nft-input-name')
      .fill('Parametric NFT divergencies')
    //set description
    await page
      .getByTestId('create-nft-input-description')
      .fill('Testing purpose NFT description using Playwright')
    //select AHK chain on dropdown
    await page
      .getByTestId('create-nft-dropdown-select')
      .selectOption('KusamaHub')
    await expect(page.getByTestId('chain')).toHaveText('ahk')
    //list for sale switch
    await page.getByTestId('create-nft-sale-switch').click()
    //set price
    await page.getByTestId('create-nft-input-list-value').fill('5.5')
    //set number of copies
    await page
      .getByTestId('create-nft-input-copies')
      .fill(numOfCopies.toString())
    await expect(
      page.getByTestId('create-nft-input-copies-switch'),
    ).toBeVisible()
    //activate hastag switch
    await page.getByTestId('create-nft-input-copies-switch').click()
    // - - NFT attributes interactions - -
    //open NFT attribute section
    await page.getByTestId('create-nft-properties').click()
    //add new attribute
    await page.getByTestId('button-add-attribute').click()
    //fill section
    await page
      .getByTestId('attr-0')
      .getByTestId('attribute-input-section')
      .fill('BG')
    //fill value
    await page
      .getByTestId('attr-0')
      .getByTestId('attribute-input-value')
      .fill('Red')
    //add new attribute
    await page.getByTestId('button-add-attribute').click()
    await page
      .getByTestId('attr-1')
      .getByTestId('attribute-input-section')
      .fill('Dress')
    await page
      .getByTestId('attr-1')
      .getByTestId('attribute-input-value')
      .fill('Blue')
    //remove last attribute
    await page.getByTestId('attribute-button-remove').last().click()
    await expect(page.getByTestId('attr-1')).not.toBeVisible()
    //royalty
    const royaltyFields = page
      .getByTestId('royalty-form-input-percentage')
      .locator('input')
    await royaltyFields.fill('5')
    //royalty switch
    await page.getByTestId('royalty-form-switch').click()
    //get user address
    const royaltyCustom = page
      .getByTestId('royalty-form-custom-address')
      .locator('input')
    await expect(royaltyCustom).toBeVisible()
    //NSFW switch
    await page.getByTestId('create-nft-nsfw-switch').click()
    //deposit check
    const expectedDeposit = `${0.0077 * numOfCopies} KSM`
    await expect(
      page.getByTestId('create-nft-deposit-amount-token'),
    ).toHaveText(expectedDeposit, { timeout: 30000 })
    //preview box
    await expect(page.getByTestId('create-nft-preview-box')).toBeVisible()
    expect(
      (await page.getByTestId('nft-preview-name').innerText()).valueOf(),
    ).toBe('Parametric NFT divergencies')
    expect(
      (await page.getByTestId('nft-preview-price').innerText()).valueOf(),
    ).toContain('5.5')
    //learn more link
    await expect(page.getByTestId('create-nft-learn-more-link')).toBeVisible()
    await Commands.checkNewTab(
      'https://hello.kodadot.xyz/multi-chain/fees',
      page.getByTestId('create-nft-learn-more-link').click(),
    )
  })
})
