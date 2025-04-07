import { graphql } from '@/queries/clients/graphqlClients'
import { subsquidNftFragment } from '@/queries/fragments/typed/subsquidNft'
import { nftDetailsFragment } from '@/queries/fragments/typed/nftDetails'
import { baseMetaFragment } from '@/queries/fragments/typed/baseMeta'

export default graphql(`query nftEntitiesByStrings($ids: [String!]!) {
  nftEntities(where: { id_in: $ids }) {
    ...subsquidNft
    ...nftDetails
    collection {
      id
      name
      floorPrice: nfts(
        where: { burned_eq: false, price_not_eq: "0" }
        orderBy: price_ASC
        limit: 1
      ) {
        price
      }
    }
    meta {
      ...baseMeta
    }
  }
}`,
[
  subsquidNftFragment,
  nftDetailsFragment,
  baseMetaFragment,
],
)
