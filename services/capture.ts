import { $fetch, FetchError } from 'ofetch'
const CAPTURE_BASE_URL = 'https://capture.kodadot.workers.dev'

const api = $fetch.create({
  baseURL: CAPTURE_BASE_URL,
})

export const makeScreenshot = async (url: string) => {
  const value = await api<any>('/screenshot', {
    method: 'POST',
    body: {
      url,
    },
  }).catch((error: FetchError) => {
    throw new Error(`[Capture::makeScreenshot] failed ${error.message}`)
  })

  return value
}
