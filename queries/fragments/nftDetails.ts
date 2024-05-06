import { graphqlAhp } from '../clients/graphqlClients'

export const nftDetailsFragment =
  graphqlAhp(`fragment nftDetails on NFTEntity  @_unmask{
  name
  sn
  price
}`)
