import shortAddress from '@/utils/chainProperties'

const users = [
  {
    address: 'FqCJeGcPidYSsvvmT17fHVaYdE2nXMYgPsBn3CP9gugvZR5',
    name: 'deepologic',
    twitter: '@deepologic',
    startedMinting: 'Started minting over 1 year ago',
  },
  {
    address: 'FUEGFWoPPtX4XkRzEnZnMgwGKENscHXAiEZy6kcgaDz1BY6',
    name: 'Yumi Arts',
    twitter: '@YumiArtsNFT',
    startedMinting: 'Started minting 12 months ago',
  },
  {
    address: 'FQBgFrkzevAZCvFZB485rQa6h7gsZQz3UXRuYwxAzG7zQ4w',
    name: 'cwh',
    twitter: '@ClownWorldHouse',
    startedMinting: 'Started minting 10 months ago',
  },
]

describe('Identity.vue component', () => {
  users.forEach(({ address, name, twitter, startedMinting }) => {
    it(`should get Identity stats for ${name}`, () => {
      cy.visit(`/rmrk/u/${address}`)

      cy.getCy('identity').realHover()
      cy.get('.tippy-popper')
        .should('exist')
        .then(() => {
          cy.getCy('identity-display').should('contain.text', name)
          cy.getCy('identity-twitter').should('contain.text', twitter)
          cy.getCy('identity-address').should(
            'contain.text',
            shortAddress(address)
          )
          cy.getCy('identity-started-minting').should(
            'contain.text',
            startedMinting
          )
          cy.getCy('identity-last-bought').should('exist')
          cy.getCy('identity-collected').should(
            'not.have.text',
            '\n      0\n    '
          )
          cy.getCy('identity-created').should(
            'not.have.text',
            '\n      0\n    '
          )
          cy.getCy('identity-sold').should('not.have.text', '\n      0\n    ')
        })
    })
  })
})
