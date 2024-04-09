import { $fetch, FetchError } from 'ofetch'
import type { DropItem } from '@/params/types'

const BASE_URL =
  window.location.host === 'kodadot.xyz'
    ? 'https://fxart.kodadot.workers.dev/'
    : 'https://fxart-beta.kodadot.workers.dev/'

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

export type MintItem = {
  hash: string
  image: string
  metadata: string
}

export type AllocatedNFT = {
  id: number
  name: string
  image: string
}

type BatchAllocateResponse = {
  result: AllocatedNFT[]
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

export type BatchMintBody = {
  email: string
  address: string
  items: MintItem[]
}

type AllocateCollectionResponse = {
  result: AllocatedNFT
}

function isAllocateCollectionRequest(
  body: AllocateCollectionRequest | BatchMintBody,
): body is AllocateCollectionRequest {
  return 'hash' in body && !('items' in body)
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

export function allocateCollection(
  body: AllocateCollectionRequest,
  id: string,
): Promise<AllocateCollectionResponse>
export function allocateCollection(
  body: BatchMintBody,
  id: string,
): Promise<BatchAllocateResponse>

export async function allocateCollection(
  body: AllocateCollectionRequest | BatchMintBody,
  id: string,
) {
  const endpoint = isAllocateCollectionRequest(body)
    ? `/drops/allocate/${id}`
    : `/drops/allocate/${id}/batch`

  try {
    return isAllocateCollectionRequest(body)
      ? api<AllocateCollectionResponse>(endpoint, {
          method: 'POST',
          body,
        })
      : api<BatchAllocateResponse>(endpoint, {
          method: 'POST',
          body,
        })
  } catch (error) {
    const prefix = isAllocateCollectionRequest(body)
      ? '[FXART::ALLOCATE]'
      : '[FXART::BATCH_ALLOCATE]'
    throw new Error(`${prefix} ERROR: ${(error as FetchError).data}`)
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

export const updateMetadata = async ({ chain, collection, nft, metadata }) => {
  try {
    const response = await api<DoResult>('/metadata/v1/update', {
      method: 'post',
      body: {
        chain,
        collection,
        nft,
        metadata,
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
