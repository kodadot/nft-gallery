import { graphql } from '../../clients/graphqlClients'

export const nftSubsquidFragment = graphql(`
  fragment nftSubsquid on NFTEntity @_unmask {
    id
    metadata
    issuer
    currentOwner
    blockNumber
    burned
    updatedAt
  }
`)
