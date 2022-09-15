import { aliasQuery } from '~/tests/utils/graphql-test-utils'

const mediaType = [
  {
    url: '/rmrk/gallery/12451896-3892e43e923e5ad973-KAG-MUTAGEN_1500-0000000000000414',
    title: 'Mutagen - 1500',
    description: 'Mutagen is mined in a Laboratory',
    collection: 'Kusama Ape Game',
    creator: 'Kusama Ape Club',
    tagRelated: 'img',
    type: 'image',
  },
  // {
  //   url: '/rmrk/gallery/14024372-7CF9DAA38281A57331-APO-12-0000000000000012',
  //   title: '#12',
  //   description: '',
  //   collection: 'Reinvent apocalypse',
  //   creator: 'cwh',
  //   tagRelated: 'model-viewer',
  //   type: '3d',
  // },
  // {
  //   url: '/rmrk/gallery/12021366-f4f8d7504c60bb5721-VB7SA-MONEYBIRD24-0000000000000024',
  //   title: 'MoneyBird24',
  //   description: '',
  //   collection: 'Money Birds',
  //   creator: 'Ziga',
  //   tagRelated: 'model-viewer',
  //   type: '3d',
  // },
  // {
  //   url: '/rmrk/gallery/11644900-24454eab2eaf053317-DGFL-DIGI_FLOCK_05-0000000000000005',
  //   title: 'DIGI FLOCK 05',
  //   description:
  //     'The year is 2022 and DIGI FLOCKS are migrating to a cooler area.',
  //   collection: 'DIGI FLOCKS',
  //   creator: 'Pirate Sheep',
  //   tagRelated: 'model-viewer',
  //   type: '3d',
  // },
  // {
  //   url: '/rmrk/gallery/11537951-4601d5e16088294e51-EZWWT-GREEN_DREAM_TEST_02-0000000000000027',
  //   title: 'Green_dream_test_#02',
  //   description:
  //     'The year is 2022 and DIGI FLOCKS are migrating to a cooler area.',
  //   collection: '"Green Dream" Jewellery',
  //   creator: 'SavvaT',
  //   tagRelated: 'video',
  //   type: '3d',
  // },
  // {
  //   url: '/rmrk/gallery/11251582-9c994bd7abc151bc59-TBSV-TBOT_079_MOONRIVER_BOT-0000000000000023',
  //   title: 'T-Bot — 079** — Moonriver Bot',
  //   description: 'Addition to SE T-Bot - 079** from the T-Bots collection.',
  //   // eslint-disable-next-line quotes
  //   collection: "T-Bots' Secret Vault",
  //   creator: 'Puffer Bludz',
  //   tagRelated: 'img',
  //   type: '3d',
  // },
  {
    url: '/rmrk/gallery/11049994-e4c74212b3ed12d02b-INFINITY%20GEMS-GOLD_006-0000000000000094',
    title: 'GOLD #006',
    description: 'FIRST EDITION of INFINITY GEMS COLLECTION',
    collection: 'INFINITY GEMS COLLECTION',
    creator: 'SrSlayer',
    tagRelated: 'model-viewer',
    type: '3d',
  },
  // {
  //   url: '/bsx/gallery/2444376227-3',
  //   title: '3D Ball',
  //   description: 'Smash zone adverse',
  //   collection: 'Ping Pong Ball',
  //   creator: 'bXhWeV...2sDcbW',
  //   tagRelated: 'model-viewer',
  //   type: '3d',
  // },
  // {
  //   url: '/rmrk/gallery/9684463-c8205518d881699b3e-%E2%9D%84%EF%B8%8F-01_FROM_SINGULARITY-0000000000000005',
  //   title: '01 fr.om - singularity',
  //   description: '',
  //   collection: 'glaciers mood',
  //   creator: 'fr.om',
  //   tagRelated: 'img',
  //   type: 'audio',
  // },
  {
    url: '/rmrk/gallery/11711019-ce25731cee6b347a26-9D46T-VIDEO-0000000000000026',
    title: 'Video',
    description: '',
    collection: 'Test_Collection3',
    creator: 'HEcWMV...Zq5qBw',
    tagRelated: 'img',
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
    mediaType.forEach(
      ({ url, title, description, collection, creator, tagRelated, type }) => {
        it.skip(`should render ${type} in Media component`, () => {
          const isRmrk = url.startsWith('/rmrk')

          if (isRmrk) {
            cy.intercept('POST', '**/rubick/**/graphql', (req) => {
              // Queries
              aliasQuery(req, 'nftById')
              aliasQuery(req, 'collectionById')
            })
          } else {
            cy.intercept('POST', '**/snekk/**/graphql', (req) => {
              // Queries
              aliasQuery(req, 'nftById')
              aliasQuery(req, 'collectionById')
            })
          }

          cy.intercept('GET', '**/kodadot.mypinata.cloud/ipfs/**', {
            times: 5,
          }).as('fetchMedia')

          cy.visit(url)

          // wait for graphql request to be fetched
          cy.wait('@nftByIdQuery', { responseTimeout: 15000 })
            .its('response.statusCode')
            .should('match', /^(200|206)/)

          // wait for asset to be loaded from pinata
          cy.wait('@fetchMedia', { responseTimeout: 30000 })
            .its('response.statusCode')
            .should('match', /^(200|206)/)

          cy.getCy(`type-${type}`)
            .should('exist')
            .then(() => {
              // title
              cy.getCy('item-title').should('contain.text', title)

              // collection name
              cy.getCy('item-collection').should('contain.text', collection)

              // creator name
              cy.getCy('item-creator').should('contain.text', creator)

              cy.get('body').then(($body) => {
                // owner
                if ($body.find('[data-cy="item-owner"]').length) {
                  cy.getCy('item-owner')
                    .find('[data-cy="identity"]')
                    .should('exist')
                }

                // description
                if ($body.find('[data-cy="item-description"]').length) {
                  cy.getCy('item-description').should(
                    'contain.text',
                    description
                  )
                }
              })

              // same item in related carousel
              cy.getCy('carousel-related').find(tagRelated).should('exist')
            })
        })

        it.skip(`should load ${type} in collection page`, () => {
          const isRmrk = url.startsWith('/rmrk')

          if (isRmrk) {
            cy.intercept('POST', '**/rubick/**/graphql', (req) => {
              // Queries
              aliasQuery(req, 'nftById')
              aliasQuery(req, 'collectionById')
            })
          } else {
            cy.intercept('POST', '**/snekk/**/graphql', (req) => {
              // Queries
              aliasQuery(req, 'nftById')
              aliasQuery(req, 'collectionById')
            })
          }

          cy.intercept('GET', '**/kodadot.mypinata.cloud/ipfs/**', {
            times: 5,
          }).as('fetchMedia')

          cy.visit(url)

          // wait for graphql request to be fetched
          cy.wait('@nftByIdQuery', { responseTimeout: 15000 })
            .its('response.statusCode')
            .should('match', /^(200|206)/)

          // wait for asset to be loaded from pinata
          cy.wait('@fetchMedia', { responseTimeout: 30000 })
            .its('response.statusCode')
            .should('match', /^(200|206)/)

          cy.getCy('carousel-related')
            .find(tagRelated)
            .first()
            .should('exist')
            .scrollIntoView()
          cy.getCy('item-collection').scrollIntoView().click()

          // wait for graphql request to be fetched
          cy.wait('@collectionByIdQuery', { responseTimeout: 15000 })
            .its('response.statusCode')
            .should('match', /^(200|206)/)

          cy.location('pathname').should('include', '/collection/')
        })
      }
    )
  }
)
