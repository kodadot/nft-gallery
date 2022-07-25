/// <reference types="cypress" />
// ***********************************************
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
})
Cypress.Commands.add('exploreSortBy', () => {
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

declare global {
  namespace Cypress {
    interface Chainable {
      exploreTabs(): Chainable<Element>
      exploreSortBy(): Chainable<Element>
    }
  }
}
