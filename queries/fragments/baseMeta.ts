import { graphqlAhp as graphql } from '../clients/graphqlClients'

export const baseMetaFragment = graphql(`
  fragment baseMeta on MetadataEntity {
    id
    image
    animationUrl
    name
    description
  }
`)
