import { $fetch, FetchError } from 'ofetch'
import type { DropItem } from '@/params/types'
import { Prefix } from '@kodadot1/static'
import { isProduction } from '@/utils/env'

const BASE_URL = isProduction
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
  collection?: string
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

export const setMetadataUrl = ({ chain, collection, sn }) => {
  const metadataUrl = new URL(
    'https://fxart-beta.kodadot.workers.dev/metadata/v2/json',
  )
  metadataUrl.searchParams.set('chain', chain)
  metadataUrl.searchParams.set('collection', collection)
  metadataUrl.searchParams.set('sn', sn.toString())

  return metadataUrl.toString()
}

export const updateMetadata = async ({ chain, collection, nft, sn }) => {
  try {
    const response = await api<DoResult>('/metadata/v2/update', {
      method: 'post',
      body: {
        chain,
        collection,
        nft,
        sn,
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
  alias: string | null
  chain: Prefix | null
  creator: string | null
}

export type CalendarItem = {
  image: string
}

type GetCalendarsQuery = {
  chain?: Prefix[]
}

export const getDropCalendar = async (query: GetCalendarsQuery = {}) => {
  return await api<DropCalendar[]>('/calendars', {
    method: 'GET',
    query: query,
  })
}
