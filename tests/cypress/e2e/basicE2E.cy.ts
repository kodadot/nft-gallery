describe('landingRmrk', () => {
  it('loadLanding', () => {
    cy.loginWithKeyring()
    cy.visit('/rmrk')
  })
  it('checkNavbar', () => {
    cy.rmrkNavbar()
  })
})

describe('landingBsx', () => {
  it('loadLanding', () => {
    cy.visit('/snek')
  })
  it('checkNavbar', () => {
    cy.snekNavbar()
  })
})

describe('snekCollectionItem', () => {
  it('collectionActions', { scrollBehavior: false }, () => {
    cy.snekCollectionActions('3132385849', 'Morski pes', 'bXkmyH...J5CSGP')
  })
})

describe.skip('snekGalleryItem', () => {
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
    cy.rmrkCollectionActions(
      '32b209ecbe2b33dd24-DINOXEGGS',
      'Angel',
      'DinoPQ...LPj2rd'
    )
  })
})

describe('rmrkGalleryItem', () => {
  it('galleryListedItemActions', () => {
    cy.loginWithKeyring()
    cy.rmrkGalleryListedItemActions(
      '9834502-32b209ecbe2b33dd24-DINOXEGGS-DXDANGLS-0000000000000080',
      'DinoPQ...LPj2rd'
    )
  })
  it('galleryUnlistedItemActions', () => {
    cy.rmrkGalleryUnlistedItemActions(
      '9834502-32b209ecbe2b33dd24-DINOXEGGS-DXDANGLS-0000000000000061',
      'DinoPQ...LPj2rd'
    )
  })
})
