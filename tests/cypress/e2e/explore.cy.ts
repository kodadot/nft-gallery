const sortSamples = ['blockNumber_DESC', 'updatedAt_ASC']

const testCollections = (route) => {
  it('loadExplore', () => {
    cy.visit(route)
    cy.getCy('tabs')
      .should('be.visible')
      .within(() => {
        cy.contains('Collections').should('be.visible')
        cy.contains('Items').should('be.visible')
      })

    cy.getCy('explore-sort').should('be.visible').click()
    sortSamples.forEach((sort) => {
      cy.get(`[value="${sort}"]`).should('exist')
    })

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

    cy.getCy('explore-sort').should('be.visible').click()
    sortSamples.forEach((sort) => {
      cy.get(`[value="${sort}"]`).should('exist')
    })

    // TODO: clean up selector -> too many elements for data-cy
    cy.get('[value="price_ASC"]').click()
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
