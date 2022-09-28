function spotlightSort(arg1, arg2) {
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
    cy.visit('/spotlight')
    cy.getCy('spotlight-id-0').should('contain.html', 'data-cy="identity"')
  })
  it('default sort by sold', () => {
    spotlightSort('spotlight-sold-0', 'spotlight-sold-1')
  })
  it('sort by unique', () => {
    cy.get('th').contains('∃!').click()
    spotlightSort('spotlight-unique-0', 'spotlight-unique-1')
  })
  it('sort by uniqueCollectors', () => {
    cy.get('th').contains('∃! collectors').click()
    spotlightSort(
      'spotlight-uniqueCollectors-0',
      'spotlight-uniqueCollectors-1'
    )
  })
  it('sort by total', () => {
    cy.get('th').contains('Total').click()
    spotlightSort('spotlight-total-0', 'spotlight-total-1')
  })
  it('sort by avg price', () => {
    cy.get('th').contains('Ø price').click()
    spotlightSort('spotlight-averagePrice-0', 'spotlight-averagePrice-1')
  })
  it('sort by volume', () => {
    cy.get('th').contains('Volume').click()
    spotlightSort('spotlight-volume-0', 'spotlight-volume-1')
  })
  it('sort by collections count', () => {
    cy.get('th').contains('Σ collection').click()
    spotlightSort('spotlight-count-0', 'spotlight-count-1')
  })
  it('sort by scoreCalc', () => {
    cy.get('th').contains('Score').click()
    spotlightSort('spotlight-scoreCalc-0', 'spotlight-scoreCalc-1')
  })
})
