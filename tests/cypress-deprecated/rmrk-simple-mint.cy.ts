describe('simple mint in rmrk', () => {
  beforeEach(() => {
    cy.loginWithKeyring()
    cy.visit(
      '/rmrk/gallery/10177217-0a24c7876a892acb79-RADTOADZ-RADTOADZ-0000000000000103',
    )
    cy.waitForNetworkIdle('POST', '*', 1000)
  })
})
