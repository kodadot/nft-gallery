/// <reference types="cypress" />
// ***********************************************
export {}
// @ts-ignore
Cypress.Commands.add('checkGalleryTabs', () => {
  console.log('TEST COMMAND: checkGalleryTabs')
  cy.get('.tabs > ul').should('be.visible')
  cy.get('.tabs > ul > li').should('have.length', 2)
  cy.get('.tabs > ul > li:nth-child(1)').should('have.text', 'Collections')
  cy.get('.tabs > ul > li:nth-child(2)').should('have.text', 'Gallery')
})

declare global {
  namespace Cypress {
    interface Chainable {
      checkGalleryTabs(): Chainable<Element>
    }
  }
}
