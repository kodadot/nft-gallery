describe(
  'landingRmrk',
  {
    viewportHeight: 768,
    viewportWidth: 1024,
  },
  () => {
    //test
    it('loadLanding', () => {
      cy.clearCookies()
      // inspect the caught error
      cy.on('uncaught:exception', (e, runnable) => {
        console.log('error', e)
        return false
      })
      cy.visit('/e2e-login')
      cy.visit('/rmrk')
    })
    it('checkNavbar', () => {
      cy.rmrkNavbar()
    })
  }
)
describe(
  'landingBsx',
  {
    viewportHeight: 768,
    viewportWidth: 1024,
  },
  () => {
    it('loadLanding', () => {
      cy.clearCookies()
      // inspect the caught error
      cy.on('uncaught:exception', (e, runnable) => {
        console.log('error', e)
        return false
      })
      cy.visit('/bsx')
    })
    it('checkNavbar', () => {
      cy.bsxNavbar()
    })
  }
)
describe(
  'exploreRmrkCollections',
  {
    viewportHeight: 768,
    viewportWidth: 1024,
  },
  () => {
    it('loadExplore', () => {
      cy.clearCookies()
      // inspect the caught error
      cy.on('uncaught:exception', (e, runnable) => {
        console.log('error', e)
        return false
      })
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
  }
)
// rmrk gallery
describe(
  'exploreRmrkGallery',
  {
    viewportHeight: 768,
    viewportWidth: 1024,
  },
  () => {
    it('loadExplore', () => {
      cy.clearCookies()
      // inspect the caught error
      cy.on('uncaught:exception', (e, runnable) => {
        console.log('error', e)
        return false
      })
      cy.visit('/rmrk/explore?tab=GALLERY&page=1')
    })
    it('exploreTabs', () => {
      cy.exploreTabs()
    })
    it('expandGallerySearch', () => {
      // since test suite follows testing gallery, switching to gallery here
      cy.get('.tabs > ul > li:nth-child(2)').click()
      cy.get('.mb-0 > .field-body > .field > .button > .icon').click()
    })
    it('checkBuyNow', () => {
      cy.get(
        '.gallery > .mb-3 > .collapse > #sortAndFilter > .columns > .is-flex > .switch > .check'
      ).should('be.visible')
    })
    it('gallerySortRmrk', () => {
      cy.gallerySortBy()
      // adding most reacted since this is rmrk only sorting option
      cy.get(':nth-child(1)').contains('Most reacted')
    })
  }
)

describe(
  'exploreBsxCollections',
  {
    viewportHeight: 768,
    viewportWidth: 1024,
  },
  () => {
    it('loadExplore', () => {
      cy.clearCookies()
      // inspect the caught error
      cy.on('uncaught:exception', (e, runnable) => {
        console.log('error', e)
        return false
      })
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
      // test to determine whether floor > 0 can be added to check if Buy Now works
    })
  }
)
// test 'exploreBsxGallery'
describe(
  'exploreBsxGallery',
  {
    viewportHeight: 768,
    viewportWidth: 1024,
  },
  () => {
    it('loadExplore', () => {
      cy.clearCookies()
      cy.on('uncaught:exception', (e, runnable) => {
        console.log('error', e)
        return false
      })
      cy.visit('/bsx/explore')
    })
    it('checkTabs', () => {
      cy.exploreTabs()
    })
    it('expandGallerySearch', () => {
      // since test suite follows testing gallery, switching to gallery here
      cy.get('.tabs > ul > li:nth-child(2)').click()
      cy.get('.mb-0 > .field-body > .field > .button > .icon').click()
    })
    it('checkBuyNow', () => {
      cy.get(
        '.gallery > .mb-3 > .collapse > #sortAndFilter > .columns > .is-flex > .switch > .check'
      ).should('be.visible')
    })
    it('checkGallerySort', () => {
      cy.gallerySortBy()
    })
  }
)
