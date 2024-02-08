import { $fetch, FetchError } from 'ofetch'
import type { DropItem } from '@/params/types'

const BASE_URL = 'http://0.0.0.0:8787'

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
}

export type GetDropsQuery = { limit?: number; active?: boolean[] }

export const getDrops = async (query?: GetDropsQuery) => {
  return await api<DropItem[]>('drops', {
    method: 'GET',
    query,
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
