import { graphql } from '../clients/graphqlClients'

export const collectionDetailsFragment = graphql(`
  fragment collectionDetails on CollectionEntity @_unmask {
    name
    meta {
      image
    }
  }
`)
