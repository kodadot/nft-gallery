function seriesSort(arg1, arg2) {
  cy.getCy(`${arg1}`)
    .invoke('text')
    .then((text) => {
      const first = parseInt(text)
      cy.getCy(`${arg2}`)
        .invoke('text')
        .then((text) => {
          const second = parseInt(text)
          expect(first).to.be.greaterThan(second)
        })
    })
}

describe('Spotlight.vue component', () => {
  it('identity component in spotlight', () => {
    cy.visit('/rmrk')
    cy.visit('/series-insight')
    // should be visible
    cy.getCy('series-index-1').should('be.visible')
    cy.getCy('series-insight').click({ force: true })
    // cy.getCy('series-index-1').should('contain.html', 'data-cy="identity"')
  })
})
