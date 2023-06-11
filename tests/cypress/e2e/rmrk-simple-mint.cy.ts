describe('simple mint in rmrk', () => {
  beforeEach(() => {
    cy.loginWithKeyring()
    cy.visit(
      '/rmrk/gallery/10177217-0a24c7876a892acb79-RADTOADZ-RADTOADZ-0000000000000103'
    )
    cy.waitForNetworkIdle('POST', '*', 1000)
  })

  it('should able to simple mint', () => {
    // mint page
    cy.visit('/rmrk/mint')
    cy.waitForNetworkIdle('POST', '*', 1000)

    // fee should zero at first
    cy.get('[data-cy="fee"]')
      .invoke('text')
      .then((text) => {
        const cleanedText = text.trim().replace(/\s+/g, ' ')
        expect(cleanedText).to.equal('0 KSM')
      })

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

    cy.get('[data-cy="input-edition"] input').should('have.value', 1)
    cy.get('[data-cy="input-advance-settings"]').should('not.exist')
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

    // advance settings
    cy.get('[data-cy="input-advance-settings"]').find('a').click()

    // batch address
    cy.get('[data-cy="input-batch-address"]').type(
      '- FQBgFrkzevAZCvFZB485rQa6h7gsZQz3UXRuYwxAzG7zQ4w{enter}'
    )
    cy.get('[data-cy="input-batch-address"]').type(
      '- CocvTCrHM2bcLGNFTVGd71AuvVPFVPbJknDiLJAmNEAfLzi{enter}'
    )
    cy.get('[data-cy="input-batch-address"]').type(
      '- FqCJeGcPidYSsvvmT17fHVaYdE2nXMYgPsBn3CP9gugvZR5{enter}'
    )
    cy.get('[data-cy="input-batch-address"]').type('- 123INVALID{enter}').blur()
    cy.get('[data-cy="input-valid-address"]').then(($el) => {
      const text = $el.text()
      expect(text.trim()).to.equal('Currently matched 3 addresses')
    })

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

    // related issue https://github.com/kodadot/nft-gallery/issues/3966
    cy.get('[data-cy="fee"]')
      .invoke('text')
      .then((text) => {
        const cleanedText = text.trim().replace(/\s+/g, ' ')
        expect(cleanedText).to.not.equal('0 KSM')
      })
  })
})
