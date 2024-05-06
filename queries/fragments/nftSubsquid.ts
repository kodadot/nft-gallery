import { graphqlAhp as graphql } from '../clients/graphqlClients'

export const nftSubsquidFragment = graphql(`
  fragment nftSubsquid on NFTEntity {
    id
    metadata
    issuer
    currentOwner
    blockNumber
    burned
    updatedAt
  }
`)
