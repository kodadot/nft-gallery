import Axios from 'axios'

export const BASE_URL = 'https://durable-jpeg.kodadot.workers.dev/'

const headers =  {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,POST',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Headers': '*'
}

const api = Axios.create({
  baseURL: BASE_URL,
  headers,
  withCredentials: false,
})

type BatchRequest = {
  keys: string[]
}

export const queryBatch = async (
  object: BatchRequest | string[]
): Promise<Record<string, string>> => {
  try {
    const arg: BatchRequest = Array.isArray(object) ? { keys: object } : object
    const { status, data } = await api.post('batch', arg, {
      headers,
    })
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
