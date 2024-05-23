import { graphql } from '../../clients/graphqlClients'

export const nftDetailsFragment = graphql(`
  fragment nftDetails on NFTEntity @_unmask {
    name
    sn
    price
  }
`)
