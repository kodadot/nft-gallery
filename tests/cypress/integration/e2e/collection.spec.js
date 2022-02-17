/* eslint-disable indent */

/* eslint-disable no-undef */
const baseUrl = 'http://localhost:9090'
describe('Collection Page should display the various collections and their details.', () => {
  it('Navigate to the Collection Page', () => {
    cy.visit(baseUrl + '/rmrk/collections')
  })
  context('Filter by Old First', () => {
    it('Should display the various collections and their details.', () => {
      cy.get('.is-grouped > :nth-child(1) > .control > .select > select')
        .then(($select) => {
          const opt = $select.find('option[value="BLOCK_NUMBER_ASC"]')
          $select.val(opt.attr('value'))
          return $select
        })
        .trigger('change')
    })
    it('Validate Page loaded and view oldest first', () => {
      cy.get('.columns').should('be.visible')
    })
  })

  // it('Search for term', () => {
  //     cy.get('.input').type('generative', { force: true })
  // })

  // it('View Search Results', () => {
  //     cy.get('.input').type('{enter}')
  //     cy.get('.section').click({ force: true })
  // })
})
