it('should render correct twitter opengraph', () => {
  cy.visit('/bsx/gallery/2551182625-1')

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
    'http://localhost:9090/bsx/gallery/2551182625-1'
  )
  cy.get('meta[property="twitter:title"]').should(
    'have.attr',
    'content',
    'Luna Witches #1'
  )
  cy.get('meta[property="twitter:description"]').should(
    'have.attr',
    'content',
    'A collection of illustrations on the theme of the moon and the beautiful woman. Abstract, atmospheric, beautiful. '
  )
  cy.get('meta[property="twitter:image"]').should(
    'have.attr',
    'content',
    'https://og-image-green-seven.vercel.app/Luna%20Witches%20%231.jpeg?price=0.7500KSM&image=https://image-beta.w.kodadot.xyz/ipfs/bafybeicybs6ew352zb7ze5tsvc72zh4bp57k3dgikzhxfhpcfd5ebt3wc4&mime=image/jpeg'
  )
})
