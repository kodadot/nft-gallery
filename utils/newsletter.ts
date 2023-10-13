import { $fetch } from 'ofetch'
import { URLS } from '@/utils/constants'
import consola from 'consola'

const NEWSLETTER_BASE_URL = URLS.koda.newsletter

const api = $fetch.create({
  baseURL: NEWSLETTER_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'omit',
})

async function subscribe(email: string) {
  const body = {
    email: email,
  }

  try {
    const data = await api('/subscribe', {
      method: 'POST',
      body: body,
    })

    return data
  } catch (e) {
    consola.log('[NEWSLETTER] Error', e)
    return []
  }
}

export default { subscribe }
