import { graphql } from '~/queries/clients/graphqlClients'

export default graphql(`
query collectionStatsById($id: String!) {
  stats: collectionEntityById(id: $id) {
    id
    max
    base: nfts(where: { burned_eq: false }) {
      id
      currentOwner
      issuer
    }
    listed: nfts(where: { price_gt: "0", burned_eq: false }) {
      id
      price
    }
    sales: nfts(where: { events_some: { interaction_eq: BUY } }) {
      id
      events(where: { interaction_eq: BUY }) {
        id,
        meta
      }
    }
  }
}
`)
