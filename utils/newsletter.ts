import { $fetch } from 'ofetch'
import { URLS } from '@/utils/constants'

const NEWSLETTER_BASE_URL = URLS.koda.newsletter

const api = $fetch.create({
  baseURL: NEWSLETTER_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'omit',
})

export async function subscribe(email: string) {
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
    throw new Error('[NEWSLETTER] Unable to scubscibe user to newsletter' + e)
  }
}

type SubscriptionByEmailResponse = {
  email: string
  status: 'pending' | 'active'
}

export async function getSubscription(email: string) {
  try {
    const data = await api<SubscriptionByEmailResponse>(`/subscribe/${email}`, {
      method: 'GET',
    })

    return data
  } catch (e) {
    throw new Error('[NEWSLETTER] Unable to get subscription' + e)
  }
}

export async function resendConfirmationEmail(email: string) {
  try {
    const data = await api('/subscribe/resend-confirmation', {
      method: 'PUT',
      body: { email },
    })

    return data
  } catch (e) {
    throw new Error('[NEWSLETTER] Unable to resend confirmation email' + e)
  }
}

export default { subscribe, getSubscription }
