describe('render Media.vue component', () => {
  it('should render basic image', () => {
    cy.visit(
      '/rmrk/gallery/12451896-3892e43e923e5ad973-KAG-MUTAGEN_1500-0000000000000414'
    )
    cy.waitForNetworkIdle('+(GET|HEAD|POST)', '*', 1000)

    cy.getCy('item-title').should('contain.text', 'Mutagen - 1500')
    cy.getCy('item-description')
      .find('.description-wrapper')
      .should('contain.text', 'Mutagen is mined in a Laboratory')
    cy.getCy('item-collection').should('contain.text', 'Kusama Ape Game')
    cy.getCy('item-creator').should('contain.text', 'Kusama Ape Club')
    cy.getCy('item-owner').should('exist')
    cy.getCy('item-media').find('img').should('exist')
  })

  it.only('should render 3D Model', () => {
    cy.visit(
      '/rmrk/gallery/11078330-7cf9daa38281a57331-BSS-LB_SPACESHIP_356-0000000000000356'
    )
    cy.waitForNetworkIdle('+(GET|HEAD|POST)', '*', 1000)

    cy.getCy('item-title').should('contain.text', 'lb Spaceship #356')
    cy.getCy('item-description')
      .find('.description-wrapper')
      .should('contain.text', 'Class: "Zaphkiel" Cruiser')
    cy.getCy('item-collection').should('contain.text', 'Budget Spaceships')
    cy.getCy('item-creator').should('contain.text', 'cwh')
    cy.getCy('item-owner').should('exist')
    cy.getCy('item-media').find('model-viewer').should('exist')
    cy.getCy('carousel-related').find('model-viewer').should('exist')
  })

  it('should render audio', () => {
    cy.visit(
      '/rmrk/gallery/9684463-c8205518d881699b3e-%E2%9D%84%EF%B8%8F-01_FROM_SINGULARITY-0000000000000005'
    )
    cy.waitForNetworkIdle('+(GET|HEAD|POST)', '*', 1000)

    cy.getCy('item-title').should('contain.text', '01 fr.om - singularity')
    cy.getCy('item-collection').should(
      'contain.text',
      // eslint-disable-next-line quotes
      'glaciers mood'
    )
    cy.getCy('item-creator').should('contain.text', 'fr.om')
    cy.getCy('item-owner').should('exist')
    cy.getCy('item-media').find('audio').should('exist')
    cy.getCy('carousel-related').find('img').should('exist')
  })

  it('should render video', () => {
    cy.visit(
      '/rmrk/gallery/12049607-4466b2edfa4d261069-POLKAWEAR-YOROI_GIFT_CARD_15-0000000000000023'
    )
    cy.waitForNetworkIdle('+(GET|HEAD|POST)', '*', 1000)

    cy.getCy('item-title').should('contain.text', 'Yoroi gift card #15')
    cy.getCy('item-collection').should('contain.text', '[ polkawear ]')
    cy.getCy('item-creator').should('contain.text', 'mad4ox')
    cy.getCy('item-owner').should('exist')
    cy.getCy('item-media').find('video').should('exist')
    cy.getCy('carousel-related').find('video').should('exist')
  })
})
