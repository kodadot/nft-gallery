import { graphql } from '../../clients/graphqlClients'

export const collectionFragment = graphql(`
  fragment collection on CollectionEntity @_unmask {
    id
    metadata
    issuer
    currentOwner
    blockNumber
  }
`)
