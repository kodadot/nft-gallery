import { graphql } from '@/queries/clients/graphqlClients'

export default graphql(`
  query collectionByAccount($account: String!) {
    collectionEntities(
      where: { currentOwner_eq: $account }
      orderBy: blockNumber_DESC
    ) {
      id
      name
      metadata
      nftCount
    }
  }
`)
