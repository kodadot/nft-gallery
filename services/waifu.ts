import { $fetch, FetchError } from 'ofetch'
import type { DropItem } from '@/params/types'
const WAIFU_BASE_URL = 'https://waifu-me.kodadot.workers.dev'

const api = $fetch.create({
  baseURL: WAIFU_BASE_URL,
})

// type ClaimResponse = Response<any>
type Response<T> = {
  result: T
}

export const getDrops = async () => {
  return await api<DropItem[]>('drops', {
    method: 'GET',
  })
}

export const getDropById = async (id: string) => {
  return await api<DropItem>(`/drops/${id}`, {
    method: 'GET',
  })
}

export const getDropStatus = async (alias: string) => {
  return await api<{ count: number }>(`/drops/${alias}/status`, {
    method: 'GET',
  })
}

export type DropMintedStatus = {
  created_at: string
  id: number
  image: string
  metadata: string
}
export const getDropMintedStatus = async (alias: string, accountId: string) => {
  return await api<DropMintedStatus>(`/drops/${alias}/accounts/${accountId}`, {
    method: 'GET',
  })
}

export const getLatestWaifuImages = async () => {
  const value = await api<{
    result: { id: string; output: string; image: string }[]
  }>('latest', {
    method: 'GET',
  }).catch((error: FetchError) => {
    throw new Error(
      `[WAIFU::IMAGE] Unable to fetch image for reasons ${error.data}`,
    )
  })

  return value
}

type DoRequest = {
  address: string
  metadata: string
  image: string
  email?: string
}

type DoSubmitDropRequest = {
  sn: string
  hash: string
  account: string
  email?: string
}

export type DoResult = {
  sn: string
  collection: string
  chain: string
  txHash?: string
  timestamp?: string
  image?: string
  name: string
}

type DoResponse = {
  result: DoResult
}

export const doWaifu = async (body: DoRequest, campaign: string) => {
  const value = await api<DoResponse>(`do/${campaign}`, {
    method: 'POST',
    body,
  }).catch((error: FetchError) => {
    throw new Error(`[WAIFU::DO] Unable to CAMPAIGN for reasons ${error.data}`)
  })

  return value
}

export const doSubmitDrop = async (
  body: DoSubmitDropRequest,
  campaign: string,
) => {
  const value = await api<DoResponse>(`do/${campaign}`, {
    method: 'PUT',
    body,
  }).catch((error: FetchError) => {
    throw new Error(`[DROP::DO] Unable to CAMPAIGN for reasons ${error.data}`)
  })

  return value
}

type UpdateMetadataRequest = {
  sn: string
  metadata: string
  account?: string
}

export const claimDropItem = async (
  body: UpdateMetadataRequest,
  claim: string,
) => {
  const value = await api<Response<typeof body>>(`claim/${claim}`, {
    method: 'POST',
    body,
  }).catch((error: FetchError) => {
    throw new Error(
      `[WAIFU::UPDATEMETADATA] Unable to CLAIM for reasons ${error.data}`,
    )
  })

  return value
}

export default api
