import { graphql } from '../clients/subsquid-graphql'

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
