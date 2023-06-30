import { $fetch, FetchError } from 'ohmyfetch'

const BASE_URL = 'https://waifu-me.kodadot.workers.dev'

const table = 'mints'
const campaign = 'corn'

const api = $fetch.create({
  baseURL: BASE_URL,
})

type MintResponse = Response<any>
type ClaimResponse = Response<any>
type Response<T> = {
  result: T
}

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
  const value = await api<Response<typeof body>>('mint', {
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
  const value = await api<{
    result: { id: string; output: string; image: string }[]
  }>('latest', {
    method: 'GET',
  }).catch((error: FetchError) => {
    throw new Error(
      `[WAIFU::IMAGE] Unable to fetch image for reasons ${error.data}`
    )
  })

  return value
}

type DoRequest = {
  address: string
  metadata: string
  image: string
}

type DoResponse = {
  result: {
    sn: string
    collection: string
  }
}
export const doWaifu = async (body: DoRequest, campaign: string) => {
  const value = await api<DoResponse>(`do/${campaign}`, {
    method: 'POST',
    body,
  }).catch((error: FetchError) => {
    throw new Error(`[WAIFU::DO] Unable to CAMPAIGN for reasons ${error.data}`)
  })

  return value
}

type UpdateMetadataRequest = {
  sn: string
  metadata: string
}

export const claimDropItem = async (
  body: UpdateMetadataRequest,
  claim: string
) => {
  const value = await api<Response<typeof body>>(`claim/${claim}`, {
    method: 'POST',
    body,
  }).catch((error: FetchError) => {
    throw new Error(
      `[WAIFU::UPDATEMETADATA] Unable to CLAIM for reasons ${error.data}`
    )
  })

  return value
}

export default api
