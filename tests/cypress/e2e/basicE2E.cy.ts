// describe('landingRmrk', () => {
//   it('loadLanding', () => {
//     cy.loginWithKeyring()
//   })
//   it('checkNavbar', () => {
//     cy.rmrkNavbar()
//   })
// })
//
// describe('landingBsx', () => {
//   it('loadLanding', () => {
//     cy.visit('/bsx')
//   })
//   it('checkNavbar', () => {
//     cy.bsxNavbar()
//   })
// })

// describe('exploreRmrkCollections', () => {
//   it('loadExplore', () => {
//     cy.visit('/rmrk/explore')
//     cy.wait(3000)
//   })
//   it('exploreTabs', () => {
//     cy.exploreTabs()
//   })
//   // check collection sort
//   it('collectionsSort', () => {
//     cy.collectionsSortBy()
//   })
//   it('collectionsBuyNow', () => {
//     cy.collectionsBuyNow()
//   })
// })
//
// describe('exploreRmrkGallery', () => {
//   it('loadExplore', () => {
//     cy.visit('/rmrk/explore?tab=GALLERY&page=1')
//   })
//   it('exploreTabs', () => {
//     cy.exploreTabs()
//   })
//   it('expandGallerySearch', () => {
//     cy.expandGallerySearch()
//   })
//   it('galleryInputFields', () => {
//     cy.galleryInputFields(100)
//   })
//   // it('gallerySortRmrk', () => {
//   //   cy.rmrkGallerySortBy()
//   // })
//   it('galleryBuyNow', () => {
//     cy.galleryBuyNow(100)
//   })
// })

// describe('exploreBsxCollections', () => {
//   it('loadExplore', () => {
//     cy.visit('/bsx/explore')
//   })
//   it('exploreTabs', () => {
//     cy.exploreTabs()
//   })
//   it('collectionsSort', () => {
//     cy.collectionsSortBy()
//   })
//   it('collectionsBuyNow', () => {
//     cy.collectionsBuyNow()
//   })
// })
//
// describe('exploreBsxGallery', () => {
//   it('loadExplore', () => {
//     cy.visit('/bsx/explore')
//     cy.wait(5000)
//   })
//   it('exploreTabs', () => {
//     cy.exploreTabs()
//   })
//   it('expandGallerySearch', () => {
//     cy.get('[data-cy="tabs"]')
//       .should('be.visible')
//       .within(() => {
//         cy.contains('Gallery').click()
//       })
//     cy.expandGallerySearch()
//   })
//   it('galleryInputFields', () => {
//     cy.galleryInputFields(100)
//   })
//   it('gallerySortBsx', () => {
//     cy.bsxGallerySortBy()
//   })
//   it('galleryBuyNow', () => {
//     cy.galleryBuyNow(100)
//   })
// })

describe('bsxCollectionItem', () => {
  it('loginWithKeyring', () => {
    cy.loginWithKeyring()
  })
})
//   it('collectionActions', () => {
//     cy.bsxCollectionActions(
//       '2600576003',
//       'nuclear explosion',
//       'bXkVgi...6Xuvih'
//     )
//   })
// })

// describe('bsxGalleryItem', () => {
//   it('galleryListedItemActions', () => {
//     cy.bsxGalleryListedItemActions('2600576003-1', 'bXkVgi...6Xuvih')
//   })
//   it('galleryUnlistedItemActions', () => {
//     cy.bsxGalleryUnlistedItemActions('2600576003-4', 'bXkVgi...6Xuvih')
//   })
// })

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
