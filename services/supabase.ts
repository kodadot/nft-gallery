import { $fetch, FetchError } from 'ohmyfetch'
import { URLS } from '../utils/constants'
// import consola from 'consola'

const BASE_URL = 'http://localhost:54321/functions/v1/'

type Option<T> = T | null

const api = $fetch.create({
  baseURL: BASE_URL,
})

type MintResponse = any
type ClaimResponse = any

// URL should be sanitized ipfs://ipfs/Qm...
export const sendWaifu = async (
  mail: string,
  url: string
): Promise<MintResponse> => {
  const body = {
    mail,
    url,
  }
  const value = await api<MintResponse>('mint-me', {
    method: 'POST',
    body,
  }).catch((error: FetchError) => {
    throw new Error(`[SUPABASE::MINT] Unable to MINT for reasons ${error.data}`)
  })
  return value
}

export const claimWaifu = async (
  claimId: string,
  address: string
): Promise<ClaimResponse> => {
  const body = {
    claimId,
    address,
    mail: '',
  }
  const value = await api<MintResponse>('claim-me', {
    method: 'POST',
    body,
  }).catch((error: FetchError) => {
    throw new Error(`[SUPABASE::MINT] Unable to MINT for reasons ${error.data}`)
  })

  return value
}

export default api
