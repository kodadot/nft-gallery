import { graphql } from '~/queries/clients/graphqlClients'

export default graphql(
  `
query allEventsByProfile($id: String) {
  events(where: { caller_eq: $id, OR: { currentOwner_eq: $id } }) {
    meta
    interaction
    blockNumber
    timestamp
    currentOwner
    caller
    id
    nft {
      id
      sn
      name
      metadata
      collection {
        id
        name
      }

      meta {
        id
        image
        animationUrl
      }
    }
  }
}
`,
)
