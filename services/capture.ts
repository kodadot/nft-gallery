import { $fetch, FetchError } from 'ofetch'
const CAPTURE_BASE_URL = 'https://capture.kodadot.workers.dev'
const WEBGL_CAPTURE_BASE_URL = 'https://capturegl.vercel.app/api'

const api = $fetch.create({
  baseURL: CAPTURE_BASE_URL,
})

const vercel = $fetch.create({
  baseURL: WEBGL_CAPTURE_BASE_URL,
})

type Settings = {
  delay?: number
  webgl?: boolean
}

export const makeScreenshot = async (url: string, settings?: Settings) => {
  const finalApi = settings?.webgl ? vercel : api
  const value = await finalApi<any, 'blob'>('/screenshot', {
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
