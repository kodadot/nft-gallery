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
// todo: data-cy for gallery/collection tabs
Cypress.Commands.add('exploreTabs', () => {
  cy.get('[data-cy="tabs"]').should('be.visible')
  cy.contains('Collections').should('be.visible')
  cy.contains('Gallery').should('be.visible')
  cy.contains('Gallery').click()
  cy.contains('Collections').click()
})
Cypress.Commands.add('rmrkGallerySortBy', () => {
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
  cy.get(
    '.gallery > .mb-3 > .collapse > #sortAndFilter > :nth-child(1) > .mb-0 > .dropdown > .dropdown-menu > .dropdown-content > :nth-child(7)'
  ).click()
  cy.wait(5000)
})
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
Cypress.Commands.add('collectionsSortBy', () => {
  // select 'Old first' and 'New first'
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
  // clicking on gallery tab
  cy.contains('Gallery').click()
  cy.get('.mb-0 > .field-body > .field > .button > .icon').click()
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
  cy.get('#infinite-scroll-container > :nth-child(1)')
    .invoke('text')
    .then((text) => {
      if (!(parseFloat(text) >= amount)) {
        throw '[ERROR] Gallery BUY NOW is not working'
      }
    })
})
Cypress.Commands.add('galleryInputFields', (amount) => {
  cy.get('.field > :nth-child(1) > .input').type(String(amount))
  cy.get('.is-1 > .button').click()
  cy.wait(5000)
})
Cypress.Commands.add('toggleBuyNowGallery', () => {
  cy.get(
    '.gallery > .mb-3 > .collapse > #sortAndFilter > :nth-child(1) > .is-flex > .switch > .check'
  ).click()
})
Cypress.Commands.add('bsxGalleryListedItemActions', (nftId, creator) => {
  cy.visit(`/bsx/gallery/${nftId}`)
  cy.get('.price-block__original > .money > span').should('contain', 'BSX')
  cy.get(':nth-child(1) > .tooltip-trigger > .button')
    .should('be.disabled')
    .should('contain', 'BUY')
  cy.get(':nth-child(2) > .tooltip-trigger > .button')
    .should('be.disabled')
    .should('contain', 'MAKE OFFER')
  cy.get('.is-size-6 > .money > span').should('contain', 'BSX')
  cy.get('.field > div[data-v-4d7a8fa0=""] > .button').should('be.visible')
  cy.get(
    '.share > :nth-child(1) > .field-body > .field > :nth-child(2)'
  ).should('be.visible')
  cy.get('.share__tooltip > .tooltip-trigger > .button').should('be.visible')
  cy.get(
    ':nth-child(3) > .collapse > .collapse-trigger > .card-header > .card-header-title'
  ).should('contain', 'Offers')
  cy.get(
    ':nth-child(3) > .collapse > .collapse-trigger > .card-header > .card-header-title'
  ).click()
  cy.get(
    ':nth-child(4) > .collapse > .collapse-trigger > .card-header > .card-header-title'
  ).should('contain', 'History')
  cy.get(
    ':nth-child(4) > .collapse > .collapse-trigger > .card-header > .card-header-title'
  ).click()
  cy.get('.is-flex > .control > .select > select').select('🖼 MINT')
  cy.get('.type-table').should('contain', '🖼 MINT')
  cy.get('[data-label="From"]').should('contain', `${creator}`)
  cy.get('[data-label="Amount"]').should('contain', '-')
})
Cypress.Commands.add('bsxGalleryUnlistedItemActions', (nftId) => {
  cy.visit(`/bsx/gallery/${nftId}`)
  cy.get(':nth-child(1) > .tooltip-trigger > .button')
    .should('be.disabled')
    .should('contain', 'MAKE OFFER')
})
Cypress.Commands.add(
  'bsxCollectionActions',
  (collectionId, nftName, creator) => {
    cy.visit(`/bsx/collection/${collectionId}`)
    cy.get(
      ':nth-child(1) > .card > .nft-card__skeleton > a > .card-image > .b-image-wrapper > .has-ratio'
    ).should('be.visible')
    cy.get('.is-grouped > :nth-child(1) > .control > .select > select').select(
      'Old first'
    )
    cy.get('.is-flex > a > .is-flex-wrap-wrap > .tippy-container > div').should(
      'contain',
      creator
    )
    cy.get('.share > :nth-child(1) > .field-body > .field').should('be.visible')
  }
)
Cypress.Commands.add(
  'rmrkCollectionActions',
  (collectionId, nftName, creator) => {
    cy.visit(`/rmrk/collection/${collectionId}`)
    cy.get(
      ':nth-child(1) > .card > .nft-card__skeleton > a > .card-image > .b-image-wrapper > .has-ratio'
    ).should('be.visible')
    cy.get('.is-grouped > :nth-child(1) > .control > .select > select').select(
      'Oldest'
    )
    cy.get('.is-flex > a > .is-flex-wrap-wrap > .tippy-container > div').should(
      'contain',
      creator
    )
    cy.get('.share > :nth-child(1) > .field-body > .field').should('be.visible')
  }
)
Cypress.Commands.add('rmrkGalleryListedItemActions', (nftId, creator) => {
  cy.visit(`/rmrk/gallery/${nftId}`)
  cy.get('.price-block__original > .money > span').should('contain', 'KSM')
  cy.get(':nth-child(1) > .tooltip-trigger > .button')
    .should('be.disabled')
    .should('contain', 'BUY')
  cy.get('.is-size-6 > .money > span').should('contain', 'KSM')
  cy.get('.field > div[data-v-4d7a8fa0=""] > .button').should('be.visible')
  cy.get(
    '.share > :nth-child(1) > .field-body > .field > :nth-child(2)'
  ).should('be.visible')
  cy.get('.share__tooltip > .tooltip-trigger > .button').should('be.visible')
  cy.get(
    '.block > .collapse > .collapse-trigger > .card-header > .card-header-title'
  ).should('contain', 'History')
  cy.get(
    '.block > .collapse > .collapse-trigger > .card-header > .card-header-title'
  ).click()
  cy.get('.is-flex > .control > .select > select').select('🖼 MINT')
  cy.get('.type-table').should('contain', '🖼 MINT')
  cy.get('[data-label="From"]').should('contain', `${creator}`)
  cy.get('[data-label="Amount"]').should('contain', '-')
})
Cypress.Commands.add('rmrkGalleryUnlistedItemActions', (nftId) => {
  cy.visit(`/rmrk/gallery/${nftId}`)
  cy.get('.price-block__original > .money > span').should('not.exist')
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
