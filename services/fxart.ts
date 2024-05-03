import { $fetch, FetchError } from 'ofetch'
import type { DropItem } from '@/params/types'

const BASE_URL =
  window.location.host === 'kodadot.xyz'
    ? 'https://fxart.kodadot.workers.dev/'
    : 'https://fxart-beta.kodadot.workers.dev/'

export const DYNAMIC_METADATA = 'fxart-beta.kodadot.workers.dev/metadata/'

const api = $fetch.create({
  baseURL: BASE_URL,
})

export type DoResult = {
  sn: string
  collection: string
  chain: string
  txHash?: string
  timestamp?: string
  image?: string
  name: string
  metadata?: string
  nft?: string
}

export type GetDropsQuery = {
  limit?: number
  active?: boolean[]
  chain?: string[]
}

export type AllocatedNFT = {
  id: number
  name: string
  image: string
}

export type DropMintedStatus = {
  created_at: string
  id: number
  image: string
  metadata: string
  claimed: number
  email: string
  hash: string
}

export type AllocateCollectionRequest = {
  address: string
  email: string
  metadata?: string
  hash: string
  image?: string
}

type AllocateCollectionResponse = {
  result: AllocatedNFT
}

export const getDrops = async (query?: GetDropsQuery) => {
  return await api<DropItem[]>('drops', {
    method: 'GET',
    query,
  })
}

export const getDropById = (id: string) =>
  api<DropItem>(`/drops/${id}`, {
    method: 'GET',
  })

export const getDropMintedStatus = async (alias: string, accountId: string) => {
  return await api<DropMintedStatus>(`/drops/${alias}/accounts/${accountId}`, {
    method: 'GET',
  })
}

export const allocateCollection = async (
  body: AllocateCollectionRequest,
  id: string,
) => {
  try {
    const response = await api<AllocateCollectionResponse>(
      `/drops/allocate/${id}`,
      {
        method: 'POST',
        body,
      },
    )

    return response
  } catch (error) {
    throw new Error(`[FXART::ALLOCATE] ERROR: ${(error as FetchError).data}`)
  }
}

export const allocateClaim = async (body, id) => {
  try {
    const response = await api<{ result: DoResult }>(`/drops/do/${id}`, {
      method: 'post',
      body,
    })

    return response
  } catch (error) {
    throw new Error(
      `[FXART::ALLOCATE::CLAIM] ERROR: ${(error as FetchError).data}`,
    )
  }
}

export const setMetadataUrl = ({ chain, collection, hash }) => {
  const metadataUrl = new URL(
    'https://fxart-beta.kodadot.workers.dev/metadata/v2/json',
  )
  metadataUrl.searchParams.set('chain', chain)
  metadataUrl.searchParams.set('collection', collection)
  metadataUrl.searchParams.set('hash', hash)

  return metadataUrl.toString()
}

export const updateMetadata = async ({ chain, collection, nft, sn, hash }) => {
  try {
    const response = await api<DoResult>('/metadata/v2/update', {
      method: 'post',
      body: {
        chain,
        collection,
        nft,
        sn,
        hash,
      },
    })

    return response
  } catch (error) {
    throw new Error(
      `[FXART::UPDATE_METADATA] ERROR: ${(error as FetchError).data}`,
    )
  }
}

export type DropCalendar = {
  id: number
  name: string
  description: string
  twitter_handle: string
  date: string | null
  time: string | null
  address: string | null
  content: string | null
  supply: number | null
  royalty: number | null
  price: string | null
  holder_of: string | null
  location: string | null
  items: CalendarItem[]
}

export type CalendarItem = {
  image: string
}

export const getDropCalendar = async () => {
  return await api<DropCalendar[]>('/calendars', {
    method: 'GET',
  })
}
