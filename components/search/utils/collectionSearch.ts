import Axios from 'axios'
import { URLS } from '~/utils/constants'
import consola from 'consola'

const BASE_URL = URLS.koda.search

const api = Axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})
export async function fetchCollectionSuggestion(key: string, limit?: number) {
  const object = {
    search: key,
    table: 'collections',
    limit,
  }

  try {
    const res = await api.post('/search', object)
    if (res?.data && Array.isArray(res?.data)) {
      return res.data
    }
    return []
  } catch (e) {
    consola.log('fetchCollectionSuggestion Error', e)
    return []
  }
}
