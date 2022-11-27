import { $fetch, FetchError } from 'ohmyfetch'
import { URLS } from '../utils/constants'
// import consola from 'consola'

const BASE_URL = 'http://localhost:8888/.netlify/functions/'

type Option<T> = T | null

const api = $fetch.create({
  baseURL: BASE_URL,
})

type MintResponse = any
type ClaimResponse = any

// URL should be sanitized ipfs://ipfs/Qm...
export const sendWaifu = async (
  email: string,
  url: string,
  note: string
): Promise<MintResponse> => {
  const body = {
    email,
    url,
  }
  const value = await api<null>('mint-background', {
    method: 'POST',
    body,
  }).catch((error: FetchError) => {
    throw new Error(`[WAIFU::MINT] Unable to MINT for reasons ${error.data}`)
  })
  return value
}

export const claimWaifu = async (
  claimId: string,
  address: string
): Promise<null> => {
  const body = {
    claimId,
    address,
    email: '',
  }
  const value = await api<null>('claim-background', {
    method: 'POST',
    body,
  }).catch((error: FetchError) => {
    throw new Error(`[WAIFU::CLAIM] Unable to CLAIM for reasons ${error.data}`)
  })

  return value
}

export default api
