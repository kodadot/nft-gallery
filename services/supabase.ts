import { $fetch, FetchError } from 'ohmyfetch'
import { URLS } from '../utils/constants'
// import consola from 'consola'

const BASE_URL = 'https://mtwfjfuiknglhfozmotu.functions.supabase.co/'

type Option<T> = T | null

const api = $fetch.create({
  baseURL: BASE_URL,
})

type WaifuResponse = {
  url: string
  sn: string
}

type PromptLogResponse = {
  data: {
    id: string
    created_at: string
    replicate_id: string
    prompt: Option<string>
  }[]
}

// URL should be sanitized ipfs://ipfs/Qm...
export const logPrediction = async (
  replicateId: string,
  prompt: string
): Promise<PromptLogResponse> => {
  const body = {
    replicateId,
    prompt,
  }
  const value = await api<PromptLogResponse>('prompt-me', {
    method: 'POST',
    body,
  }).catch((error: FetchError) => {
    throw new Error(
      `[SUPABASE::PROMPT] Unable to MINT for reasons ${error.data}`
    )
  })
  return value
}

export const getWaifuByMail = async (email: string) => {
  const value = await api<WaifuResponse>('get-me', {
    method: 'GET',
    params: {
      email,
    },
  }).catch((error: FetchError) => {
    throw new Error(`[WAIFU::GET] Unable to GET for reasons ${error.data}`)
  })

  return value
}

export default api
