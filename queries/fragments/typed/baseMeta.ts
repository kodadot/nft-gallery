import { graphql } from '../../clients/graphqlClients'

export const baseMetaFragment = graphql(`
  fragment baseMeta on MetadataEntity @_unmask {
    id
    image
    animationUrl
    name
    description
  }
`)
