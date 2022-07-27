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
  it('exploreTabs', () => {
    cy.exploreTabs()
  })
  // check collection sort
  it('collectionsSort', () => {
    cy.collectionsSortBy()
  })
  it('collectionsBuyNow', () => {
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
  it('exploreTabs', () => {
    cy.exploreTabs()
  })
  it('collectionsSort', () => {
    cy.collectionsSortBy()
  })
  it('collectionsBuyNow', () => {
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
  it('gallerySortBsx', () => {
    cy.bsxGallerySortBy()
  })
  it('galleryBuyNow', () => {
    cy.galleryBuyNow(100)
  })
})

describe('mintRmrk', () => {
  it('loadExplore', () => {
    // temporarily here
    cy.visit('/e2e-login')
    cy.visit('/bsx/create')
  })
})

describe('newWallet', () => {
  it('loadGalleryItem', () => {
    cy.visit('/e2e-login')
  })
  it('galleryListedItemActions', () => {
    cy.galleryListedItemActions('2600576003-1', 'bXkVgi...6Xuvih')
  })
  it('galleryUnlistedItemActions', () => {
    cy.galleryUnlistedItemActions('2600576003-4', 'bXkVgi...6Xuvih')
  })
  it('collectionActions', () => {
    cy.collectionActions('2600576003', 'nuclear explosion', 'bXkVgi...6Xuvih')
  })
})
