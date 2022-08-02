/// <reference types="cypress" />
import consola from 'consola'
export {}

Cypress.on('uncaught:exception', (err) => {
  consola.error(err)
  return false
})
Cypress.Commands.add('loginWithKeyring', () => {
  cy.visit('/')
  cy.wait(1000)
  cy.visit('/e2e-login')
  cy.visit('/rmrk')
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
  /// needs solution
  cy.get('[data-cy="gallery-sort-by"]').within((yields) => {
    console.log(yields)
    // one last selector
    cy.get('button is-primary').click()
  })
  cy.get('[data-cy="Recently Created"]').should('be.visible')
  cy.get('[data-cy="Oldest"]').should('be.visible')
  cy.get('[data-cy="Price: High to Low"]').should('be.visible')
  cy.get('[data-cy="Price: Low to High"]').should('be.visible')
  cy.get('[data-cy="Recently Interacted"]').should('be.visible')
  cy.get('[data-cy="Unpopular"]').should('be.visible')
  cy.get('[data-cy="Most reacted"]').should('be.visible')
  cy.get('[data-cy="Recently Created"]').click()
  cy.wait(5000)
})
// done
Cypress.Commands.add('bsxGallerySortBy', () => {
  cy.get('[data-cy="gallery-sort-by"]').click()
  cy.get('[data-cy="Recently Created"]').should('be.visible')
  cy.get('[data-cy="Oldest"]').should('be.visible')
  cy.get('[data-cy="Price: High to Low"]').should('be.visible')
  cy.get('[data-cy="Price: Low to High"]').should('be.visible')
  cy.get('[data-cy="Recently Interacted"]').should('be.visible')
  cy.get('[data-cy="Unpopular"]').should('be.visible')
  cy.get('[data-cy="Most reacted"]').should('be.visible')
  cy.get('[data-cy="Recently Created"]').click()
  cy.wait(5000)
})
// done
Cypress.Commands.add('collectionsSortBy', () => {
  cy.get('[data-cy="collection-sort-by"]').should('be.visible')
  cy.get('[data-cy="collection-sort-by"]').select('Old first')
  cy.get('[data-cy="collection-sort-by"]').select('New first')
})
// done
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
// done
Cypress.Commands.add('bsxNavbar', () => {
  //create
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
  cy.get('[data-cy="expand-search"]').click()
})
Cypress.Commands.add('collectionsBuyNow', () => {
  cy.get('[data-cy="buy-now"]').within(() => {
    return cy.get('[type="checkbox"]').check({ force: true })
  })
  cy.wait(2000)
  cy.get('[data-cy="0"]').within(() => {
    cy.get('[data-cy="collection-floor-price"]')
      .invoke('text')
      .then((text) => {
        if (!(parseFloat(text) > 0)) {
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
      if (!(parseFloat(text) >= amount)) {
        throw '[ERROR] Gallery BUY NOW is not working'
      }
    })
})
Cypress.Commands.add('galleryInputFields', (amount) => {
  cy.get('[data-cy="input-min"]').type(String(amount))
  cy.get('[data-cy="apply"]').click()
  cy.wait(5000)
})
Cypress.Commands.add('toggleBuyNowGallery', () => {
  cy.get('[data-cy="buy-now"]').within(() => {
    return cy.get('[type="checkbox"]').check({ force: true })
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
    cy.get('[data-cy="collection-sort-by"]').select('Oldest')
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
      loginWithKeyring(): Chainable<Element>
      exploreTabs(): Chainable<Element>
      rmrkGallerySortBy(): Chainable<Element>
      bsxGallerySortBy(): Chainable<Element>
      collectionsSortBy(): Chainable<Element>
      rmrkNavbar(): Chainable<Element>
      bsxNavbar(): Chainable<Element>
      expandGallerySearch(): Chainable<Element>
      expandCollectionSearch(): Chainable<Element>
      collectionsBuyNow(): Chainable<Element>
      galleryBuyNow(amount: number): Chainable<Element>
      galleryInputFields(amount: number): Chainable<Element>
      toggleBuyNowGallery(): Chainable<Element>
      bsxGalleryListedItemActions(
        nftId: string,
        creator: string
      ): Chainable<Element>
      bsxGalleryUnlistedItemActions(
        nftId: string,
        creator: string
      ): Chainable<Element>
      bsxCollectionActions(
        collectionId: string,
        nftName: string,
        creator: string
      ): Chainable<Element>
      rmrkCollectionActions(
        collectionId: string,
        nftName: string,
        creator: string
      ): Chainable<Element>
      rmrkGalleryListedItemActions(
        nftId: string,
        creator: string
      ): Chainable<Element>
      rmrkGalleryUnlistedItemActions(
        nftId: string,
        creator: string
      ): Chainable<Element>
    }
  }
}
