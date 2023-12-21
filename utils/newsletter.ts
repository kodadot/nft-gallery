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
    const data = await api<{ id: string }>('/subscribe', {
      method: 'POST',
      body: body,
    })

    return data
  } catch (e) {
    throw new Error('[NEWSLETTER] Unable to scubscibe user to newsletter' + e)
  }
}

type SubscriptionByEmailResponse = {
  id: string
  email: string
  status: 'pending' | 'active'
}

export async function getSubscription(subscriptionId: string) {
  try {
    const data = await api<SubscriptionByEmailResponse>(
      `/subscribe/${subscriptionId}`,
      {
        method: 'GET',
      },
    )

    return data
  } catch (e) {
    throw new Error('[NEWSLETTER] Unable to get subscription' + e)
  }
}

export async function resendConfirmationEmail(subscriptionId: string) {
  try {
    const data = await api<{ id: string }>('/subscribe/resend-confirmation', {
      method: 'PUT',
      body: { subscriptionId },
    })

    return data
  } catch (e) {
    throw new Error('[NEWSLETTER] Unable to resend confirmation email' + e)
  }
}

export default { subscribe, getSubscription }
