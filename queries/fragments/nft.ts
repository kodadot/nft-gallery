import { graphqlAhp } from '../clients/graphqlClients'

export const nftFragment = graphqlAhp(`fragment nft on NFTEntity @_unmask {
  id
  metadata
  issuer
  currentOwner
  blockNumber
  burned
}`)
