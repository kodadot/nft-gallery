const chains = ['bsx', 'snek', 'rmrk']

chains.forEach((chain) => {
  it(`should trigger create collection button on ${chain}`, () => {
    cy.visit('/e2e-login')
    cy.visit(`/${chain}/create`)

    // select image
    cy.get('input[type="file"]').attachFile('unsplash-image.jpg')

    // trigger danger button
    cy.contains('button', 'CREATE COLLECTION', { matchCase: false }).click()
    cy.contains('p.help.is-danger', 'Please fill out this field.', {
      matchCase: false,
    }).should('exist')

    // input collection name
    cy.get('input[placeholder="Enter collection name"]').type('Test Collection')

    if (chain === 'rmrk') {
      cy.get('input[placeholder="3-5 character long name"]').type('TEST')
    }

    // input collection description
    cy.get('textarea[placeholder="Enter collection description"]').type(
      'Test Description'
    )

    // trigger insufficient funds
    cy.contains('button', 'CREATE COLLECTION', { matchCase: false }).click()
    cy.contains('p.help.is-danger', 'Insufficient funds', {
      matchCase: false,
    }).should('exist')
  })
})
