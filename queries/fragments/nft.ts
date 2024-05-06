import { graphqlAhp } from '../clients/graphqlClients'

export const nftFragment = graphqlAhp(`fragment nft on NFTEntity {
  id
  metadata
  issuer
  currentOwner
  blockNumber
  burned
}`)
