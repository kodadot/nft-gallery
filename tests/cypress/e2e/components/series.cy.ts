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
    cy.tableSort('series-sold-1', 'series-sold-2')
  })
  it('sort by volume', () => {
    cy.get('th').contains('Volume').click()
    cy.tableSort('series-volume-1', 'series-volume-2')
  })
  it('sort by floor price', () => {
    cy.get('th').contains('Floor price').click()
    cy.tableSort('series-floorPrice-1', 'series-floorPrice-2')
  })
  it('sort by highest sale', () => {
    cy.get('th').contains('Highest Sale').click()
    cy.tableSort('series-highestSale-1', 'series-highestSale-2')
  })
  it('sort by buys', () => {
    cy.get('th').contains('Buys').click()
    cy.tableSort('series-buys-1', 'series-buys-2')
  })
  // sort by owners
  it('sort by owners', () => {
    cy.get('th').contains('Owners').click()
    cy.tableSort('series-sold-1', 'series-sold-2')
  })
  // sort by assets
  it('sort by assets', () => {
    cy.get('th').contains('Assets').click()
    cy.tableSort('series-total-1', 'series-total-2')
  })
  // select filter
  it('select filter', () => {
    cy.getCy('nb-rows').select('10').should('have.value', '10')
    // make sure the number of rows is 10
    cy.getCy('series-index-10').should('exist')
    cy.getCy('series-index-11').should('not.exist')
  })
})
