describe('landingRmrk', () => {
  //test
  it('loadLanding', () => {
    cy.clearCookies()
    cy.visit('/e2e-login')
    cy.visit('/rmrk')
  })
  it('checkNavbar', () => {
    cy.rmrkNavbar()
  })
})
describe('landingBsx', () => {
  it('loadLanding', () => {
    cy.visit('/bsx')
  })
  it('checkNavbar', () => {
    cy.bsxNavbar()
  })
})
describe('exploreRmrkCollections', () => {
  it('loadExplore', () => {
    cy.visit('/rmrk/explore?tab=COLLECTION&page=1')
  })
  it('checkTabs', () => {
    cy.exploreTabs()
  })
  // check collection sort
  it('checkCollectionSort', () => {
    cy.collectionsSortBy()
  })
  it('checkCollectionsBuyNow', () => {
    cy.get('.mb-5 > .switch > .check').click()
    cy.get('#infinite-scroll-container > :nth-child(1)').should(
      'contain',
      'Floor :'
    )
  })
})
// rmrk gallery
describe('exploreRmrkGallery', () => {
  it('loadExplore', () => {
    cy.visit('/rmrk/explore?tab=GALLERY&page=1')
  })
  it('exploreTabs', () => {
    cy.exploreTabs()
  })
  it('expandGallerySearch', () => {
    cy.expandGallerySearch()
  })
  it('checkBuyNow', () => {
    cy.get(
      '.gallery > .mb-3 > .collapse > #sortAndFilter > .columns > .is-flex > .switch > .check'
    ).should('be.visible')
  })
  it('gallerySortRmrk', () => {
    cy.rmrkGallerySortBy()
  })
})

describe('exploreBsxCollections', () => {
  it('loadExplore', () => {
    cy.visit('/bsx/explore')
  })
  it('checkGalleryTabs', () => {
    cy.exploreTabs()
  })
  it('checkCollectionsSort', () => {
    cy.collectionsSortBy()
  })
  it('checkCollectionsBuyNow', () => {
    cy.get('.mb-5 > .switch > .check').click()
    cy.get('#infinite-scroll-container > :nth-child(1)').should(
      'contain',
      'Floor :'
    )
  })
})
describe('exploreBsxGallery', () => {
  it('loadExplore', () => {
    cy.visit('/bsx/explore')
  })
  it('checkTabs', () => {
    cy.exploreTabs()
  })
  it('expandGallerySearch', () => {
    cy.expandGallerySearch()
  })
  it('checkBuyNow', () => {
    cy.get(
      '.gallery > .mb-3 > .collapse > #sortAndFilter > .columns > .is-flex > .switch > .check'
    ).should('be.visible')
  })
  it('checkGallerySort', () => {
    cy.bsxGallerySortBy()
  })
})
