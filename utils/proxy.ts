import Axios from 'axios'
import { NFT, NFTMetadata } from '@/components/rmrk/service/scheme'
import { APIKeys, pinFile as pinFileToIPFS } from '@/utils/pinata'
import { extractCid, justHash } from '@/utils/ipfs'

type CdnUpload = {
  id: string;
  uploadURL: string;
}

export const BASE_URL = `${window.location.origin}/.netlify/functions/`

const api = Axios.create({
  baseURL: BASE_URL
})

export const pinJson = async (object: any) => {
  try {
    const { status, data } = await api.post('pinJson', object)
    console.log('[PROXY] Pin JSON', status, data)
    if (status < 400) {
      return data.IpfsHash
    }
  } catch (e) {
    console.warn(e)
    throw e
  }
}

export const getKey = async (address: string) => {
  try {
    const { status, data } = await api.get('getKey', { params: { address }})
    console.log('[PROXY] Obtain', status)
    if (status < 400) {
      return data
    }
  } catch (e) {
    console.warn(e)
    throw e
  }
}

export const revokeKey = async (key: string) => {
  try {
    const { status, data } = await api.get('revokeKey', { params: { key }})
    console.log('[PROXY] Revoke', status)
    if (status < 400) {
      return data as APIKeys
    }
  } catch (e) {
    console.warn(e)
    throw e
  }

  throw new Error('Key not found')
}

export const getCdnUploadLink = async (): Promise<CdnUpload> => {
  try {
    const { status, data } = await api.get('cdnUpload')
    console.log('[PROXY] CDN OK', status, data)
    return data
  } catch (e) {
    console.warn(e)
    throw e
  }
}

export const pinFileDirect = async (file: Blob): Promise<string> => {
  try {
    const keys: APIKeys = await getKey(`${file.type}::${file.size}`)
    const cid = await pinFileToIPFS(file, keys)
    revokeKey(keys.pinata_api_key).then(console.log, console.warn)
    return cid
  } catch (e) {
    console.warn(e)
    throw e
  }
}

export const pinFile = async (file: Blob): Promise<string> => {
  const formData = new FormData()
  formData.append('data', file)

  try {
    const { status, data } = await api.post('pinFile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data;'
      }
    })
    console.log('[PROXY] Pin Image', status, data)
    if (status < 400) {
      return data.IpfsHash
    } else {
      throw new Error('Unable to PIN for reasons')
    }
  } catch (e) {
    console.warn(e)
    throw e
  }
}

export const uploadImageToCdn = async (file: Blob): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const UPLOAD_URL = await getCdnUploadLink().then(({ uploadURL }) => uploadURL)
    console.log('[PROXY] Upload to CDN', UPLOAD_URL)
    const { status, data } = await Axios.post(UPLOAD_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    console.log('[PROXY] CDN Image', status, data)
    return data
  } catch (e) {
    console.warn(e)
    throw e
  }
}

export const pinFileViaSlate = async (file: Blob): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  const SLATE_URL = 'https://uploads.slate.host/api/public'

  try {
    const { status, data } = await Axios.post(SLATE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Basic ${process.env.VUE_APP_SLATE_KEY}`
      }
    })
    console.log('[PROXY] SLATE Image', status, data)
    if (status < 400) {
      await api.post('pinHash', { hashToPin: data.data.cid })
      return data.data.cid
    } else {
      throw new Error('Unable to PIN for reasons')
    }
  } catch (e) {
    console.warn(e)
    throw e
  }
}


const PERMAFROST_URL = process.env.VUE_APP_PERMAFROST_URL
export const permaStore = async (nftMeta: NFTMetadata, file: Blob, collection: string): Promise<string> => {

  if (!PERMAFROST_URL) {
    throw new Error('No Permafrost URL set')
  }

  const formData = new FormData()
  formData.append('avatar', file)

  Object.entries(nftMeta).forEach(([key, value]) => {
    if (key === 'attributes') {
      formData.append('attributes', JSON.stringify(value))
    } else {
      formData.append(key, value)
    }

  })

  formData.append('collection', collection)

  try {
    const { status, data } = await Axios.post(PERMAFROST_URL + '/store', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    console.log('[PROXY] Permafrost', status, data)
    if (status < 400) {
      return data.arweaveId
    } else {
      throw new Error('Unable to store for reasons')
    }
  } catch (e) {
    console.warn(e)
    throw e
  }
}

export const unpin = async (ipfsLink: string) => {
  const hash = justHash(ipfsLink) ? ipfsLink : extractCid(ipfsLink)
  try {
    const { status, data } = await api.delete(`unpin/?hash=${hash}`)
    console.log('[PROXY] Unpin whatever', status, data)
    if (status < 400) {
      return data
    }
  } catch (e) {
    console.warn(e)
    throw e
  }
}

export default api
// QmYt2FydonvVMsEqe2q3hvm38WDq21xM8Z5ZSHZw19PwjF;
