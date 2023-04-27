// TODO: hacky, but works for now
import { isEmpty } from '@kodadot1/minimark/utils'
import { fetchMetadata, getSanitizer } from '@/utils/ipfs'
import { emptyObject } from './empty'
import { fastExtract } from './ipfs'

type P<T> = Promise<T>
type KeyValue = Record<string, string>
const metadataCache = {}

export const cacheOrFetchMetadata = async <T>(
  fromCache: T | undefined,
  metadata: string
): P<T> => {
  if (fromCache && !isEmpty(fromCache)) {
    return fromCache
  }

  try {
    return await fetchMetadata<T>({ metadata })
  } catch (e) {
    console.warn('[ERR] unable to get metadata', e)
    return emptyObject<T>()
  }
}

export const processSingleMetadata = <T>(metadata: string): P<T> => {
  return cacheOrFetchMetadata<T>(metadataCache[metadata], metadata)
}

export const processMetadata = <T>(
  metadataList: string[],
  cb?: (meta: T, index: number) => void
): void => {
  const metadata = metadataList.map((meta) => meta || '')

  metadata.forEach(async (m, i) => {
    const meta = await cacheOrFetchMetadata(metadataCache[m], m)

    if (cb && meta !== undefined) {
      metadataCache[m] = meta
      cb(meta, i)
    }
  })
}

export const getProperImageLink =
  (imageLinks: KeyValue) =>
  (metadata: string, image: string): string => {
    return (
      imageLinks[fastExtract(metadata)] || getSanitizer(image, 'image')(image)
    )
  }

export const clearSession = () => {
  try {
    setTimeout(() => {
      window.sessionStorage.clear()
      window.localStorage.clear()
    }, 100)
  } catch (error) {
    console.error(error)
  } finally {
    setTimeout(() => {
      window.location.reload()
    }, 200)
  }
}
