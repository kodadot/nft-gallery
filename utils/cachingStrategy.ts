// TODO: hacky, but works for now
import { isEmpty } from '@kodadot1/minimark'
import { fetchMetadata, getSanitizer } from '@/utils/ipfs'
import { emptyObject } from './empty'
import { fastExtract } from './ipfs'

type P<T> = Promise<T>
type KeyValue = Record<string, string>

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

export const processSingleMetadata = async <T>(metadata: string): P<T> => {
  return cacheOrFetchMetadata<T>(undefined, metadata)
}

export const processMetadata = async <T>(
  metadataList: string[],
  cb?: (meta: T, index: number) => void
): P<void> => {
  const metadata = metadataList.map((meta) => meta || '')

  metadata.forEach(async (m, i) => {
    const meta = await cacheOrFetchMetadata(undefined, m)

    if (cb && meta !== undefined) {
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

export const flushIndexedDb = () => {
  if (window.indexedDB) {
    window.indexedDB.deleteDatabase('identity')
    window.indexedDB.deleteDatabase('image')
    window.indexedDB.deleteDatabase('keyval-store')
  }
}

export const clearSession = () => {
  try {
    window.sessionStorage.clear()
    window.localStorage.clear()
    flushIndexedDb()
  } catch (error) {
    console.error(error)
  } finally {
    window.location.reload()
  }
}
