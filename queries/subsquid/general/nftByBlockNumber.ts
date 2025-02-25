import { graphql } from '~/queries/clients/graphqlClients'

export default graphql(
  `query nftByBlockNumber($limit: Int = 10, $blockNumber: BigInt) {
  nftEntities(
    limit: $limit
    where: { blockNumber_eq: $blockNumber }
    orderBy: sn_DESC
  ) {
    blockNumber
    id
    name
  }
}`,
)
