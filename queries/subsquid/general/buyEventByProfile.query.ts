import { graphql } from '@/queries/clients/graphqlClients'

export default graphql(`
  query buyEventByProfile($id: String) {
    events(
      where: { caller_eq: $id, interaction_eq: BUY }
      orderBy: timestamp_DESC
    ) {
      timestamp
    }
  }
`)
