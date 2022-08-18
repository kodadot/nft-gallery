const mediaType = [
  {
    url: '/rmrk/gallery/12451896-3892e43e923e5ad973-KAG-MUTAGEN_1500-0000000000000414',
    title: 'Mutagen - 1500',
    description: 'Mutagen is mined in a Laboratory',
    collection: 'Kusama Ape Game',
    creator: 'Kusama Ape Club',
    tag: 'img',
    tagRelated: 'img',
    type: 'image',
  },
  {
    url: '/rmrk/gallery/11078330-7cf9daa38281a57331-BSS-LB_SPACESHIP_356-0000000000000356',
    title: 'lb Spaceship #356',
    description: 'Class: "Zaphkiel" Cruiser',
    collection: 'Budget Spaceships',
    creator: 'cwh',
    tag: 'model-viewer',
    tagRelated: 'model-viewer',
    type: '3D model',
  },
  {
    url: '/rmrk/gallery/9684463-c8205518d881699b3e-%E2%9D%84%EF%B8%8F-01_FROM_SINGULARITY-0000000000000005',
    title: '01 fr.om - singularity',
    description: '',
    collection: 'glaciers mood',
    creator: 'fr.om',
    tag: 'audio',
    tagRelated: 'img',
    type: 'audio',
  },
  {
    url: '/rmrk/gallery/12049607-4466b2edfa4d261069-POLKAWEAR-YOROI_GIFT_CARD_15-0000000000000023',
    title: 'Yoroi gift card #15',
    description: '',
    collection: '[ polkawear ]',
    creator: 'mad4ox',
    tag: 'video',
    tagRelated: 'img',
    type: 'video',
  },
]

describe('render Media.vue component', () => {
  mediaType.forEach(
    ({
      url,
      title,
      description,
      collection,
      creator,
      tag,
      tagRelated,
      type,
    }) => {
      describe(`should render ${type}`, () => {
        beforeEach(() => {
          cy.visit(url)
          cy.waitForNetworkIdle('+(GET|HEAD)', '*', 3000)
        })

        it('should render item title', () => {
          cy.getCy('item-title').should('contain.text', title)
        })

        it('should render item collection name', () => {
          cy.getCy('item-collection').should('contain.text', collection)
        })

        it('should render item creator name', () => {
          cy.getCy('item-creator').should('contain.text', creator)
        })

        it('should check owner or description', () => {
          cy.get('body').then(($body) => {
            if ($body.find('[data-cy="item-owner"]').length) {
              cy.getCy('item-owner')
                .find('[data-cy="identity"]')
                .should('exist')
            }

            if ($body.find('[data-cy="item-description"]').length) {
              cy.getCy('item-description')
                .find('.description-wrapper')
                .should('contain.text', description)
            }
          })
        })

        it('should render item', () => {
          cy.getCy('item-media').find(tag).should('exist')
        })

        it('should render item in related carousel', () => {
          cy.getCy('carousel-related').find(tagRelated).should('exist')
        })

        it('should render item in collection list', () => {
          cy.getCy('item-collection').click()
          cy.waitForNetworkIdle('+(GET|HEAD)', '*', 1000)
          cy.getCy('0').find(tag).should('exist')
        })
      })
    }
  )
})
