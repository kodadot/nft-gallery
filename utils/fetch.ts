import { $fetch } from 'ofetch'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { logError } from '@/utils/mappers'
import { getMimeType } from '@/utils/gallery/media'

export const BASE_URL = 'https://ipfs.io/'

const api = $fetch.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'omit',
})

export const fetchMimeType = async (
  ipfsLink?: string
): Promise<string | undefined> => {
  if (!ipfsLink) {
    return undefined
  }

  const assetUrl = sanitizeIpfsUrl(ipfsLink, 'image')

  try {
    return await getMimeType(assetUrl)
  } catch (e: any) {
    logError(e, (msg) => {
      console.warn(
        `[MIME TYPE] Unable to access type of ${assetUrl}\n\nReason ${msg}`
      )
    })
    return undefined
  }
}

export const delay = (ms) => new Promise((res) => setTimeout(res, ms))

export default api
