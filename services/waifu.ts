import { $fetch, FetchError } from 'ofetch'
import type { DropItem } from '@/params/types'

const api = $fetch.create({
  baseURL: 'https://fxart.kodadot.workers.dev/',
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
  claimed: number
  email: string
  hash: string
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
  image?: string
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

export const allocateCollection = async (body, id) => {
  try {
    const response = await api(`/drops/allocate/${id}`, {
      method: 'POST',
      body,
    })

    return response
  } catch (error) {
    throw new Error(`[WAIFU::ALLOCATE] ERROR: ${(error as FetchError).data}`)
  }
}

export const allocateClaim = async (body, id) => {
  try {
    const response = await api(`/drops/do/${id}`, {
      method: 'post',
      body,
    })

    return response
  } catch (error) {
    throw new Error(
      `[WAIFU::ALLOCATE::CLAIM] ERROR: ${(error as FetchError).data}`,
    )
  }
}

export default api
