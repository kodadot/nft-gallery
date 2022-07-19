import Axios from 'axios'
import { URLS } from './constants'
import consola from 'consola'

export const BASE_URL = URLS.koda.nftStorage

const api = Axios.create({
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

export const pinJson = async (object: Record<string, any>, name: string) => {
  try {
    const { status, data } = await api.post<StorageApiResponse>(
      `pinJson/${name}`,
      object
    )
    consola.log('[NFT::STORAGE] Pin JSON', status)
    if (status < 400) {
      return data.value.cid
    } else {
      throw new Error(
        `[NFT::STORAGE] Unable to PIN JSON for reasons ${status} ${data}`
      )
    }
  } catch (e) {
    consola.warn(e)
    throw e
  }
}

export const getKey = async (address: string): Promise<PinningKey> => {
  try {
    const { status, data } = await api.get<PinningKey>(`getKey/${address}`)
    consola.log('[NFT::STORAGE] Obtain', status)
    return data
  } catch (e) {
    consola.warn(e)
    throw e
  }
}

export const pinFileToIPFS = async (file: Blob, _: string): Promise<string> => {
  try {
    const { status, data } = await api.post<StorageApiResponse>(
      '/pinFile',
      file,
      {
        headers: {
          'Content-Type': file.type ? `${file.type}` : '*/*',
        },
      }
    )
    consola.log('[NFT::STORAGE] Pin File', status)
    if (status < 400) {
      return data.value.cid
    } else {
      throw new Error(
        `[NFT::STORAGE] Unable to PIN File for reasons ${status} ${data}`
      )
    }
  } catch (e) {
    consola.warn(e)
    throw e
  }
}

export default api
// QmYt2FydonvVMsEqe2q3hvm38WDq21xM8Z5ZSHZw19PwjF;
