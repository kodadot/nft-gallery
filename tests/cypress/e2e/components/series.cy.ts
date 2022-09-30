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

describe('Series.vue component', () => {
  it('identity component in spotlight', () => {
    cy.visit('/rmrk')
    cy.visit('/series-insight')
    cy.getCy('series-index-1').should('be.visible')
    cy.getCy('series-image-1').should('be.visible')
    cy.getCy('series-name-1').should('be.visible')
    cy.getCy('series-volume-1').should('be.visible')
    cy.getCy('series-floorPrice-1').should('be.visible')
    cy.getCy('series-averagePrice-1').should('be.visible')
    cy.getCy('series-highestSale-1').should('be.visible')
    cy.getCy('series-buys-1').should('be.visible')
    cy.getCy('series-sold-1').should('be.visible')
    cy.getCy('series-total-1').should('be.visible')
    cy.getCy('series-rank-1').should('be.visible')
    cy.getCy('series-emoteCount-1').should('be.visible')
  })
  it('default sort by sold', () => {
    seriesSort('series-sold-1', 'series-sold-2')
  })
})
