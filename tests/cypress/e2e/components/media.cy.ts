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
  {
    url: '/rmrk/gallery/9684463-c8205518d881699b3e-%E2%9D%84%EF%B8%8F-01_FROM_SINGULARITY-0000000000000005',
    title: '01 fr.om - singularity',
    description: '',
    collection: 'glaciers mood',
    creator: 'fr.om',
    tagRelated: 'img',
    type: 'audio',
  },
  {
    url: '/rmrk/gallery/12049607-4466b2edfa4d261069-POLKAWEAR-YOROI_GIFT_CARD_15-0000000000000023',
    title: 'Yoroi gift card #15',
    description: '',
    collection: '[ polkawear ]',
    creator: 'mad4ox',
    tagRelated: 'img',
    type: 'video',
  },
]

describe.skip('Media component', () => {
  mediaType.forEach(
    ({ url, title, description, collection, creator, tagRelated, type }) => {
      it(`should render ${type} in Media component`, () => {
        cy.visit(url)
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
                cy.getCy('item-description').should('contain.text', description)
              }
            })

            // same item in related carousel
            cy.getCy('carousel-related').find(tagRelated).should('exist')
          })
      })

      it(`should load ${type} in collection page`, () => {
        cy.visit(url)
        cy.getCy('carousel-related')
          .find(tagRelated)
          .first()
          .should('exist')
          .scrollIntoView()
        cy.getCy('item-collection').scrollIntoView().click()
        cy.location('pathname').should('include', '/collection/')
        cy.getCy('large-display').click().scrollIntoView()
        cy.waitForNetworkIdle('*', '*', 1000)
        cy.document().then((doc) => {
          const totalItems = doc.querySelectorAll(
            `#infinite-scroll-container ${tagRelated}`
          ).length
          expect(totalItems).to.be.greaterThan(0)
        })
      })
    }
  )
})
