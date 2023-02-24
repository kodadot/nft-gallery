import { $fetch, FetchError } from 'ohmyfetch'

const BASE_URL = 'https://mtwfjfuiknglhfozmotu.functions.supabase.co/'
const ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10d2ZqZnVpa25nbGhmb3ptb3R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjgyMDIwMTcsImV4cCI6MTk4Mzc3ODAxN30.XCLXzu-TCPLo5nHgOWMHzb5quWE8npMolw9IgESsliQ'

const ref = 'valentine_mints'

const api = $fetch.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: 'Bearer ' + ANON_KEY,
  },
})

type MintResponse = any

// URL should be sanitized ipfs://ipfs/Qm...
export const sendWaifu = async (
  email: string,
  url: string,
  image: string
): Promise<MintResponse> => {
  const body = {
    email,
    metadata: url,
    image,
    ref,
  }
  const value = await api<typeof body>('mint-me', {
    method: 'POST',
    body,
  }).catch((error: FetchError) => {
    throw new Error(`[WAIFU::MINT] Unable to MINT for reasons ${error.data}`)
  })
  return value
}

export const claimWaifu = async (claimId: string, address: string) => {
  const body = {
    claimId,
    address,
    email: '',
    ref,
  }
  const value = await api<typeof body>('claim-me', {
    method: 'POST',
    body,
  }).catch((error: FetchError) => {
    throw new Error(`[WAIFU::CLAIM] Unable to CLAIM for reasons ${error.data}`)
  })

  return value
}

export default api
