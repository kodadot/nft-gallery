it('should change the language', () => {
  cy.visit('/e2e-login')
  cy.getCy('mockAddress').should('have.text', 'true')
  cy.visit('/')

  // check de
  cy.getCy('profileDropdown').click()
  cy.getCy('skeleton-multiple-balances').should('not.exist')
  cy.getCy('sidebar-language').click()
  cy.getCy('sidebar-language').find('.o-drop__item.is-active').should('exist')
  cy.getCy('sidebar-language-de').click()
  cy.getCy('sidebar-language')
    .find('.o-drop__menu')
    .should('have.css', 'display', 'none')
  cy.getCy('profileDropdown').click()
  cy.get('.title.is-2').eq(0).should('contain.text', 'Rampenlicht')

  // check fr
  cy.getCy('profileDropdown').click()
  cy.getCy('skeleton-multiple-balances').should('not.exist')
  cy.getCy('sidebar-language').click()
  cy.getCy('sidebar-language').find('.o-drop__item.is-active').should('exist')
  cy.getCy('sidebar-language-fr').click()
  cy.getCy('sidebar-language')
    .find('.o-drop__menu')
    .should('have.css', 'display', 'none')
  cy.getCy('profileDropdown').click()
  cy.get('.title.is-2').eq(0).should('contain.text', 'Coup de projecteur')
})
