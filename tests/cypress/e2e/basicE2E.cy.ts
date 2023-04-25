describe('landingRmrk', () => {
  it('loadLanding', () => {
    cy.loginWithKeyring()
    cy.visit(
      '/rmrk/gallery/16516179-36FDCC8B7888DCED32-SUBWORK_MO-SUBWORK_MORNING_VIBE-0000000000000001'
    )
    cy.rmrkNavbar()
  })
})

describe('landingBsx', () => {
  it('loadLanding', () => {
    cy.visit('/snek/gallery/659233203-5')
    cy.snekNavbar()
  })
})

describe('snekCollectionItem', () => {
  it('collectionActions', { scrollBehavior: false }, () => {
    cy.visit('/snek/gallery/659233203-5')
    cy.visit('/snek/collection/3132385849')
    cy.checkCollectionActions('Morski pes', 'bXkmyH...J5CSGP')
  })
})

describe('snekGalleryItem', () => {
  it('galleryListedItemActions', () => {
    cy.loginWithKeyring()
    cy.snekGalleryListedItemActions('2773267381-1', 'bXkQe5...qDNyCN')
  })
  it('galleryUnlistedItemActions', () => {
    cy.loginWithKeyring()
    cy.snekGalleryUnlistedItemActions('2773267381-3', 'bXkQe5...qDNyCN')
  })
})

describe('rmrkCollectionItem', () => {
  it('collectionActions', { scrollBehavior: false }, () => {
    cy.visit(
      '/rmrk/gallery/16516179-36FDCC8B7888DCED32-SUBWORK_MO-SUBWORK_MORNING_VIBE-0000000000000001'
    )
    cy.visit('/rmrk/collection/36FDCC8B7888DCED32-SUBWORK_MO')
    cy.checkCollectionActions('Subwork morning vibe', 'DpRVpD...o6PA1a')
  })
})

describe('rmrkGalleryItem', () => {
  it('galleryListedItemActions', () => {
    cy.loginWithKeyring()
    cy.visit(
      '/rmrk/gallery/9834502-32b209ecbe2b33dd24-DINOXEGGS-DXDANGLS-0000000000000080'
    )
    cy.waitForNetworkIdle('+(HEAD|GET)', '*', 1000)
    cy.get('[data-cy="item-price"]').should('contain', 'KSM')
    cy.get('[data-cy="item-buy"]').should('be.disabled')
  })

  it('galleryUnlistedItemActions', () => {
    cy.visit(
      '/rmrk/gallery/9834502-32b209ecbe2b33dd24-DINOXEGGS-DXDANGLS-0000000000000061'
    )
    cy.waitForNetworkIdle('POST', '*', 1000)
    cy.get('[data-cy="item-price"]').should('not.contain', 'KSM')
  })
})
