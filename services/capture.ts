import { $fetch, FetchError } from 'ofetch'
const CAPTURE_BASE_URL = 'https://capture.kodadot.workers.dev'

const api = $fetch.create({
  baseURL: CAPTURE_BASE_URL,
})

type Settings = {
  delay?: number
}

export const makeScreenshot = async (url: string, settings?: Settings) => {
  const value = await api<any>('/screenshot', {
    method: 'POST',
    body: {
      url,
      settings,
    },
  }).catch((error: FetchError) => {
    throw new Error(`[Capture::makeScreenshot] failed ${error.message}`)
  })

  return value
}
