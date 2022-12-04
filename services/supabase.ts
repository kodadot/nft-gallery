import { $fetch, FetchError } from 'ohmyfetch'
// import consola from 'consola'

const BASE_URL = 'https://mtwfjfuiknglhfozmotu.functions.supabase.co/'
const ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10d2ZqZnVpa25nbGhmb3ptb3R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjgyMDIwMTcsImV4cCI6MTk4Mzc3ODAxN30.XCLXzu-TCPLo5nHgOWMHzb5quWE8npMolw9IgESsliQ'

type Option<T> = T | null

const api = $fetch.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: 'Bearer ' + ANON_KEY,
  },
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

export const getWaifuById = async (id: string) => {
  const value = await api<WaifuResponse>('get-me', {
    method: 'GET',
    params: {
      id,
    },
  }).catch((error: FetchError) => {
    throw new Error(`[WAIFU::GET] Unable to GET for reasons ${error.data}`)
  })

  return value
}

export default api
