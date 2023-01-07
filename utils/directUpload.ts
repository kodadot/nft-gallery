import Axios from 'axios'
import { s } from 'vitest/dist/index-fde81ec3'
import { secondaryFileVisible } from '~~/components/rmrk/Create/mintUtils'

import { URLS } from './constants'

export const BASE_URL = URLS.koda.directUpload

const api = Axios.create({
  baseURL: BASE_URL,
})

export type DirectUploadResult = {
  id: string
  uploadURL: string
}

type DirectUploadApiResponse = {
  result: DirectUploadResult
  success: boolean
}

type CdnUploadResponse = {
  result: {
    id: string
    filename: string
    uploaded: string
    requireSignedURLs: boolean
    variants: string[]
  }
  success: boolean
}

export const getKey = async (
  validationKey: string
): Promise<DirectUploadResult> => {
  try {
    const { status, data } = await api.get<DirectUploadApiResponse>(
      `getKey/${validationKey}`
    )
    console.log('[PINNING] Obtain', status)
    return data.result
  } catch (e) {
    console.warn(e)
    throw e
  }
}

export const upload = async (
  file: File,
  url: string,
  id?: string
): Promise<CdnUploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  if (id) {
    formData.append('id', id)
  }
  const { status, data } = await Axios.post<CdnUploadResponse>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data;',
    },
  })
  console.log('[DIRECT UPLOAD] OK?', status)
  return data
}

export const uploadDirect = async (
  file: File,
  ipfsHash: string
): Promise<void> => {
  try {
    const token = await getKey(ipfsHash)
    const { result } = await upload(file, token.uploadURL, ipfsHash)
    console.log('[DIRECT UPLOAD] OK!', result.filename)
  } catch (e) {
    console.warn('[DIRECT UPLOAD] ERR!', (e as Error).message)
  }
}

export const uploadDirectWhenMultiple = async (
  files: [File, undefined | null] | [File, File],
  ipfsHashes: [string, string] | [string, undefined | null]
): Promise<void> => {
  const [file, secondFile] = files
  const [ipfsHash, secondIpfsHash] = ipfsHashes

  if (secondaryFileVisible(file) && secondFile && secondIpfsHash) {
    await uploadDirect(secondFile, secondIpfsHash)
  } else {
    await uploadDirect(file, ipfsHash)
  }
}

export const uploadImageToCdn = uploadDirect

export default api
