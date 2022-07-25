/// <reference types="cypress" />
// ***********************************************

// handle exceptions in console
Cypress.on('uncaught:exception', (err, runnable) => {
  console.log('error', err)
  return false
})

export {}
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
Cypress.Commands.add('gallerySortBy', () => {
  cy.get(
    '.gallery > .mb-3 > .collapse > #sortAndFilter > .columns > .mb-0 > .dropdown > .dropdown-trigger > .button'
  ).click()
  cy.get(':nth-child(2)').contains('Recently Created')
  cy.get(':nth-child(3)').contains('Oldest')
  cy.get(':nth-child(4)').contains('Recently Interacted')
  cy.get(':nth-child(5)').contains('Unpopular')
  cy.get(':nth-child(6)').contains('Price: High to Low')
  cy.get(':nth-child(7)').contains('Price: Low to High')
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

declare global {
  namespace Cypress {
    interface Chainable {
      exploreTabs(): Chainable<Element>
      gallerySortBy(): Chainable<Element>
      collectionsSortBy(): Chainable<Element>
      rmrkNavbar(): Chainable<Element>
      bsxNavbar(): Chainable<Element>
    }
  }
}
