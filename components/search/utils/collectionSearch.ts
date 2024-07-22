import { $fetch } from 'ofetch'
import consola from 'consola'
import { URLS } from '~/utils/constants'

const SEARCH_BASE_URL = URLS.koda.search

const api = $fetch.create({
  baseURL: SEARCH_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'omit',
})
export async function fetchCollectionSuggestion(key: string, limit?: number, chain?: string) {
  const object = {
    search: key,
    table: 'collections',
    limit,
    chain,
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
  }
  catch (e) {
    consola.log('fetchCollectionSuggestion Error', e)
    return []
  }
}
