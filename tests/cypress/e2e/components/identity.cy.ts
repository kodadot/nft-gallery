const users = [
  {
    address: 'FqCJeGcPidYSsvvmT17fHVaYdE2nXMYgPsBn3CP9gugvZR5',
    name: 'deepologic',
    twitter: '@deepologic',
  },
  {
    address: 'FUEGFWoPPtX4XkRzEnZnMgwGKENscHXAiEZy6kcgaDz1BY6',
    name: 'Yumi Arts',
    twitter: '@YumiArtsNFT',
  },
  {
    address: 'D5DfsRWMpcBm39Leh539efFnDF1n337YWcYVHNi94pjv1SJ',
    name: 'nftxtiff',
    twitter: '@nftxtiff',
  },
]

describe('Identity.vue component', () => {
  users.forEach(({ address, name, twitter }) => {
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

        cy.visit(`/rmrk/u/${address}`)
        cy.getCy('identity').realHover()
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
