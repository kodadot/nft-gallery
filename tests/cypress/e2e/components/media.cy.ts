describe('render Media.vue component', () => {
  it('should render basic image', () => {
    cy.visit(
      '/rmrk/gallery/12451896-3892e43e923e5ad973-KAG-MUTAGEN_1500-0000000000000414'
    )
    cy.waitForNetworkIdle('+(GET|HEAD)', '*', 1000)

    cy.getCy('item-title').should('contain.text', 'Mutagen - 1500')
    cy.getCy('item-description')
      .find('.description-wrapper')
      .should('contain.text', 'Mutagen is mined in a Laboratory')
    cy.getCy('item-collection').should('contain.text', 'Kusama Ape Game')
    cy.getCy('item-creator').should('contain.text', 'Kusama Ape Club')
    cy.getCy('item-owner').should('exist')
    cy.getCy('item-media').find('img').should('exist')
  })
})
