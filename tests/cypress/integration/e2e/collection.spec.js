/* eslint-disable indent */

/* eslint-disable no-undef */
const baseUrl = 'http://localhost:9090'
describe('Collection Page should display the various collections and their details.', () => {
  beforeEach(() => {
    cy.viewport(1280, 800)
    Cypress.Cookies.defaults({
      preserve: 'session_id',
    })
    Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false
    })
    // cy.wait(2000)
  })

  it('Navigate to the Collection Page', () => {
    cy.viewport(1280, 800)
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
      // cy.wait(2000)
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
      // cy.wait(2000)
    })
  })
  describe('Collection Search Functionality.', () => {
    it('Serach for a collection', () => {
      cy.get('.is-grouped > :nth-child(1) > .control > .select > select')
        .then(($select) => {
          const opt = $select.find('option[value="BLOCK_NUMBER_DESC"]')
          $select.val(opt.attr('value'))
          return $select
        })
        .trigger('change')
      cy.get('.field.is-expanded > .control > .input').type('japandas')
      cy.wait(2000)
      cy.get(':nth-child(3) > .columns').should('be.visible')
      cy.get('.field.is-expanded > .control > .input').clear()
    })
  })
  describe('Collection Buy Now.', () => {
    it('Click on Buy Now button', () => {
      cy.get('.mb-5 > .switch > .check').click()
    })
  })

  describe('Navaigate to Next Page  ', () => {
    let i = 0
    // eslint-disable-next-line no-const-assign
    for (i; i < 5; i++) {
      it('Go to Next Page' + i, () => {
        cy.get(
          'div:nth-child(1) > nav > a.pagination-link.pagination-next'
        ).click()
      })
    }
  })

  describe('Navigate to Random Collection', () => {
    it('Click on random button', () => {
      cy.get('.tooltip-trigger > .button').click()
    })
  })
})
