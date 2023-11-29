import { expect, test } from './fixtures'

test('Create NFT', async ({ page, Commands }) => {
  const numOfCopies = 5
  //Login and navigation
  await test.step('Login and navigate trough create single nft menus', async () => {
    await Commands.e2elogin()
    await page.goto('/ksm/create')
    await Commands.acceptCookies()
    await page.getByTestId('create-landing-nft-button').click()
    await expect(page).toHaveURL('/ksm/create?select=nft')
    await page.getByTestId('create-landing-single-nft-button').click()
  })

  //image upload
  await test.step('Upload image into dropupload', async () => {
    await page.setInputFiles(
      'input[type="file"]',
      'tests/e2e/unsplash-image.jpg',
    )
  })

  //Fill fields
  await test.step('Fill name, description and select Ahk on chain dropdown', async () => {
    await page
      .getByTestId('create-nft-input-name')
      .fill('Parametric NFT divergencies')
    await page
      .getByTestId('create-nft-input-description')
      .fill('Testing purpose NFT description using Playwright')
    await page
      .getByTestId('create-nft-dropdown-select')
      .selectOption('KusamaHub')
    await expect(page.getByTestId('chain')).toHaveText('ahk')
  })

  //List for sale
  await test.step('Activates list for sale switch and set a price on the input ', async () => {
    await page.getByTestId('create-nft-sale-switch').click()
    await page.getByTestId('create-nft-input-list-value').fill('5.5')
  })

  //Copies
  await test.step('Set number of copies and verifies if hashtag switch is present and click it', async () => {
    await page
      .getByTestId('create-nft-input-copies')
      .fill(numOfCopies.toString())
    await expect(
      page.getByTestId('create-nft-input-copies-switch'),
    ).toBeVisible()
    await page.getByTestId('create-nft-input-copies-switch').click()
  })

  //NFT attributes
  await test.step('Create, fill and delete NFT attributes', async () => {
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
  })

  //Royalty
  await test.step('Sets a royalty percentage, activate the custom royalty switch and verifies its existance', async () => {
    const royaltyFields = page
      .getByTestId('royalty-form-input-percentage')
      .locator('input')
    await royaltyFields.fill('5')
    //royalty switch
    await page.getByTestId('royalty-form-switch').click()
    const royaltyCustom = page
      .getByTestId('royalty-form-custom-address')
      .locator('input')
    await expect(royaltyCustom).toBeVisible()
  })

  //NSFW switch
  await test.step('Activates NSFW switch', async () => {
    await page.getByTestId('create-nft-nsfw-switch').click()
  })

  //Deposit
  await test.step('Check if deposits are loaded and properly calculated', async () => {
    const expectedDeposit = `${0.0077 * numOfCopies} KSM`
    await expect(
      page.getByTestId('create-nft-deposit-amount-token'),
    ).toHaveText(expectedDeposit, { timeout: 30000 })
  })

  //preview box
  await test.step('Verifies if contents of the preview box match fields from form', async () => {
    await expect(page.getByTestId('create-nft-preview-box')).toBeVisible()
    expect(
      (await page.getByTestId('nft-preview-name').innerText()).valueOf(),
    ).toBe('Parametric NFT divergencies')
    expect(
      (await page.getByTestId('nft-preview-price').innerText()).valueOf(),
    ).toContain('5.5')
  })

  //learn more link
  await test.step('Click on the Learn More link and check if new tab has proper URL', async () => {
    await expect(page.getByTestId('create-nft-learn-more-link')).toBeVisible()
    await Commands.checkNewTab(
      'https://hello.kodadot.xyz/multi-chain/fees',
      page.getByTestId('create-nft-learn-more-link').click(),
    )
  })
})
