import { $fetch, FetchError } from 'ofetch'
import consola from 'consola'
import { URLS } from '../utils/constants'

const BASE_URL = URLS.koda.keywise

const keywiseApi = $fetch.create({
  baseURL: BASE_URL,
})

export type KeyValue = {
  key: string
  url: string
}

// todo:
export const getValue = async (
  prefix: string,
  nftId: string
): Promise<string> => {
  if (!prefix || !nftId) {
    return ''
  }

  const { url } = await keywiseApi<KeyValue>(
    `resolve/${prefix}-${nftId}`
  ).catch((error: FetchError<{ message: string }>) => {
    consola.error(
      `[WORKER::KEYWISE] Unable to GET KEY for reasons ${error?.data?.message}`
    )
    return { url: '' }
  })
  return url
}

export default keywiseApi
