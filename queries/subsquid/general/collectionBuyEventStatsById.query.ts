import { graphql } from '@/queries/clients/graphqlClients'

export default graphql(`
  query collectionBuyEventStatsById($id: String!) {
    stats: collectionBuyEventStatsById(id: $id) {
      max
      count
    }
  }
`)
