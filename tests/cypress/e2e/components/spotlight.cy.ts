describe('Spotlight.vue component', () => {
  it('identity component in spotlight', () => {
    cy.visit('/rmrk')
    cy.visit('/spotlight')
    cy.getCy('spotlight-id-0').should('contain.html', 'data-cy="identity"')
  })
  it('default sort by sold', () => {
    cy.tableSort('spotlight-sold-0', 'spotlight-sold-1')
  })
  it('sort by unique', () => {
    cy.get('th').contains('∃!').click()
    cy.tableSort('spotlight-unique-0', 'spotlight-unique-1')
  })
  it('sort by uniqueCollectors', () => {
    cy.get('th').contains('∃! collectors').click()
    cy.tableSort('spotlight-uniqueCollectors-0', 'spotlight-uniqueCollectors-1')
  })
  it('sort by total', () => {
    cy.get('th').contains('Total').click()
    cy.tableSort('spotlight-total-0', 'spotlight-total-1')
  })
  it('sort by avg price', () => {
    cy.get('th').contains('Ø price').click()
    cy.tableSort('spotlight-averagePrice-0', 'spotlight-averagePrice-1')
  })
  it('sort by volume', () => {
    cy.get('th').contains('Volume').click()
    cy.tableSort('spotlight-volume-0', 'spotlight-volume-1')
  })
  it('sort by collections count', () => {
    cy.get('th').contains('Σ collection').click()
    cy.tableSort('spotlight-count-0', 'spotlight-count-1')
  })
  it('sort by scoreCalc', () => {
    cy.get('th').contains('Score').click()
    cy.tableSort('spotlight-scoreCalc-0', 'spotlight-scoreCalc-1')
  })
})
