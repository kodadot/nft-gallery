import type { Prefix } from '@kodadot1/static'
import { QueryClient } from '@tanstack/query-core'

const BASE_URL = isProduction ? 'https://oda.koda.art' : 'https://oda-beta.koda.art'
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

export const queryClient = new QueryClient()

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
