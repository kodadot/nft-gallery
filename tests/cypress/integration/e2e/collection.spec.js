/* eslint-disable indent */

/* eslint-disable no-undef */
const baseUrl = 'http://localhost:9090'
describe('Collection Page should display the various collections and their details.', () => {
  it('Navigate to the Collection Page', () => {
    cy.visit(baseUrl + '/rmrk/collections')
  })

  context('Filter by New First', () => {
    it('Should display the various collections and their details.', () => {
      cy.get('.is-grouped > :nth-child(1) > .control > .select > select')
        .then(($select) => {
          const opt = $select.find('option[value="BLOCK_NUMBER_DESC"]')
          $select.val(opt.attr('value'))
          return $select
        })
        .trigger('change')
    })
    it('Validate Page loaded and view Newest first', () => {
      cy.get('.columns').should('be.visible')
      cy.wait(2000)
    })
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
      cy.wait(2000)
    })
  })

  context('Filter by Last Interacted', () => {
    it('Should display the various collections and their details.', () => {
      cy.get('.is-grouped > :nth-child(1) > .control > .select > select')
        .then(($select) => {
          const opt = $select.find('option[value="UPDATED_AT_DESC"]')
          $select.val(opt.attr('value'))
          return $select
        })
        .trigger('change')
    })
    it('Validate Page loaded and view Last Interacted', () => {
      cy.get('.columns').should('be.visible')
      cy.wait(2000)
    })
  })
  context('Filter by Most Expensive', () => {
    it('Should display the various collections and their details.', () => {
      cy.get('.is-grouped > :nth-child(1) > .control > .select > select')
        .then(($select) => {
          const opt = $select.find('option[value="PRICE_DESC"]')
          $select.val(opt.attr('value'))
          return $select
        })
        .trigger('change')
    })
    it('Validate Page loaded and view Last Interacted', () => {
      cy.get('.columns').should('be.visible')
      cy.wait(2000)
    })
  })
  context('Filter by from cheaper', () => {
    it('Should display the various collections and their details.', () => {
      cy.get('.is-grouped > :nth-child(1) > .control > .select > select')
        .then(($select) => {
          const opt = $select.find('option[value="PRICE_ASC"]')
          $select.val(opt.attr('value'))
          return $select
        })
        .trigger('change')
    })
    it('Validate Page loaded and view Last Interacted', () => {
      cy.get('.columns').should('be.visible')
      cy.wait(2000)
    })
  })
})
