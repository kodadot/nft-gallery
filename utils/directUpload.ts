import Axios from 'axios'
import { tr } from 'date-fns/locale'

export const BASE_URL = 'https://direct-upload.kodadot.workers.dev/'

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

export const getKey = async (address: string): Promise<DirectUploadResult> => {
  try {
    const { status, data } = await api.get<DirectUploadApiResponse>(
      `getKey/${address}`
    )
    console.log('[PINNING] Obtain', status)
    return data.result
  } catch (e) {
    console.warn(e)
    throw e
  }
}

export const upload = async (file: File, url: string): Promise<void> => {
  const formData = new FormData()
  formData.append('data', file)
  const { status } = await Axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data;',
    },
  })
  console.log('[DIRECT UPLOAD] OK?', status)
}

export const uploadDirect = async (
  file: File,
  address: string
): Promise<void> => {
  try {
    const token = await getKey(address)
    await upload(file, token.uploadURL)
  } catch (e) {
    console.warn(e)
  }
}

export default api
