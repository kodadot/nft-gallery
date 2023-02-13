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
    'https://og-image-green-seven.vercel.app/Luna%20Witches.jpeg?price=Items:11&image=https://image-beta.w.kodadot.xyz/ipfs/bafybeibblf24qqngkfos4j3xpb33kffgqyeucdrcn4z2sn7o5mikwx7itu&mime='
  )
})
