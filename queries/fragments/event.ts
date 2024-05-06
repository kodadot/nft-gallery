import { graphqlAhp as graphql } from '../clients/graphqlClients'

export const eventFragment = graphql(`
  fragment event on Event {
    id
    blockNumber
    timestamp
    caller
    currentOwner
    meta
    interaction
  }
`)
