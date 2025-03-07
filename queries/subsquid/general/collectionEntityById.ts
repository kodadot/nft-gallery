import { baseMetaFragment } from '@/queries/fragments/typed/baseMeta'
import { nftDetailsFragment } from '@/queries/fragments/typed/nftDetails'
import { subsquidNftFragment } from '@/queries/fragments/typed/subsquidNft'
import { graphql } from '@/queries/clients/graphqlClients'

export default graphql(`query collectionEntityById($id: String!, $nftId: String!, $limit: Int!) {
  collection: collectionEntityById(id: $id) {
    id
    name
    nfts(
      limit: $limit
      orderBy: [updatedAt_DESC]
      where: { burned_eq: false, id_not_eq: $nftId }
    ) {
      ...subsquidNft
      ...nftDetails
      collection {
        id
        name
      }
      meta {
        ...baseMeta
      }
    }
  }
}`,
[
  subsquidNftFragment,
  nftDetailsFragment,
  baseMetaFragment,
],
)
