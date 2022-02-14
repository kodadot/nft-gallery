/* eslint-disable indent */

/* eslint-disable no-undef */
const baseUrl = 'http://localhost:9090'
describe('Navigate to Homepage ', () => {
  it('Navigate to the Home page', () => {
    cy.visit(baseUrl)
    cy.wait(2000)
  })

  it('Search for term', () => {
    cy.get('.input').type('generative', { force: true })
  })

  it('View Search Results', () => {
    cy.get('.input').type('{enter}')
    cy.get('.section').click({ force: true })
  })
})
