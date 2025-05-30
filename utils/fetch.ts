import { $fetch } from 'ofetch'

export const IPFS_BASE_URL = 'https://ipfs.io/'

const api = $fetch.create({
  baseURL: IPFS_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'omit',
})

export const delay = ms => new Promise(res => setTimeout(res, ms))

export default api
