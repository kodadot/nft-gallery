import { graphql } from '~/queries/clients/graphqlClients'
import { subsquidNftFragment } from '~/queries/fragments/typed/subsquidNft'
import { nftDetailsFragment } from '~/queries/fragments/typed/nftDetails'
import { collectionMetaFragment } from '~/queries/fragments/typed/collectionMeta'

export default graphql(`
query nftListSoldByCollection(
  $account: String!
  $collectionId: String!
  $limit: Int!
  $offset: Int
  $orderBy: NFTEntityOrderByInput = blockNumber_DESC
  $and: [NFTEntityWhereInput!]
) {
  nftEntities(
    where: {
      issuer_eq: $account
      collection: { id_eq: $collectionId },
      currentOwner_not_eq: $account
      burned_eq: false,
      AND: $and
    }
    orderBy: [$orderBy, blockNumber_DESC]
    limit: $limit
    offset: $offset
  ) {
    ...subsquidNft
    ...nftDetails
    ...collectionMeta
  }
}
`,
[
  subsquidNftFragment,
  nftDetailsFragment,
  collectionMetaFragment,
],
)
