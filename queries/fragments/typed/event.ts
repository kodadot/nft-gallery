import { graphql } from '../../clients/graphqlClients'

export const eventFragment = graphql(`
  fragment event on Event @_unmask {
    id
    blockNumber
    timestamp
    caller
    currentOwner
    meta
    interaction
  }
`)
