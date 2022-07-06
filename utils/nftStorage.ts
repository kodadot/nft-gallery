import Axios from 'axios'
import { URLS } from './constants'

export const BASE_URL = URLS.koda.nftStorage
const UPLOAD_URL = 'https://api.nft.storage/upload'

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
    console.log('[NFT::STORAGE] Pin JSON', status)
    if (status < 400) {
      return data.value.cid
    } else {
      throw new Error(
        `[NFT::STORAGE] Unable to PIN JSON for reasons ${status} ${data}`
      )
    }
  } catch (e) {
    console.warn(e)
    throw e
  }
}

export const getKey = async (address: string): Promise<PinningKey> => {
  try {
    const { status, data } = await api.get<PinningKey>(`getKey/${address}`)
    console.log('[NFT::STORAGE] Obtain', status)
    return data
  } catch (e) {
    console.warn(e)
    throw e
  }
}

export const pinFileToIPFS = async (
  file: File,
  token: string
): Promise<string> => {
  try {
    const { status, data } = await Axios.post<StorageApiResponse>(
      UPLOAD_URL,
      file,
      {
        headers: {
          'Content-Type': file.type ? `${file.type};` : '',
          Authorization: `Bearer ${token}`,
        },
      }
    )
    console.log('[NFT::STORAGE::DIRECT] Pin Image', status)
    if (status < 400) {
      return data.value.cid
    } else {
      throw new Error(
        `[NFT::STORAGE] Unable to PIN Image for reasons ${status} ${data}`
      )
    }
  } catch (e) {
    console.warn(e)
    throw e
  }
}

export default api
// QmYt2FydonvVMsEqe2q3hvm38WDq21xM8Z5ZSHZw19PwjF;
