describe('simple mint in rmrk', () => {
  beforeEach(() => {
    cy.loginWithKeyring()
    cy.visit('/rmrk')
    cy.waitForNetworkIdle('POST', '*', 1000)

    // get 3 users from latest sales, for use in distribution later
    cy.get(
      '[data-cy="latest-sales"] .carousel-slide:nth-child(1) [data-cy="current-owner"]'
    )
      .invoke('attr', 'href')
      .then((href) => href && href.replace('/rmrk/u/', ''))
      .as('user1')
    cy.get(
      '[data-cy="latest-sales"] .carousel-slide:nth-child(2) [data-cy="current-owner"]'
    )
      .invoke('attr', 'href')
      .then((href) => href && href.replace('/rmrk/u/', ''))
      .as('user2')
    cy.get(
      '[data-cy="latest-sales"] .carousel-slide:nth-child(3) [data-cy="current-owner"]'
    )
      .invoke('attr', 'href')
      .then((href) => href && href.replace('/rmrk/u/', ''))
      .as('user3')
  })

  it('should able to simple mint', function () {
    // mint page
    cy.get('[data-cy="create-dropdown"]').click()
    cy.get('[data-cy="simple"]').click()
    cy.waitForNetworkIdle('POST', '*', 1000)

    // fee should zero at first
    cy.get('[data-cy="fee"] span').should('have.text', '\n    0\n    KSM\n  ')

    // upload
    cy.get('[data-cy="input-upload"] [type="file"]').attachFile(
      'unsplash-image.jpg'
    )

    // name
    cy.get('[data-cy="input-name"]').type('Hello, World!')

    // check symbol
    cy.get('[data-cy="input-symbol"]').clear().type('HELLOWORLDASDF')
    cy.get('[data-cy="input-symbol"] input').should('have.value', 'HELLOWORLD')

    // description
    cy.get('[data-cy="input-description"]').type('this is some description')

    // check edition
    cy.get('[data-cy="input-edition"] .control.minus button').click({
      force: true,
    })
    cy.get('[data-cy="input-edition"] input').should('have.value', 1)
    cy.get('[data-cy="input-advance-settings"]').should('not.exist')
    cy.get('[data-cy="input-edition"] .control.plus button').click().click()
    cy.get('[data-cy="input-edition"] input').should('have.value', 3)
    cy.get('[data-cy="input-advance-settings"]').should('exist')

    // check tags
    cy.get('[data-cy="input-tags"]').type('tag1, tag2, tag3,')
    cy.get('[data-cy="input-tags"] [title="tag1"]').should('exist')
    cy.get('[data-cy="input-tags"] [title="tag2"]').should('exist')
    cy.get('[data-cy="input-tags"] [title="tag3"]').should('exist')
    cy.get('[data-cy="input-tags"] [title="tag1"] a').click()
    cy.get('[data-cy="input-tags"] [title="tag2"] a').click()
    cy.get('[data-cy="input-tags"] [title="tag3"] a').click()
    cy.get('[data-cy="input-tags"] [title="tag1"]').should('not.exist')
    cy.get('[data-cy="input-tags"] [title="tag2"]').should('not.exist')
    cy.get('[data-cy="input-tags"] [title="tag3"]').should('not.exist')
    cy.get('[data-cy="input-tags"]').type('tag1{enter}tag2{enter}tag3{enter}')
    cy.get('[data-cy="input-tags"] [title="tag1"]').should('exist')
    cy.get('[data-cy="input-tags"] [title="tag2"]').should('exist')
    cy.get('[data-cy="input-tags"] [title="tag3"]').should('exist')

    // price
    cy.get('[data-cy="input-price"] input').clear().type('123')

    // password, if exists
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="input-password"]').length) {
        cy.get('[data-cy="input-password"]').type('1234five')
        cy.get('[data-cy="input-password"] .is-clickable').click()
        cy.get('[data-cy="input-password"] input').should(
          'have.value',
          '1234five'
        )
      }
    })

    // advance settings
    cy.get('[data-cy="input-advance-settings"]').find('a').click()

    // batch address
    cy.get('@user1').then((hash) => {
      cy.get('[data-cy="input-batch-address"]').type(`- ${hash}{enter}`)
    })
    cy.get('@user2').then((hash) => {
      cy.get('[data-cy="input-batch-address"]').type(`- ${hash}{enter}`)
    })
    cy.get('@user3').then((hash) => {
      cy.get('[data-cy="input-batch-address"]').type(`- ${hash}{enter}`)
    })
    cy.get('[data-cy="input-batch-address"]').type('- 123INVALID{enter}').blur()
    cy.get('[data-cy="input-valid-address"]').should(
      'contain.text',
      'Currently matched 3 adresses'
    )

    cy.get('[data-cy="input-distribution"]').should('exist')
    cy.get('[data-cy="input-random"] [type="checkbox"]').check({ force: true })
    cy.get('[data-cy="input-random"] [type="checkbox"]').should('be.checked')
    cy.get('[data-cy="input-hashtag"] [type="checkbox"]').uncheck({
      force: true,
    })
    cy.get('[data-cy="input-hashtag"] [type="checkbox"]').should(
      'not.be.checked'
    )
    cy.get('[data-cy="input-nsfw"] [type="checkbox"]').check({ force: true })
    cy.get('[data-cy="input-nsfw"] [type="checkbox"]').should('be.checked')
    cy.get('[data-cy="input-tos"] [type="checkbox"]').check({ force: true })
    cy.get('[data-cy="input-tos"] [type="checkbox"]').should('be.checked')

    cy.get('[data-cy="fee"] span').should(
      'not.have.text',
      '\n    0\n    KSM\n  '
    )
  })
})
