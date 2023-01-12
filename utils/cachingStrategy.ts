// TODO: hacky, but works for now
import { isEmpty } from '@kodadot1/minimark'
import { get, getMany, update } from 'idb-keyval'
import { fetchMetadata, getSanitizer } from '@/utils/ipfs'
import { emptyObject } from './empty'
import { imageStore } from './idbStore'
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
    const meta = await fetchMetadata<T>({ metadata })
    metadata && update(metadata, () => meta) // DEV: think how does it behave in
    return meta
  } catch (e) {
    console.warn('[ERR] unable to get metadata', e)
    return emptyObject<T>()
  }
}

export const getSingleCloudflareImage = async (
  metadata: string
): P<string | undefined> => {
  return get<string>(fastExtract(metadata), imageStore)
}

export const processSingleMetadata = async <T>(metadata: string): P<T> => {
  const meta = metadata ? await get(metadata) : undefined
  return cacheOrFetchMetadata(meta, metadata)
}

export const processMetadata = async <T>(
  metadataList: string[],
  cb?: (meta: T, index: number) => void
): P<void> => {
  const metadata = metadataList.map((meta) => meta || '')
  const storedMetadata = await getMany<T>(metadata)
  storedMetadata.forEach(async (m, i) => {
    const meta = await cacheOrFetchMetadata(m, metadata[i])
    if (cb) {
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
