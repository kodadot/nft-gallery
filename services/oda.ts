import type { Prefix } from '@kodadot1/static'
import { QueryClient } from '@tanstack/query-core'

const api = $fetch.create({ baseURL: 'https://oda-beta.kodadot.workers.dev', retry: 3 })

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
