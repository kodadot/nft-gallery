import { graphql } from '~/queries/clients/graphqlClients'

export default graphql(`
query userStatsByAccount($account: String!) {
  firstMint: collectionEntities(
    limit: 1
    orderBy: createdAt_ASC
    where: { issuer_eq: $account }
  ) {
    id
    createdAt
  }
  created: nftEntitiesConnection(
    orderBy: blockNumber_DESC
    where: { issuer_eq: $account, burned_eq: false }
  ) {
    totalCount
  }
  collected: nftEntitiesConnection(
    orderBy: blockNumber_DESC
    where: {
      issuer_not_eq: $account
      currentOwner_eq: $account
      burned_eq: false
    }
  ) {
    totalCount
  }

  sold: nftEntitiesConnection(
    orderBy: blockNumber_DESC
    where: {
      issuer_eq: $account
      currentOwner_not_eq: $account
      burned_eq: false
    }
  ) {
    totalCount
  }
}
`)
