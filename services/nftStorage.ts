import { $fetch, FetchError } from 'ohmyfetch'
import { URLS } from '../utils/constants'
import consola from 'consola'
import { Metadata } from '@kodadot1/minimark'

const BASE_URL = URLS.koda.nftStorage

const nftStorageApi = $fetch.create({
  baseURL: BASE_URL,
})

export type PinningKey = {
  expiry: string
  token: string
}

type StorageApiResponse = {
  ok: boolean
  value: {
    cid: string
    size: number
    type: string
    created: Date
  }
}

export const pinJson = async (object: Metadata, name: string) => {
  const { value } = await nftStorageApi<StorageApiResponse>(`pinJson/${name}`, {
    method: 'POST',
    body: object,
  }).catch((error: FetchError) => {
    throw new Error(
      `[NFT::STORAGE] Unable to PIN JSON for reasons ${error.data}`
    )
  })
  consola.log('[NFT::STORAGE] Pin Json')
  return value.cid
}

export const getKey = async (address: string): Promise<PinningKey> => {
  const { expiry, token } = await nftStorageApi<PinningKey>(
    `getKey/${address}`
  ).catch((error: FetchError) => {
    throw new Error(
      `[NFT::STORAGE] Unable to GET KEY for reasons ${error.data}`
    )
  })
  return { expiry, token }
}

export const pinFileToIPFS = async (file: Blob, _: string): Promise<string> => {
  const { value } = await nftStorageApi<StorageApiResponse>('/pinFile', {
    method: 'POST',
    body: file,
    headers: {
      'Content-Type': file.type || '*/*',
    },
  }).catch((error: FetchError) => {
    throw new Error(
      `[NFT::STORAGE] Unable to PIN File for reasons ${error.data}`
    )
  })
  consola.log('[NFT::STORAGE] Pin File')
  return value.cid
}

export default nftStorageApi
