const users = [
  {
    address: 'FqCJeGcPidYSsvvmT17fHVaYdE2nXMYgPsBn3CP9gugvZR5',
    name: 'deepologic',
    twitter: '@deepologic',
    item: '14621258-900D19DC7D3C444E4C-MECHWOM-MACHANICAL_WOMAN_ANIME_2-0000000000000029',
  },
  {
    address: 'FUEGFWoPPtX4XkRzEnZnMgwGKENscHXAiEZy6kcgaDz1BY6',
    name: 'Yumi Arts',
    twitter: '@YumiArtsNFT',
    item: '13429128-800f8a914281765a7d-DREAM-DREAMBITS_OR_SLIME_QUEEN-0000000000000075',
  },
  {
    address: 'D5DfsRWMpcBm39Leh539efFnDF1n337YWcYVHNi94pjv1SJ',
    name: 'nftxtiff',
    twitter: '@nftxtiff',
    item: '11626180-160a6f4320f11acb25-LCKWV-PIXEL_BABE_092-0000000000000092',
  },
]

describe('Identity.vue component', () => {
  users.forEach(({ address, name, twitter, item }) => {
    it(
      `should get Identity stats for ${name}`,
      { scrollBehavior: false, browser: 'chrome' },
      () => {
        // https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/testing-dom__clipboard
        cy.wrap(
          Cypress.automation('remote:debugger:protocol', {
            command: 'Browser.grantPermissions',
            params: {
              permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
              origin: window.location.origin,
            },
          })
        )

        cy.visit(`/rmrk/gallery/${item}`)
        cy.visit(`/rmrk/u/${address}`)
        cy.contains('[data-cy="identity"]', name).realHover()
        cy.get('.tippy-popper')
          .should('exist')
          .then(() => {
            cy.getCy('identity-clipboard').realClick()
            cy.getCy('identity-display').should('contain.text', name)
            cy.get('[data-cy="identity-twitter"]')
              .should('have.attr', 'href')
              .and('include', `https://twitter.com/${twitter}`)
            cy.getCy('identity-collected').should(
              'not.have.text',
              '\n      0\n    '
            )
            cy.getCy('identity-created').should(
              'not.have.text',
              '\n      0\n    '
            )
            cy.getCy('identity-sold').should('not.have.text', '\n      0\n    ')

            cy.window().then((win) => {
              win.navigator.clipboard.readText().then((text) => {
                expect(text).to.eq(address)
              })
            })
          })
      }
    )
  })
})
