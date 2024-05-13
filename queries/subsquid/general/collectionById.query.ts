import { graphql } from '@/queries/clients/graphqlClients'
import { baseMetaFragment } from '@/queries/fragments/typed/baseMeta'
import { collectionFragment } from '@/queries/fragments/typed/collection'
import { collectionDetailsFragment } from '@/queries/fragments/typed/collectionDetails'
import { subsquidNftFragment } from '@/queries/fragments/typed/subsquidNft'

const collectionById = graphql(
  `
    query collectionById(
      $id: String!
      $search: [NFTEntityWhereInput!]
      $orderBy: NFTEntityOrderByInput = blockNumber_DESC
      $first: Int
      $offset: Int
    ) {
      collectionEntity: collectionEntityById(id: $id) {
        ...collection
        ...collectionDetails
        createdAt
        meta {
          ...baseMeta
        }
        nfts(
          orderBy: [$orderBy, blockNumber_DESC]
          limit: $first
          offset: $offset
          where: { burned_eq: false, AND: $search }
        ) {
          id
          metadata
          name
          price
          burned
          currentOwner
          ...subsquidNft
        }
      }

      nftEntitiesConnection(
        orderBy: id_ASC
        where: { burned_eq: false, collection: { id_eq: $id }, AND: $search }
      ) {
        totalCount
      }
    }
  `,
  [
    baseMetaFragment,
    collectionFragment,
    collectionDetailsFragment,
    subsquidNftFragment,
  ],
)

export default collectionById
