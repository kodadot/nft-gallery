import type { Prefix } from '@kodadot1/static'

const api = $fetch.create({ baseURL: 'https://ogi.koda.art' })

export type EVMCollection = {
  metadata?: {
    name?: string
    image?: string
    description?: string
  }
  supply?: string | null
  claimed?: string | null
}

export const getEvmCollection = async (chain: Prefix, address: string) => {
  return await api<EVMCollection>(`/api/evm/${chain}/collection/${address}`, {
    method: 'GET',
  })
}
