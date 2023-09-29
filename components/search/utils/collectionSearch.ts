import { $fetch } from 'ofetch'
import { URLS } from '~/utils/constants'
import consola from 'consola'

const SEARCH_BASE_URL = URLS.koda.search

const api = $fetch.create({
  baseURL: SEARCH_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'omit',
})
export async function fetchCollectionSuggestion(key: string, limit?: number) {
  const object = {
    search: key,
    table: 'collections',
    limit,
  }

  try {
    const data = await api('/search', {
      method: 'POST',
      body: object,
    })
    if (data && Array.isArray(data)) {
      return data
    }
    return []
  } catch (e) {
    consola.log('fetchCollectionSuggestion Error', e)
    return []
  }
}
