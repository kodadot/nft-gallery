describe('landingRmrk', () => {
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
    cy.collectionsBuyNow()
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
    cy.galleryBuyNow()
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
    cy.collectionsBuyNow()
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
    cy.galleryBuyNow()
  })
  it('checkGallerySort', () => {
    cy.bsxGallerySortBy()
  })
})
