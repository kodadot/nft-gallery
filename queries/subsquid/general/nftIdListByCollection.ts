import { graphql } from '@/queries/clients/graphqlClients'

export default graphql(`query nftIdListByCollection($id: String!, $search: [NFTEntityWhereInput!] = []) {
  nfts: nftEntities(where: {collection: {id_eq: $id}, burned_eq: false, AND: $search }) {
    id
  }
}`)
