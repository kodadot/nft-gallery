import { graphql } from '../clients/graphqlClients'

export const subsquidNftFragment = graphql(`
  fragment subsquidNft on NFTEntity @_unmask {
    id
    metadata
    issuer
    currentOwner
    blockNumber
    burned
    collection {
      id
      name
    }
    meta {
      id
      name
      image
    }
  }
`)
