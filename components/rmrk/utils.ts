import { emptyObject } from '@/utils/empty'
import { CollectionMetadata, MediaType, RMRK } from './types'
import api from '@/utils/fetch'
import { Interaction as EventInteraction } from './service/scheme'
import { Collection, NFT, NFTMetadata, NFTWithMeta } from './service/scheme'
import { before } from '@/utils/math'
import { Interaction } from '@kodadot1/minimark'
import consola from 'consola'
import { fastExtract } from '~/utils/ipfs'

export const DEFAULT_IPFS_PROVIDER = 'https://ipfs.io/'

export type ProviderKeyType = IPFSProviders
export type ArweaveProviders = 'permafrost' | 'arweave'
export type IPFSProviders =
  | 'pinata'
  | 'cloudflare'
  | 'ipfs'
  | 'dweb'
  | 'kodadot'
  | 'image'
export type PriceDataType = [date: Date, value: number]

export const ipfsProviders: Record<IPFSProviders, string> = {
  pinata: 'https://kodadot.mypinata.cloud/',
  cloudflare: 'https://cloudflare-ipfs.com/',
  ipfs: DEFAULT_IPFS_PROVIDER,
  dweb: 'https://dweb.link/',
  kodadot: 'https://image.w.kodadot.xyz/',
  image: 'https://image.w.kodadot.xyz/',
}

export const arweaveProviders: Record<ArweaveProviders, string> = {
  permafrost: process.env.VUE_APP_PERMAFROST_URL + '/meta/',
  arweave: process.env.VUE_APP_AR_URL + '/' || 'https://arweave.net/',
}

export type SanitizerFunc = (url: string) => string

const resolveProvider = (key: ProviderKeyType = 'kodadot'): string =>
  ipfsProviders[key]
const resolveArProvider = (key: ArweaveProviders = 'arweave'): string =>
  arweaveProviders[key]

export const zip = <T1, T2, T3>(
  a: T1[],
  b: T2[],
  cb?: (el: [T1, T2]) => T3
): T3[] | [T1, T2][] => {
  const res: [T1, T2][] = a.map((k, i) => [k, b[i]])

  if (cb) {
    return res.map(cb)
  }

  return res
}

export type SomethingWithMeta = {
  metadata: string
}

export const fetchCollectionMetadata = (
  rmrk: Collection | SomethingWithMeta
): Promise<CollectionMetadata> => fetchMetadata<CollectionMetadata>(rmrk)

export const fetchNFTMetadata = (
  rmrk: NFT | SomethingWithMeta,
  sanitizer: SanitizerFunc = sanitizeIpfsUrl
): Promise<NFTMetadata> => fetchMetadata<NFTMetadata>(rmrk, sanitizer)

export const fetchMetadata = async <T>(
  rmrk: SomethingWithMeta,
  sanitizer: SanitizerFunc = sanitizeIpfsUrl
): Promise<T> => {
  try {
    if (!rmrk.metadata) {
      return emptyObject<T>()
    }

    const { status, data } = await api.get(sanitizer(rmrk.metadata))
    if (status < 400) {
      return data as T
    }
  } catch (e) {
    console.warn('IPFS Err', e)
  }

  return emptyObject<T>()
}

export const preheatFileFromIPFS = (ipfsUrl: string) => {
  const url = sanitizeIpfsUrl(ipfsUrl, 'pinata')
  const hash = fastExtract(url)
  api
    .get(url)
    .then(() => consola.log(`[PREHEAT] ${hash}`))
    .catch((err) => consola.warn(`[PREHEAT] ${hash} ${err.message}`))
}

const ar = /^ar:\/\//

export const sanitizeArweaveUrl = (
  url: string,
  provider?: ArweaveProviders
): string => {
  if (ar.test(url)) {
    return url.replace(ar, resolveArProvider(provider))
  }

  return url
}

export const isIpfsUrl = (url: string): boolean => {
  return /^ipfs:\/\//.test(url)
}

export const isIpfsCid = (url: string): boolean => {
  return /^[0-9a-zA-Z]{44,}$/.test(url)
}

export const isArweaveUrl = (url: string): boolean => {
  return ar.test(url)
}

export const getSanitizer = (
  url: string,
  ipfsProvider?: ProviderKeyType,
  arProvider?: ArweaveProviders
): SanitizerFunc => {
  if (url && (isIpfsUrl(url) || url.includes('https://gateway.pinata.cloud'))) {
    return (link) => sanitizeIpfsUrl(link, ipfsProvider)
  }

  if (isArweaveUrl(url)) {
    return (link) => sanitizeArweaveUrl(link, arProvider)
  }

  if (isIpfsCid(url)) {
    return (link) => sanitizeIpfsCid(link, ipfsProvider)
  }

  return (link) => link
}

export const sanitizeIpfsCid = (
  url: string,
  provider?: ProviderKeyType
): string => {
  return `${resolveProvider(provider)}ipfs/${url}`
}

export const sanitizeIpfsUrl = (
  ipfsUrl: string,
  provider?: ProviderKeyType
): string => {
  if (ipfsUrl.includes('https://gateway.pinata.cloud')) {
    return ipfsUrl.replace(
      'https://gateway.pinata.cloud/',
      resolveProvider(provider)
    )
  }

  if (isIpfsCid(ipfsUrl)) {
    return sanitizeIpfsCid(ipfsUrl, provider)
  }

  const rr = /^ipfs:\/\/ipfs/
  if (rr.test(ipfsUrl)) {
    return ipfsUrl.replace('ipfs://', resolveProvider(provider))
  }

  const r = /^ipfs:\/\//
  if (r.test(ipfsUrl)) {
    return ipfsUrl.replace('ipfs://', `${resolveProvider(provider)}ipfs/`)
  }

  return sanitizeArweaveUrl(ipfsUrl, provider as ArweaveProviders)
}

export function mapPriceToNumber(instances: NFTWithMeta[]): any[] {
  return instances.map((i) => ({ ...i, price: Number(i.price || 0) }))
}

export const isEmpty = (rmrk: RMRK): boolean => {
  return !rmrk.event
}

export const equals = (first: RMRK, second: RMRK): boolean => {
  if (first.event !== second.event) {
    return false
  }

  return true
}

export const resolveMedia = (mimeType?: string): MediaType => {
  if (!mimeType) {
    return MediaType.UNKNOWN
  }

  if (/^application\/json/.test(mimeType)) {
    return MediaType.MODEL
  }

  if (/^text\/html/.test(mimeType)) {
    return MediaType.IFRAME
  }

  if (/^image\/svg\+xml/.test(mimeType)) {
    return MediaType.IMAGE
  }

  if (/^application\/pdf/.test(mimeType)) {
    return MediaType.OBJECT
  }

  const match = mimeType.match(/^[a-z]+/)

  if (!match) {
    return MediaType.UNKNOWN
  }

  const prefix = match[0].toUpperCase()

  let result = MediaType.UNKNOWN

  Object.entries(MediaType).forEach(([type, value]) => {
    if (type === prefix) {
      result = value
      return
    }
  })

  return result
}

export const onlyEvents = (nft: NFT): EventInteraction[] => nft.events
export const onlyPriceEvents = (e: { interaction: string }): boolean =>
  e.interaction !== 'MINTNFT'
export const eventsBeforeTime =
  (time: string) =>
  (evts: EventInteraction[]): EventInteraction[] => {
    const res = evts.filter(before(new Date(time)))
    return res.length && res[res.length - 1].interaction === 'LIST'
      ? [res[res.length - 1]]
      : []
  }
export const collectionFloorPriceList =
  (priceEvents: EventInteraction[][], decimals: number) =>
  (time: string): PriceDataType => {
    const listEventsBeforeTime = priceEvents.map(eventsBeforeTime(time)).flat()
    const priceEvent = listEventsBeforeTime
      .map((e: EventInteraction) => Number(e.meta) / 10 ** decimals)
      .filter((price: number) => price > 0)

    const floorPrice = priceEvent.length ? Math.min(...priceEvent) : 0
    return [new Date(time), floorPrice]
  }
export const onlyBuyEvents = (
  nftEvents: EventInteraction[]
): EventInteraction[] => {
  const buyEvents: EventInteraction[] = []
  nftEvents?.forEach((e: EventInteraction, index: number) => {
    if (
      e.interaction === Interaction.BUY &&
      index >= 1 &&
      nftEvents[index - 1].interaction === Interaction.LIST
    ) {
      buyEvents.push({ ...e, meta: nftEvents[index - 1].meta })
    }
  })
  return buyEvents
}

export const getRandomIntInRange = (min: number, max: number): number => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getNameOfNft = (nft: NFT): string => {
  return nft.name || `${nft.collection.name} - #${nft.sn}`
}
