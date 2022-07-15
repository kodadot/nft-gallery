describe(
  'first_testSuite',
  {
    viewportHeight: 768,
    viewportWidth: 1024,
  },
  () => {
    it('loadPage', () => {
      cy.clearCookies()
      // inspect the caught error
      cy.on('uncaught:exception', (e, runnable) => {
        console.log('error', e)
        return false
      })
      cy.visit('https://beta.kodadot.xyz/')
    })
    it('checkLanding', function () {
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
      // lines of code that check if buttons have attribute href and if they include the right url. buttons: spotlight, series, sales, hot
      cy.get('[href="/spotlight"]')
        .should('have.attr', 'href')
        .and('include', '/spotlight')
      cy.get('[href="/series-insight"]')
        .should('have.attr', 'href')
        .and('include', '/series-insight')
      cy.get('[href="/sales"]')
        .should('have.attr', 'href')
        .and('include', '/sales')
      cy.get('[href="/hot"]').should('have.attr', 'href').and('include', '/hot')
      cy.get('#NavLocaleChanger').should('be.visible')
      cy.get('#NavLocaleChanger').click()
      cy.get('#NavProfile').should('be.visible')
    })
    it('checkExplore', () => {
      cy.get('[href="/rmrk/explore"]').click()
      cy.wait(5000)
      cy.get('#GALLERY-label').should('be.visible').click()
      cy.get('.mb-0 > .field-body > .field > .button')
        .should('be.visible')
        .click()
      cy.get(
        '.gallery > .mb-3 > .collapse > #sortAndFilter > .columns > .mb-0 > .dropdown > .dropdown-trigger > .button'
      )
        .should('be.visible')
        .click()
      cy.get(
        '.gallery > .mb-3 > .collapse > #sortAndFilter > .columns > .mb-0 > .dropdown > .dropdown-menu > .dropdown-content > :nth-child(2)'
      )
        .should('be.visible')
        .click()
      cy.get(
        '.gallery > .mb-3 > .collapse > #sortAndFilter > .columns > .mb-0 > .dropdown > .dropdown-menu > .dropdown-content > :nth-child(6)'
      )
        .should('be.visible')
        .click()
      cy.get(
        '.gallery > .mb-3 > .collapse > #sortAndFilter > .columns > .is-flex > .switch > .check'
      )
        .should('be.visible')
        .click()
      cy.get(
        '.gallery > .mb-3 > .collapse > #sortAndFilter > .columns > .is-flex > .switch > .check'
      )
        .should('be.visible')
        .click()
      cy.get('[style="left: 20%;"]').should('be.visible').click()
    })
  }
)
