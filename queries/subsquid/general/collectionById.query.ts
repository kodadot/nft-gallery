import { graphql } from '@/queries/clients/graphqlClients'
import { baseMetaFragment } from '@/queries/fragments/baseMeta'
import { collectionFragment } from '@/queries/fragments/collection'
import { collectionDetailsFragment } from '@/queries/fragments/collectionDetails'
import { subsquidNftFragment } from '@/queries/fragments/subsquidNft'

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
