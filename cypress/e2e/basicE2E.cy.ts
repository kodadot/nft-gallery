describe(
  'landingRmrk',
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
      cy.visit('https://beta.kodadot.xyz/rmrk')
    })
    it('checkNavbar', () => {
      cy.get('#NavCreate').should('be.visible')
      cy.get('#NavCreate').click()
      cy.get('[href="/rmrk/create"]')
        .should('have.attr', 'href')
        .and('include', '/rmrk/create')
      cy.get('[href="/rmrk/mint"]')
        .should('have.attr', 'href')
        .and('include', '/rmrk/mint')
      cy.get('[href="/rmrk/creative"]')
        .should('have.attr', 'href')
        .and('include', '/rmrk/creative')
      cy.get('[href="/rmrk/explore"]')
        .should('have.attr', 'href')
        .and('include', '/rmrk/explore')
      cy.get('#NavStats').should('be.visible')
      cy.get('#NavStats').click()
      // lines of code that check if buttons have attribute href and if they include the right url. buttons: spotlight, series, sales, hot
      cy.get('[href="/spotlight"]')
        .should('have.attr', 'href')
        .and('include', '/spotlight')
      cy.get('[href="/series-insight"]')
        .should('have.attr', 'href')
        .and('include', '/series-insight')
      cy.get('[href="/sales"]')
        .should('have.attr', 'href')
        .and('include', '/sales')
      cy.get('[href="/hot"]').should('have.attr', 'href').and('include', '/hot')
      cy.get('#NavLocaleChanger').should('be.visible')
      cy.get('#NavLocaleChanger').click()
      cy.get('#NavProfile').should('be.visible')
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
      cy.visit('https://beta.kodadot.xyz/bsx')
    })
    it('checkNavbar', () => {
      cy.get('#NavCreate').should('be.visible')
      cy.get('#NavCreate').click()
      cy.get('[href="/bsx/create"]')
        .should('have.attr', 'href')
        .and('include', '/bsx/create')
      cy.get('[href="/bsx/explore"]')
        .should('have.attr', 'href')
        .and('include', '/bsx/explore')
      cy.get('[href="/bsx/stats"]')
        .should('have.attr', 'href')
        .and('include', '/bsx/stats')
      cy.get('#NavLocaleChanger').should('be.visible')
      cy.get('#NavLocaleChanger').click()
      cy.get('#NavProfile').should('be.visible')
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
      cy.visit('https://beta.kodadot.xyz/rmrk/explore')
    })
    it('checkTabs', () => {
      cy.get('.tabs > ul').should('be.visible')
      cy.get('.tabs > ul > li').should('have.length', 2)
      cy.get('.tabs > ul > li:nth-child(1)').should('have.text', 'Collections')
      cy.get('.tabs > ul > li:nth-child(2)').should('have.text', 'Gallery')
    })
    it('checkCollectionsTab', () => {
      cy.get('.tabs > ul > li:nth-child(1)').click()
      cy.get('.tabs > ul > li:nth-child(1)').should('have.class', 'is-active')
      cy.get('.tabs > ul > li:nth-child(2)').should(
        'not.have.class',
        'is-active'
      )
    })
    it('checkCollectionsSort', () => {
      cy.get('select').select('blockNumber_DESC')
      cy.get('select').select('blockNumber_ASC')
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
      cy.visit('https://beta.kodadot.xyz/rmrk/explore')
    })
    it('checkTabs', () => {
      cy.get('.tabs > ul').should('be.visible')
      cy.get('.tabs > ul > li').should('have.length', 2)
      cy.get('.tabs > ul > li:nth-child(1)').should('have.text', 'Collections')
      cy.get('.tabs > ul > li:nth-child(2)').should('have.text', 'Gallery')
    })
    it('checkGalleryTab', () => {
      cy.get('.tabs > ul > li:nth-child(2)').click()
      cy.get('.tabs > ul > li:nth-child(1)').should(
        'not.have.class',
        'is-active'
      )
      cy.get('.tabs > ul > li:nth-child(2)').should('have.class', 'is-active')
    })
    it('expandGallerySearch', () => {
      cy.get('.mb-0 > .field-body > .field > .button > .icon').click()
    })
    it('checkBuyNow', () => {
      cy.get(
        '.gallery > .mb-3 > .collapse > #sortAndFilter > .columns > .is-flex > .switch > .check'
      ).should('be.visible')
    })
    it('checkRangeSlider', () => {
      cy.get('.b-slider').should('be.visible')
    })
    it('checkGallerySort', () => {
      cy.get(
        '.gallery > .mb-3 > .collapse > #sortAndFilter > .columns > .mb-0 > .dropdown > .dropdown-trigger > .button'
      ).click()
      cy.get(':nth-child(1)').contains('Most reacted')
      cy.get(':nth-child(2)').contains('Recently Created')
      cy.get(':nth-child(3)').contains('Oldest')
      cy.get(':nth-child(4)').contains('Recently Interacted')
      cy.get(':nth-child(5)').contains('Unpopular')
      cy.get(':nth-child(6)').contains('Price: High to Low')
      cy.get(':nth-child(7)').contains('Price: Low to High')
    })
  }
)
