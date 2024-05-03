import { graphql } from '../clients/subsquid-graphql'

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
