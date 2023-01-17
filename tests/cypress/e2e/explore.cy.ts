const testCollections = (route) => {
  it('loadExplore', () => {
    cy.visit(route)
    cy.getCy('tabs')
      .should('be.visible')
      .within(() => {
        cy.contains('Collections').should('be.visible')
        cy.contains('Items').should('be.visible')
      })

    cy.getCy('collection-sort-by').should('be.visible')
    cy.getCy('collection-sort-by').select('Old first')
    cy.getCy('collection-sort-by').select('New first')

    cy.get('[type="checkbox"]').check({ force: true })
    cy.get('[type="checkbox"]').should('be.checked')

    cy.get('[data-cy="collection-index-0"]').should('exist')
    cy.get('[data-cy="collection-index-1"]').should('exist')
    cy.get('[data-cy="collection-index-2"]').should('exist')
    cy.get('[data-cy="collection-index-3"]').should('exist')
  })
}

const testItems = (route) => {
  it('loadExplore', () => {
    cy.visit(route)

    cy.getCy('tabs')
      .should('be.visible')
      .within(() => {
        cy.contains('Collections').should('be.visible')
        cy.contains('Items').should('be.visible')
      })
    cy.getCy('expand-search').click({ force: true })
    cy.getCy('input-min').type('100', { force: true })
    cy.getCy('apply').click({ force: true })
    cy.waitForNetworkIdle('POST', '*', 1000)
    // TODO: clean up selector -> too many elements for data-cy
    cy.get(
      '.gallery > :nth-child(1) > .collapse > #sortAndFilter > :nth-child(1) > .mb-0 > .dropdown > .dropdown-trigger > [data-cy="gallery-sort-by"]'
    ).click()
    cy.get('[data-cy="Recently Created"]').should('be.visible')
    cy.get('[data-cy="Oldest"]').should('be.visible')
    cy.get('[data-cy="Price: High to Low"]').should('be.visible')
    cy.get('[data-cy="Price: Low to High"]').should('be.visible')
    cy.get('[data-cy="Recently Interacted"]').should('be.visible')
    cy.get('[data-cy="Unpopular"]').should('be.visible')
    // TODO: clean up selector -> too many elements for data-cy
    cy.get(
      '[pricemin="100000000000000"] > .collapse > #sortAndFilter > :nth-child(1) > .mb-0 > .dropdown > .dropdown-menu > .dropdown-content > [data-cy="Price: Low to High"]'
    ).click()
    cy.get('[type="checkbox"]').check({ force: true, timeout: 5000 })
    cy.getCy('item-index-0')
      .getCy('card-money')
      .invoke('text')
      .then((text) => {
        if (!(parseFloat(text.replace(',', '')) >= 100)) {
          throw '[ERROR] Gallery BUY NOW is not working'
        }
      })
  })
}

describe('exploreCollections', () => {
  const routes = ['/rmrk/explore/collectibles', '/bsx/explore/collectibles']
  routes.forEach((route) => {
    describe(`Collections explore at ${route}`, () => {
      testCollections(route)
    })
  })
})

describe('exploreItems', () => {
  const routes = ['/rmrk/explore/items?page=1', '/bsx/explore/items?page=1']
  routes.forEach((route) => {
    describe(`Testing route ${route}`, () => {
      testItems(route)
    })
  })
})
