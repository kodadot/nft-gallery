/// <reference types="cypress" />
/* eslint-disable @typescript-eslint/no-namespace */
import 'cypress-file-upload'
import consola from 'consola'

export {}

Cypress.on('uncaught:exception', (err) => {
  consola.error(err)
  return false
})

Cypress.Commands.add('loginWithKeyring', () => {
  cy.visit('/')
  cy.visit('/e2e-login')
})

Cypress.Commands.add('exploreTabs', () => {
  cy.get('[data-cy="tabs"]')
    .should('be.visible')
    .within(() => {
      cy.contains('Collections').should('be.visible')
      cy.contains('Gallery').should('be.visible')
    })
})

Cypress.Commands.add('rmrkGallerySortBy', () => {
  // TODO: clean up selector -> too many elements for data-cy
  cy.get(
    '.gallery > .mb-3 > .collapse > #sortAndFilter > :nth-child(1) > .mb-0 > .dropdown > .dropdown-trigger > [data-cy="gallery-sort-by"]'
  ).click()
  cy.get('[data-cy="Recently Created"]').should('be.visible')
  cy.get('[data-cy="Oldest"]').should('be.visible')
  cy.get('[data-cy="Price: High to Low"]').should('be.visible')
  cy.get('[data-cy="Price: Low to High"]').should('be.visible')
  cy.get('[data-cy="Recently Interacted"]').should('be.visible')
  cy.get('[data-cy="Unpopular"]').should('be.visible')
  // cy.get('[data-cy="Most reacted"]').should('be.visible')
  // TODO: clean up selector -> too many elements for data-cy
  cy.get(
    '.gallery > .mb-3 > .collapse > #sortAndFilter > :nth-child(1) > .mb-0 > .dropdown > .dropdown-menu > .dropdown-content > [data-cy="Price: Low to High"]'
  ).click()
})

Cypress.Commands.add('bsxGallerySortBy', () => {
  // TODO: clean up selector -> too many elements for data-cy
  cy.get(
    '.gallery > .mb-3 > .collapse > #sortAndFilter > :nth-child(1) > .mb-0 > .dropdown > .dropdown-trigger > [data-cy="gallery-sort-by"]'
  ).click()
  cy.get('[data-cy="Recently Created"]').should('be.visible')
  cy.get('[data-cy="Oldest"]').should('be.visible')
  cy.get('[data-cy="Price: High to Low"]').should('be.visible')
  cy.get('[data-cy="Price: Low to High"]').should('be.visible')
  cy.get('[data-cy="Recently Interacted"]').should('be.visible')
  cy.get('[data-cy="Unpopular"]').should('be.visible')
  // TODO: clean up selector -> too many elements for data-cy
  cy.get(
    '.gallery > .mb-3 > .collapse > #sortAndFilter > :nth-child(1) > .mb-0 > .dropdown > .dropdown-menu > .dropdown-content > [data-cy="Price: Low to High"]'
  ).click({ force: true })
})

Cypress.Commands.add('collectionsSortBy', () => {
  cy.get('[data-cy="collection-sort-by"]').should('be.visible')
  cy.get('[data-cy="collection-sort-by"]').select('Old first')
  cy.get('[data-cy="collection-sort-by"]').select('New first')
})

Cypress.Commands.add('rmrkNavbar', () => {
  cy.get('[data-cy="create-dropdown"]').click()
  cy.get('[data-cy="classic"]')
    .should('have.attr', 'href')
    .and('include', '/rmrk/create')
  cy.get('[data-cy="simple"]')
    .should('have.attr', 'href')
    .and('include', '/rmrk/mint')
  cy.get('[data-cy="creative"]')
    .should('have.attr', 'href')
    .and('include', '/rmrk/creative')
  cy.get('[data-cy="explore"]')
    .should('have.attr', 'href')
    .and('include', '/rmrk/explore')
  cy.get('[data-cy="stats"]').should('be.visible')
  cy.get('[data-cy="spotlight"]')
    .should('have.attr', 'href')
    .and('include', '/spotlight')
  cy.get('[data-cy="series-insight"]')
    .should('have.attr', 'href')
    .and('include', '/series-insight')
  cy.get('[data-cy="sales"]')
    .should('have.attr', 'href')
    .and('include', '/sales')
  cy.get('[data-cy="hot"]').should('have.attr', 'href').and('include', '/hot')
  cy.get('[data-cy="localChanger"]').should('be.visible')
  cy.get('[data-cy="localChanger"]').click()
  cy.get('[data-cy="profileDropdown"]').should('be.visible')
  cy.get('[data-cy="profileDropdown"]').click()
})

Cypress.Commands.add('bsxNavbar', () => {
  cy.get('[data-cy="create-dropdown"]').click()
  cy.get('[data-cy="classic"]')
    .should('have.attr', 'href')
    .and('include', '/bsx/create')
  cy.get('[data-cy="explore"]')
    .should('have.attr', 'href')
    .and('include', '/bsx/explore')
  cy.get('[data-cy="stats"]')
    .should('be.visible')
    .should('have.attr', 'href')
    .and('include', '/bsx/stats')
  cy.get('[data-cy="localChanger"]').should('be.visible')
  cy.get('[data-cy="localChanger"]').click()
})

Cypress.Commands.add('expandGallerySearch', () => {
  cy.get('[data-cy="expand-search"]').click({ force: true })
})

Cypress.Commands.add('collectionsBuyNow', () => {
  cy.get('[data-cy="buy-now"]').within(() => {
    cy.get('[type="checkbox"]').check({ force: true })
    cy.get('[type="checkbox"]').should('be.checked')
  })
  cy.get('[data-cy="0"]').within(() => {
    cy.get('[data-cy="collection-floor-price"]')
      .invoke('text')
      .then((text) => {
        if (!(parseFloat(text.replace(',', '')) >= 0)) {
          throw '[ERROR] Collection BUY NOW is not working'
        }
      })
  })
})

Cypress.Commands.add('galleryBuyNow', (amount) => {
  cy.toggleBuyNowGallery()
  cy.get('[data-cy="0"]')
    .invoke('text')
    .then((text) => {
      if (!(parseFloat(text.replace(',', '')) >= amount)) {
        throw '[ERROR] Gallery BUY NOW is not working'
      }
    })
})

Cypress.Commands.add('galleryInputFields', (amount) => {
  cy.get('[data-cy="input-min"]').type(String(amount), { force: true })
  cy.get('[data-cy="apply"]').click({ force: true })
})

Cypress.Commands.add('toggleBuyNowGallery', () => {
  cy.get('[data-cy="buy-now"]').within(() => {
    return cy.get('[type="checkbox"]').check({ force: true, timeout: 5000 })
  })
})

Cypress.Commands.add('bsxGalleryListedItemActions', (nftId, creator) => {
  cy.visit(`/bsx/gallery/${nftId}`)
  cy.get('[data-cy="money"]').should('contain', 'BSX')
  cy.get('[data-cy="BUY"]').should('be.disabled')
  cy.get('[data-cy="MAKE_OFFER"]').should('be.disabled')
  cy.get('[data-cy="offer-list"]').should('contain', 'Offers')
  cy.get('[data-cy="offer-list"]').click()
  cy.get('[data-cy="history"]').should('contain', 'History')
  cy.get('[data-cy="history"]').click()
  cy.get('[data-cy="select-event"]').select('🖼 MINT')
  cy.get('[data-label="Type"]').should('contain', '🖼 MINT')
  cy.get('[data-label="From"]').should('contain', `${creator}`)
  cy.get('[data-label="Amount"]').should('contain', '-')
})

Cypress.Commands.add('bsxGalleryUnlistedItemActions', (nftId) => {
  cy.visit(`/bsx/gallery/${nftId}`)
  cy.get('[data-cy="MAKE_OFFER"]').should('be.disabled')
})

Cypress.Commands.add(
  'bsxCollectionActions',
  (collectionId, nftName, creator) => {
    cy.visit(`/bsx/collection/${collectionId}`)
    cy.get('[data-cy="0"]').should('be.visible')
    cy.get('[data-cy="collection-sort-by"]').select('Old first')
    cy.get('[data-cy="identity"]').should('contain', creator)
    cy.get('[data-cy="share-button"]').should('be.visible')
    cy.get('[data-cy="donation-button"]').should('be.visible')
  }
)

Cypress.Commands.add(
  'rmrkCollectionActions',
  (collectionId, nftName, creator) => {
    cy.visit(`/rmrk/collection/${collectionId}`)
    cy.get('[data-cy="0"]').should('be.visible')
    cy.get('[data-cy="collection-sort-by"]').select('Old first')
    cy.get('[data-cy="identity"]').should('contain', creator)
    cy.get('[data-cy="share-button"]').should('be.visible')
    cy.get('[data-cy="donation-button"]').should('be.visible')
  }
)

Cypress.Commands.add('rmrkGalleryListedItemActions', (nftId, creator) => {
  cy.visit(`/rmrk/gallery/${nftId}`)
  cy.get('[data-cy="money"]').should('contain', 'KSM')
  cy.get('[data-cy="BUY"]').should('be.disabled')
  cy.get('[data-cy="history"]').should('contain', 'History')
  cy.get('[data-cy="history"]').click()
  cy.get('[data-cy="select-event"]').select('🖼 MINT')
  cy.get('[data-label="Type"]').should('contain', '🖼 MINT')
  cy.get('[data-label="From"]').should('contain', `${creator}`)
  cy.get('[data-label="Amount"]').should('contain', '-')
})

Cypress.Commands.add('rmrkGalleryUnlistedItemActions', (nftId) => {
  cy.visit(`/rmrk/gallery/${nftId}`)
  cy.get('[data-cy="money"]').should('not.exist')
})

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * @desc visits /e2e-login and gets logged in with newly generated random wallet (empty)
       */
      loginWithKeyring(): Chainable<Element>

      /**
       * @desc checks tab in /explore section, checks whether the tab section contains two visible tabs
       */
      exploreTabs(): Chainable<Element>

      /**
       * @desc clicks on sort button in gallery (rmrk), checks whether all the sort options are visible, finally selects Low to High price options
       */
      rmrkGallerySortBy(): Chainable<Element>

      /**
       * @desc clicks on sort button in gallery (bsx), checks whether all the sort options are visible, finally selects Low to High price options
       */
      bsxGallerySortBy(): Chainable<Element>

      /**
       * @desc check whether collection sorting is visible, then selects both of the options one by one
       */
      collectionsSortBy(): Chainable<Element>

      /**
       * @desc checks whether the elements of RMRK navbar are visible, goes through some options and clicks them
       */
      rmrkNavbar(): Chainable<Element>

      /**
       * @desc checks whether the elements of BSX navbar are visible, goes through some options and clicks them
       */
      bsxNavbar(): Chainable<Element>

      /**
       * @desc click on expand gallery search
       */
      expandGallerySearch(): Chainable<Element>

      /**
       * @desc makes sure Buy Now toggle is on, checks the first item fetched, makes sure the price of it is more than 0
       */
      collectionsBuyNow(): Chainable<Element>

      /**
       * @desc tests buy now in gallery by checking the price of the first item
       * @param amount - what kind of amount are you testing for (set for in tests)
       *
       */
      galleryBuyNow(amount: number): Chainable<Element>

      /**
       * @desc enters the amount to the input field "Min" and hits "Apply"
       * @param amount selected to be but into input field
       */
      galleryInputFields(amount: number): Chainable<Element>

      /**
       * @desc makes sure that 'Buy Now' toggle in gallery is off
       */
      toggleBuyNowGallery(): Chainable<Element>

      /**
       * @desc checks all of the actions available when interacted with listed item on BSX
       * @param nftId - ID of nft being tested (if this test fails, check whether this ID is correct)
       * @param creator - creator of nft
       */
      bsxGalleryListedItemActions(
        nftId: string,
        creator: string
      ): Chainable<Element>

      /**
       * @desc checks all of the actions available when interacted with unlisted item on BSX
       * @param nftId - ID of nft being tested (if this test fails, check whether this ID is correct)
       * @param creator - creator of nft
       */
      bsxGalleryUnlistedItemActions(
        nftId: string,
        creator: string
      ): Chainable<Element>

      /**
       * @desc checks all of the actions available when interacted with collection on BSX
       * @param collectionId
       * @param nftName
       * @param creator
       */
      bsxCollectionActions(
        collectionId: string,
        nftName: string,
        creator: string
      ): Chainable<Element>

      /**
       * @desc checks all of the actions available when interacted with collection on RMRK
       * @param collectionId
       * @param nftName
       * @param creator
       */
      rmrkCollectionActions(
        collectionId: string,
        nftName: string,
        creator: string
      ): Chainable<Element>

      /**
       * @desc checks all of the actions available when interacted with listed item on RMRK
       * @param nftId
       * @param creator
       */
      rmrkGalleryListedItemActions(
        nftId: string,
        creator: string
      ): Chainable<Element>

      /**
       * @desc checks all of the actions available when interacted with unlisted item on RMRK
       * @param nftId
       * @param creator
       */

      rmrkGalleryUnlistedItemActions(
        nftId: string,
        creator: string
      ): Chainable<Element>
    }
  }
}
