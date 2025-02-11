import type { Prefix } from '@kodadot1/static'
import type { Abi } from '@/composables/transaction/types'

const BASE_URL = isProduction ? 'https://oda.koda.art' : 'https://5977602c-oda-beta.kodadot.workers.dev'
const api = $fetch.create({ baseURL: BASE_URL, retry: 3 })

type OnchainCollection = {
  metadata: {
    name: string
    image: string
    description: string
    generative_uri?: string
    banner?: string
  }
  supply: string
  claimed: string
}

export const fetchOdaCollection = (chain: Prefix, address: string) => {
  return api<OnchainCollection>(`/v1/${chain}/collection/${address}`)
}

type OdaCollectionOwners = {
  uniquerOwnersCount: number
  minted: number
  owners: Record<string, number>
}

export const fetchOdaCollectionOwners = (chain: Prefix, address: string) => {
  return api<OdaCollectionOwners>(`/v1/${chain}/collection/${address}/owners`)
}

export type NFTMetadata = {
  name: string
  description: string
  image: string
  animation_url: string
  attributes: Record<string, string>[]
}

type OdaToken = {
  metadata: NFTMetadata
  metadata_uri: string
}
export const fetchOdaToken = (chain: Prefix, address: string, tokenId: string) => {
  return api<OdaToken>(`/v1/${chain}/collection/${address}/token/${tokenId}`)
}

export const refreshOdaTokenMetadata = (chain: Prefix, address: string, tokenId: string) => {
  return api<OdaToken>(`/v1/${chain}/collection/${address}/token/${tokenId}`, {
    method: 'DELETE',
  })
}

export const refreshOdaCollectionTokensMetadata = (chain: Prefix, address: string) => {
  return api(`/v1/${chain}/collection/${address}/tokens`, {
    method: 'DELETE',
  })
}

type OdaMimeType = {
  mime_type: string
}

export const fetchMimeType = (uri: string) => {
  return api<OdaMimeType>(`/v1/mime-type/${uri}`)
}

export const fetchOdaCollectionAbi = (chain: Prefix, address: string) => {
  return api<Abi | null>(`/v1/${chain}/collection/${address}/abi`)
}
