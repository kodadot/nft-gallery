describe('Spotlight.vue component', () => {
  it('identity component in spotlight', () => {
    cy.visit('/spotlight')
    cy.getCy('spotlight-id-0').should('contain.html', 'data-cy="identity"')
  })
  it('sort by sold', () => {
    cy.getCy('spotlight-sold-0').should('exist')
  })
  it('should render Spotlight component', () => {
    cy.getCy('spotlight-unique-0').should('exist')
  })
  it('should render Spotlight component', () => {
    cy.getCy('spotlight-uniqueCollectors-0').should('exist')
  })
  it('should render Spotlight component', () => {
    cy.getCy('spotlight-total-0').should('exist')
  })
  it('should render Spotlight component', () => {
    cy.getCy('spotlight-averagePrice-0').should('exist')
  })
  it('should render Spotlight component', () => {
    cy.getCy('spotlight-volume-0').should('exist')
  })
  it('should render Spotlight component', () => {
    cy.getCy('spotlight-scoreCalc-0').should('exist')
  })
})
