import { $fetch } from 'ofetch'
import consola from 'consola'

import { secondaryFileVisible } from '@/utils/mintUtils'

import { URLS } from './constants'

export const DIRECTUPLOAD_BASE_URL = URLS.koda.directUpload

const api = $fetch.create({
  baseURL: DIRECTUPLOAD_BASE_URL,
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
  validationKey: string,
): Promise<DirectUploadResult | undefined> => {
  try {
    const { _data, status } = await api.raw<DirectUploadApiResponse>(
      `getKey/${validationKey}`,
    )
    consola.log('[PINNING] Obtain', status)
    return _data?.result
  } catch (e) {
    consola.warn(e)
    throw e
  }
}

export const upload = async (
  file: File,
  url: string,
  id?: string,
): Promise<CdnUploadResponse | undefined> => {
  const formData = new FormData()
  formData.append('file', file)
  if (id) {
    formData.append('id', id)
  }

  //FormData support: https://github.com/unjs/ofetch/issues/37
  const { status, _data } = await $fetch.raw<CdnUploadResponse>(url, {
    method: 'POST',
    body: formData,
  })
  consola.log('[DIRECT UPLOAD] OK?', status)
  return _data
}

export const uploadDirect = async (
  file: File,
  ipfsHash: string,
): Promise<void> => {
  try {
    const token = await getKey(ipfsHash)
    if (token) {
      const res = await upload(file, token.uploadURL, ipfsHash)
      consola.log('[DIRECT UPLOAD] OK!', res?.result.filename)
    }
  } catch (e) {
    consola.warn('[DIRECT UPLOAD] ERR!', (e as Error).message)
  }
}

export const uploadDirectWhenMultiple = async (
  files: [File, undefined | null] | [File, File],
  ipfsHashes: [string, string] | [string, undefined | null],
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
