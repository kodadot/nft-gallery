// TODO: hacky, but works for now
import { getMany, setMany, update } from 'idb-keyval'

import { queryBatch } from '@/utils/cloudflare'
import { fetchMetadata, SomethingWithMeta, zip } from '~/components/rmrk/utils'
import { imageStore } from './idbStore'
import { fastExtract } from './ipfs'
import { emptyObject } from './empty'

type Option<T> = T | undefined
type MayString = Option<string>
type ZipResult = [string, string]
type P<T> = Promise<T>
type KeyValue = Record<string, string>

const DELIVERY_URL = 'https://imagedelivery.net/jk5b6spi_m_-9qC4VTnjpg/'


const urlOf = (ipfsHash: string) => DELIVERY_URL + ipfsHash + '/public'
const withUrlOf = ([key, value]: ZipResult) => [key, urlOf(value)]
const withValue = ([, value]: [string, MayString]): boolean => Boolean(value)

export const getCloudflareImageLinks = async (keys: string[]): P<KeyValue>  => {
  const values = Array.from(new Set(keys.map(fastExtract).filter(Boolean)))
  const fromCache = await getMany<string>(values, imageStore)
  const zipped = zip<string, MayString, ZipResult>(values, fromCache)
  const uncached = zipped.filter(([, value]) => !value).map(([key]) => key)
  console.log(uncached)
  const cached = zipped.filter(withValue) as ZipResult[]
  const deliveryLinks: KeyValue = await queryBatch(uncached).then(values => Object.entries(values).map(withUrlOf)).then(Object.fromEntries).catch(() => ({}))
  setMany(Object.entries(deliveryLinks), imageStore).catch(console.warn)

  return {
    ...deliveryLinks,
    ...Object.fromEntries(cached),
  }
}

export const cacheOrFetchMetadata = async<T>(fromCache: T | undefined, metadata: string): P<T> => {
  if (fromCache) {
    return fromCache
  }

  try {
    const meta = await fetchMetadata<T>({metadata})
    update(metadata, () => meta)
    return meta
  } catch (e) {
    console.warn('[ERR] unable to get metadata', e)
    return emptyObject<T>()
  }
}

export const processMetadata = async <T>(metadataList: string[], cb?: (meta: T, index: number) => void): P<void> => {
  const storedMetadata = await getMany<T>(metadataList)
  storedMetadata.forEach(async (m, i) => {
    const meta = await cacheOrFetchMetadata(m, metadataList[i])
    if (cb) {
      cb(meta, i)
    }
  })
}
