describe('switch network', () => {
  it('should switch network', () => {
    cy.visit('/')
    cy.getCy('explore').realHover().find('[data-cy="explore-items"]').click()
    cy.getCy('tabs').eq(2).click()
    cy.getCy('0').click()
    cy.getCy('chain-select').click()
    cy.getCy('chain-dropdown-bsx').click()
    cy.getCy('explore').realHover().find('[data-cy="explore-items"]').click()
    cy.getCy('chain').should('contain.text', 'bsx')

    cy.getCy('0').click()
    cy.getCy('chain-select').click()
    cy.getCy('chain-dropdown-rmrk').click()
    cy.getCy('explore').realHover().find('[data-cy="explore-items"]').click()
    cy.getCy('chain').should('contain.text', 'rmrk')

    cy.getCy('0').click()
    cy.getCy('chain-select').click()
    cy.getCy('chain-dropdown-stt').click()
    cy.getCy('explore').realHover().find('[data-cy="explore-items"]').click()
    cy.getCy('chain').should('contain.text', 'ahp')

    cy.getCy('0').click()
    cy.getCy('chain-select').click()
    cy.getCy('chain-dropdown-stmn').click()
    cy.getCy('explore').realHover().find('[data-cy="explore-items"]').click()
    cy.getCy('chain').should('contain.text', 'stmn')

    cy.getCy('0').click()
    cy.getCy('chain-select').click()
    cy.getCy('chain-dropdown-ksm').click()
    cy.getCy('explore').realHover().find('[data-cy="explore-items"]').click()
    cy.getCy('chain').should('contain.text', 'rmrk2')

    cy.getCy('0').click()
    cy.getCy('chain').should('contain.text', 'rmrk2')
  })
})
