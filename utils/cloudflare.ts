import Axios from 'axios'
import { extractCid, justHash } from '@/utils/ipfs'

export const BASE_URL = 'https://durable-jpeg.kodadot.workers.dev/'


const api = Axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
})

type BatchRequest = {
  keys: string[];
}

export const queryBatch = async (object: BatchRequest) => {
  try {
    const { status, data } = await api.post('batch', object)
    console.log('[CLOUDFLARE] Batch', status, data)
    return data
  } catch (e) {
    console.warn(e)
    throw e
  }
}

export const saveKey = async (key: string, value: string): Promise<number> => {
  const { status, data } = await api.post('upload', { key, value })
  console.log('[CLOUDFLARE] Key saved', status, data)
  return status
}

export const querySingle = async (key: string) => {
  try {
    const { status, data } = await api.get('query', { params: { key } })
    console.log('[CLOUDFLARE] Query single', status, data)
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
