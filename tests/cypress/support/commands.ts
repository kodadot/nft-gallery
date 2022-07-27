/// <reference types="cypress" />
import consola from 'consola'
export {}

Cypress.on('uncaught:exception', (err) => {
  consola.error(err)
  return false
})
Cypress.Commands.add('exploreTabs', () => {
  cy.get('.tabs > ul').should('be.visible')
  cy.get('.tabs > ul > li').should('have.length', 2)
  cy.get('.tabs > ul > li:nth-child(1)').should('have.text', 'Collections')
  cy.get('.tabs > ul > li:nth-child(2)').should('have.text', 'Gallery')
  cy.get('.tabs > ul > li:nth-child(1)').click()
  cy.get('.tabs > ul > li:nth-child(1)').should('have.class', 'is-active')
  cy.get('.tabs > ul > li:nth-child(2)').should('not.have.class', 'is-active')
  cy.get('.tabs > ul > li:nth-child(2)').click()
  cy.get('.tabs > ul > li:nth-child(2)').should('have.class', 'is-active')
  cy.get('.tabs > ul > li:nth-child(1)').should('not.have.class', 'is-active')
  cy.get('.tabs > ul > li:nth-child(1)').click()
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
  cy.get(
    '.gallery > .mb-3 > .collapse > #sortAndFilter > .columns > .mb-0 > .dropdown > .dropdown-trigger > .button'
  ).click()
  cy.get(':nth-child(1)').contains('Recently Created')
  cy.get(':nth-child(2)').contains('Oldest')
  cy.get(':nth-child(3)').contains('Recently Interacted')
  cy.get(':nth-child(4)').contains('Unpopular')
  cy.get(':nth-child(5)').contains('Price: High to Low')
  cy.get(':nth-child(6)').contains('Price: Low to High')
  cy.get(
    '.gallery > .mb-3 > .collapse > #sortAndFilter > :nth-child(1) > .mb-0 > .dropdown > .dropdown-menu > .dropdown-content > :nth-child(6)'
  ).click()
  cy.wait(5000)
})
Cypress.Commands.add('collectionsSortBy', () => {
  cy.get('select').select('blockNumber_DESC')
  cy.get('select').select('blockNumber_ASC')
})
Cypress.Commands.add('rmrkNavbar', () => {
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
  cy.get('[href="/spotlight"]')
    .should('have.attr', 'href')
    .and('include', '/spotlight')
  cy.get('[href="/series-insight"]')
    .should('have.attr', 'href')
    .and('include', '/series-insight')
  cy.get('[href="/sales"]').should('have.attr', 'href').and('include', '/sales')
  cy.get('[href="/hot"]').should('have.attr', 'href').and('include', '/hot')
  cy.get('#NavLocaleChanger').should('be.visible')
  cy.get('#NavLocaleChanger').click()
  cy.get('#NavProfile').should('be.visible')
})
Cypress.Commands.add('bsxNavbar', () => {
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
Cypress.Commands.add('expandGallerySearch', () => {
  // clicking on gallery tab
  cy.get('.tabs > ul > li:nth-child(2)').click()
  cy.get('.mb-0 > .field-body > .field > .button > .icon').click()
})
Cypress.Commands.add('collectionsBuyNow', () => {
  cy.get('.mb-5 > .switch > .check').click()
  cy.wait(2000)
  cy.get('#infinite-scroll-container > :nth-child(1)')
    .invoke('text')
    .then((text) => {
      const newText = text.split('Floor : ')[1].replace(/\s/g, '')
      if (!(parseFloat(newText) > 0)) {
        throw '[ERROR] Collection BUY NOW is not working'
      }
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

declare global {
  namespace Cypress {
    interface Chainable {
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
    }
  }
}
