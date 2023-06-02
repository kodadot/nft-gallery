import { $fetch, FetchError } from 'ohmyfetch'

const BASE_URL = 'https://waifu-me.kodadot.workers.dev'

const table = 'mints'
const campaign = 'corn'

const api = $fetch.create({
  baseURL: BASE_URL,
})

type MintResponse = any
type ClaimResponse = any

// URL should be sanitized ipfs://ipfs/Qm...
export const sendWaifu = async (
  email: string,
  url: string,
  image: string
): Promise<MintResponse> => {
  const body = {
    address: email,
    metadata: url,
    image,
    table,
  }
  const value = await api<typeof body>('mint', {
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
    table,
  }
  const value = await api<typeof body>('claim-me', {
    method: 'POST',
    body,
  }).catch((error: FetchError) => {
    throw new Error(`[WAIFU::CLAIM] Unable to CLAIM for reasons ${error.data}`)
  })

  return value
}
export const getLatestWaifuImages = async () => {
  const value = await api<{ result: { id: string; output: string }[] }>(
    'latest',
    {
      method: 'GET',
    }
  ).catch((error: FetchError) => {
    throw new Error(
      `[WAIFU::IMAGE] Unable to fetch image for reasons ${error.data}`
    )
  })

  return value
}

export const doWaifu = async (address: string, url: string, image: string) => {
  const body = {
    address,
    metadata: url,
    image,
  }
  const value = await api<typeof body>(`do/${campaign}`, {
    method: 'POST',
    body,
  }).catch((error: FetchError) => {
    throw new Error(`[WAIFU::DO] Unable to CAMPAIGN for reasons ${error.data}`)
  })

  return value
}

export default api
