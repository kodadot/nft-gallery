import Axios from 'axios'
import { sanitizeIpfsUrl } from './components/rmrk/utils'

export const BASE_URL = 'https://ipfs.io/'

const api = Axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: false,
  })

  export const fetchMimeType = async (ipfsLink?: string): Promise<string | undefined> => {
    if (!ipfsLink) {
      return undefined
    }

    const assetUrl = sanitizeIpfsUrl(ipfsLink, 'pinata')

    try {
      const { headers } = await api.head(assetUrl);
      return headers['content-type'];
    } catch (e: any) {
      console.warn(`[MIME TYPE] Unable to access type of ${assetUrl}\n\nReason ${e.message}`)
      return undefined
    }
  }


export default api
