const mediaType = [
  {
    url: '/rmrk/gallery/12451896-3892e43e923e5ad973-KAG-MUTAGEN_1500-0000000000000414',
    title: 'Mutagen - 1500',
    collection: 'Kusama Ape Game',
    type: 'image',
  },
  {
    url: '/rmrk/gallery/11049994-e4c74212b3ed12d02b-INFINITY%20GEMS-GOLD_006-0000000000000094',
    title: 'GOLD #006',
    collection: 'INFINITY GEMS COLLECTION',
    type: '3d',
  },
  {
    url: '/rmrk/gallery/9684463-c8205518d881699b3e-%E2%9D%84%EF%B8%8F-01_FROM_SINGULARITY-0000000000000005',
    title: '01 fr.om - singularity',
    collection: 'glaciers mood',
    type: 'audio',
  },
  {
    url: '/rmrk/gallery/12325644-0cdccfda77c4cdf249-UNIVERSE-UKRAINIAN_VIBURNUM-0000000000000005',
    title: 'Ukrainian Viburnum',
    collection: 'Crypto Universe',
    type: 'video',
  },
]

describe(
  'Media component',
  {
    defaultCommandTimeout: 60000,
    requestTimeout: 60000,
  },
  () => {
    mediaType.forEach(({ url, title, collection, type }) => {
      it(`should render ${type} in Media component`, () => {
        cy.visit(`${url}?redesign=true`)

        cy.getCy(`type-${type}`)
          .should('exist')
          .then(() => {
            // title
            cy.getCy('item-title').should('contain.text', title)

            // collection name
            cy.getCy('item-collection').should('contain.text', collection)

            // creator name
            cy.getCy('item-creator').should('exist')

            cy.get('body').then(($body) => {
              // owner
              if ($body.find('[data-cy="item-owner"]').length) {
                cy.getCy('item-owner')
                  .find('[data-cy="identity"]')
                  .should('exist')
              }
            })
          })
      })
    })
  }
)
