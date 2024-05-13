import { graphql } from '../../clients/graphqlClients'

export const nftFragment = graphql(`
  fragment nft on NFTEntity @_unmask {
    id
    metadata
    issuer
    currentOwner
    blockNumber
    burned
    updatedAt
  }
`)
