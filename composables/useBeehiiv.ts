import { $fetch, FetchError } from 'ofetch'
import { URLS } from '@/utils/constants'

const BASE_URL = URLS.providers.beehiiv

type SubscribeResponse = {
  id: string
  email: string
  status: string
}

const getApi = (token: string) =>
  $fetch.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  })

export default function () {
  const config = useRuntimeConfig()
  const PUBLICATION_ID = config.public.beehiivPublicationId

  const api = getApi(config.public.beehiivApiKey)

  const subscribe = async (email: string) => {
    const body = {
      email,
    }

    return api<SubscribeResponse>(
      `/publications/${PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        body,
      },
    ).catch((error: FetchError) => {
      throw new Error(
        `[BEEHIIV::POST] Unable to POST for reasons ${error.data}`,
      )
    })
  }

  return { subscribe }
}
