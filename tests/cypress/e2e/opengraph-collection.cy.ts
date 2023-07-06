it('should render correct twitter opengraph on collection page', () => {
  cy.visit('/bsx/collection/2551182625')

  cy.get('meta[property="og:site_name"]').should(
    'have.attr',
    'content',
    'KodaDot - Polkadot / Kusama NFT explorer'
  )
  cy.get('meta[property="twitter:site"]').should(
    'have.attr',
    'content',
    '@KodaDot'
  )
  cy.get('meta[property="twitter:card"]').should(
    'have.attr',
    'content',
    'summary_large_image'
  )
  cy.get('meta[property="twitter:url"]').should(
    'have.attr',
    'content',
    'http://localhost:9090/bsx/collection/2551182625'
  )
  cy.get('meta[property="twitter:title"]').should(
    'have.attr',
    'content',
    'Luna Witches'
  )
  cy.get('meta[property="twitter:description"]').should(
    'have.attr',
    'content',
    'A collection of illustrations on the theme of the moon and the beautiful woman. Abstract, atmospheric, beautiful. '
  )
  cy.get('meta[property="twitter:image"]').should(
    'have.attr',
    'content',
    'https://og-image-green-seven.vercel.app/Luna%20Witches.jpeg?price=Items%3A11&image=https%3A%2F%2Fimage-beta.w.kodadot.xyz%2Fipfs%2Fbafybeibblf24qqngkfos4j3xpb33kffgqyeucdrcn4z2sn7o5mikwx7itu'
  )

  // make sure no duplicate tag
  cy.get('meta[property="og:site_name"]').should('have.length', 1)
  cy.get('meta[name="twitter:card"]').should('not.exist')
  cy.get('meta[name="twitter:site"]').should('not.exist')
  cy.get('meta[name="twitter:url"]').should('not.exist')
  cy.get('meta[name="twitter:title"]').should('not.exist')
  cy.get('meta[name="twitter:description"]').should('not.exist')
  cy.get('meta[name="twitter:image"]').should('not.exist')
})
