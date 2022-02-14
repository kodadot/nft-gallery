// TODO: hacky, but works for now
import { queryBatch } from '@/utils/cloudflare'
import { get, getMany, setMany, update } from 'idb-keyval'
import { fetchMetadata, getSanitizer, zip } from '~/components/rmrk/utils'
import { emptyObject } from './empty'
import { imageStore } from './idbStore'
import { fastExtract } from './ipfs'

type Option<T> = T | undefined
type MayString = Option<string>
type ZipResult = [string, string]
type P<T> = Promise<T>
type KeyValue = Record<string, string>

const DELIVERY_URL = 'https://imagedelivery.net/jk5b6spi_m_-9qC4VTnjpg/'

const urlOf = (ipfsHash: string) => DELIVERY_URL + ipfsHash + '/public'
const withUrlOf = ([key, value]: ZipResult) => [key, urlOf(value)]
const withValue = ([, value]: [string, MayString]): boolean => Boolean(value)
const getUniqueLinks = (keys: string[]) =>
  Array.from(new Set(keys.map(fastExtract).filter(Boolean)))

export const getCloudflareImageLinks = async (keys: string[]): P<KeyValue> => {
  const values = getUniqueLinks(keys)
  const fromCache = await getMany<string>(values, imageStore)
  const zipped = zip<string, MayString, ZipResult>(values, fromCache)
  const uncached = zipped.filter(([, value]) => !value).map(([key]) => key)
  const cached = zipped.filter(withValue) as ZipResult[]
  const deliveryLinks: KeyValue = await queryBatch(uncached)
    .then((values) => Object.entries(values).map(withUrlOf))
    .then(Object.fromEntries)
    .catch(() => ({}))
  setMany(Object.entries(deliveryLinks), imageStore).catch(console.warn)

  return {
    ...deliveryLinks,
    ...Object.fromEntries(cached),
  }
}

export const cacheOrFetchMetadata = async <T>(
  fromCache: T | undefined,
  metadata: string
): P<T> => {
  if (fromCache) {
    return fromCache
  }

  try {
    const meta = await fetchMetadata<T>({ metadata })
    update(metadata, () => meta) // DEV: think how does it behave in
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
  const meta = await get(metadata)
  return cacheOrFetchMetadata(meta, metadata)
}

export const processMetadata = async <T>(
  metadataList: string[],
  cb?: (meta: T, index: number) => void
): P<void> => {
  const storedMetadata = await getMany<T>(metadataList)
  storedMetadata.forEach(async (m, i) => {
    const meta = await cacheOrFetchMetadata(m, metadataList[i])
    if (cb) {
      cb(meta, i)
    }
  })
}

export const getProperImageLink =
  (imageLinks: KeyValue) =>
  (metadata: string, image: string): string => {
    return imageLinks[fastExtract(metadata)] || getSanitizer(image)(image)
  }
