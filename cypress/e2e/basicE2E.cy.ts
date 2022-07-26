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
  it('galleryInputFields', () => {
    cy.galleryInputFields(100)
  })
  it('gallerySortRmrk', () => {
    cy.rmrkGallerySortBy()
  })
  it('galleryBuyNow', () => {
    cy.galleryBuyNow(100)
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
  it('exploreTabs', () => {
    cy.exploreTabs()
  })
  it('expandGallerySearch', () => {
    cy.expandGallerySearch()
  })
  it('galleryInputFields', () => {
    cy.galleryInputFields(100)
  })
  it('checkGallerySort', () => {
    cy.bsxGallerySortBy()
  })
  it('checkBuyNow', () => {
    cy.galleryBuyNow(100)
  })
})
