describe('landingRmrk', () => {
  it('loadLanding', () => {
    cy.loginWithKeyring()
    cy.visit('/rmrk')
  })
  // it('checkNavbar', () => {
  it.skip('checkNavbar', () => {
    cy.rmrkNavbar()
  })
})

describe('landingBsx', () => {
  it('loadLanding', () => {
    cy.visit('/snek')
  })
  // it('checkNavbar', () => {
  it.skip('checkNavbar', () => {
    cy.snekNavbar()
  })
})

describe('exploreRmrkCollections', () => {
  it('loadExplore', () => {
    cy.visit('/rmrk/explore')
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

describe('exploreSnekCollections', () => {
  it('loadExplore', () => {
    cy.visit('/snek/explore')
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

describe('exploreSnekGallery', () => {
  it('loadExplore', () => {
    cy.visit('/snek/explore')
  })
  it('exploreTabs', () => {
    cy.exploreTabs()
  })
  it('expandGallerySearch', () => {
    cy.get('[data-cy="tabs"]')
      .should('be.visible')
      .within(() => {
        cy.contains('Gallery').click()
      })
    cy.expandGallerySearch()
  })
  it('galleryInputFields', () => {
    cy.galleryInputFields(100)
  })
  it('gallerySortSnek', () => {
    cy.snekGallerySortBy()
  })
  it('galleryBuyNow', () => {
    cy.galleryBuyNow(100)
  })
})

describe('snekCollectionItem', () => {
  it('collectionActions', () => {
    cy.snekCollectionActions('3132385849', 'Morski pes', 'bXkmyH...J5CSGP')
  })
})

describe('snekGalleryItem', () => {
  // it('galleryListedItemActions', () => {
  it.skip('galleryListedItemActions', () => {
    cy.loginWithKeyring()
    cy.snekGalleryListedItemActions('2773267381-1', 'bXkQe5...qDNyCN')
  })
  // it('galleryUnlistedItemActions', () => {
  it.skip('galleryUnlistedItemActions', () => {
    cy.loginWithKeyring()
    cy.snekGalleryUnlistedItemActions('2773267381-3', 'bXkQe5...qDNyCN')
  })
})

describe('rmrkCollectionItem', () => {
  it('collectionActions', () => {
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
