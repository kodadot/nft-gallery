import { emptyObject } from '@/utils/empty'
import { hexToString, isHex } from '@polkadot/util'
import {
  RMRK,
  RmrkMint,
  RmrkView,
  RmrkEvent,
  CollectionMetadata,
  MediaType
} from './types'
import api from '@/fetch'
import { RmrkType, RmrkWithMetaType, CollectionOrNFT, Interaction } from './service/scheme'
import { NFTMetadata, Collection, PackMetadata, NFT, NFTWithMeta } from './service/scheme'
import { before } from '@/utils/math'
import { justHash } from '@/utils/ipfs'

export const SQUARE = '::'
export const DEFAULT_IPFS_PROVIDER = 'https://ipfs.io/'

export type ProviderKeyType = IPFSProviders
export type ArweaveProviders = 'permafrost' | 'arweave'
export type IPFSProviders = 'pinata' | 'cloudflare' | 'ipfs' | 'dweb' | 'kodadot'
export type PriceDataType = [
  date: Date,
  value: number,
]



export const ipfsProviders: Record<IPFSProviders, string> = {
  pinata: 'https://kodadot.mypinata.cloud/',
  cloudflare: 'https://cloudflare-ipfs.com/',
  ipfs: DEFAULT_IPFS_PROVIDER,
  dweb: 'https://dweb.link/',
  kodadot: 'https://kodadot.mypinata.cloud/',
}

export const arweaveProviders: Record<ArweaveProviders, string> = {
  permafrost: process.env.VUE_APP_PERMAFROST_URL + '/meta/',
  arweave: process.env.VUE_APP_AR_URL+ '/' || 'https://arweave.net/',
}

export type SanitizerFunc = (url: string) => string



export const ipfsHashToUrl = (ipfsHash?: string, provider?: ProviderKeyType): string  => {
  if (justHash(ipfsHash)) {
    return `${resolveProvider(provider)}ipfs/${ipfsHash}`
  }

  return ipfsHash || ''
}

const resolveProvider = (key: ProviderKeyType = 'kodadot'): string => ipfsProviders[key]
const resolveArProvider = (key: ArweaveProviders = 'arweave'): string => arweaveProviders[key]

export const zip = <T1, T2, T3>(a: T1[], b: T2[], cb?: (el: (T1 | T2)[]) => T3): T3[] | (T1 | T2)[][] => {
  const res = a.map((k, i) => [k, b[i]])

  if (cb) {
    return res.map(cb)
  }

  return res
}

export const fetchPackMetadata = (
  rmrk: RmrkType
): Promise<PackMetadata> => fetchMetadata<PackMetadata>(rmrk)

export const fetchCollectionMetadata = (
  rmrk: Collection
): Promise<CollectionMetadata> => fetchMetadata<CollectionMetadata>(rmrk)

export const fetchNFTMetadata = (
  rmrk: NFT,
  sanitizer: SanitizerFunc = sanitizeIpfsUrl
): Promise<NFTMetadata> => fetchMetadata<NFTMetadata>(rmrk, sanitizer)

export const fetchMetadata = async <T>(
  rmrk: RmrkType | CollectionOrNFT,
  sanitizer: SanitizerFunc = sanitizeIpfsUrl
): Promise<T> => {
  try {
    if (!rmrk.metadata) {
      return emptyObject<T>()
    }

    const { status, data } = await api.get(sanitizer(rmrk.metadata))
    console.log('IPFS data', status, data)
    if (status < 400) {
      return data as T
    }
  } catch (e) {
    console.warn('IPFS Err', e)
  }

  return emptyObject<T>()
}

export const fetchRmrkMeta = async (
  rmrk: RMRK
): Promise<CollectionMetadata> => {
  try {
    if (!rmrk.view.metadata) {
      return emptyObject<CollectionMetadata>()
    }

    const { status, data } = await api.get(sanitizeIpfsUrl(rmrk.view.metadata))
    console.log('IPFS data', status, data)
    if (status < 400) {
      return data as CollectionMetadata
    }
  } catch (e) {
    console.warn('IPFS Err', e)
  }

  return emptyObject<CollectionMetadata>()
}

export const unSanitizeArweaveId = (url: string): string  => {
  return unSanitizeUrl(url, 'ar://')
}

const unSanitizeUrl = (url: string, prefix: string) => {
  return `${prefix}${url}`
}

const ar = /^ar:\/\//

export const sanitizeArweaveUrl = (url: string, provider?: ArweaveProviders): string  => {
  if (ar.test(url)) {
    return url.replace(ar, resolveArProvider(provider))
  }

  return url
}

export const isIpfsUrl = (url: string): boolean  => {
  return /^ipfs:\/\//.test(url)
}


export const getSanitizer = (url: string, ipfsProvider?: ProviderKeyType, arProvider?: ArweaveProviders): SanitizerFunc => {
  if (isIpfsUrl(url)) {
    return link => sanitizeIpfsUrl(link, ipfsProvider)
  }

  return link => sanitizeArweaveUrl(link, arProvider)
}

export const sanitizeIpfsUrl = (ipfsUrl: string, provider?: ProviderKeyType): string  => {
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

export function sanitizeImage<T extends RmrkWithMetaType>(instance: T, provider?: ProviderKeyType): T {
  return {
    ...instance,
    image: sanitizeIpfsUrl(instance.image || '', provider)
  }
}

export function sanitizeObjectArray<T extends RmrkWithMetaType>(instances: T[], provider?: ProviderKeyType): T[] {
  return instances.map(i => sanitizeImage(i, provider))
}

export function mapPriceToNumber(instances: NFTWithMeta[], provider?: ProviderKeyType): any[] {
  return instances.map(i => ({...i, price: Number(i.price || 0)}))
}

export const decodeRmrkString = (rmrkString: string): RMRK => {
  const value = decode(
    isHex(rmrkString) ? hexToString(rmrkString) : rmrkString
  )

  return getRmrk(value)
}
// 'rmrk::MINTNFT::{"collection":"241B8516516F381A-OKSM","name":"Kusama Tetrahedron","transferable":1,"sn":"0000000000000002","metadata":"ipfs://ipfs/QmbT5DVZgoLP4PJRKWDRr85SowufraCgmvHehHKtkXqcEq"}';
export const getRmrk = (rmrkString: string): RMRK => {
  const action: RmrkEvent | null = getAction(rmrkString)

  if (!action) {
    console.warn('NO RMRK STRING', rmrkString)
    return emptyObject<RMRK>()
  }

  const rmrk: RMRK = emptyObject<RMRK>()
  rmrk.event = action

  const view = getView(rmrkString)

  if (!view) {
    console.warn('NO RMRK VIEW', rmrkString)
    return emptyObject<RMRK>()
  }

  rmrk.view = view

  return rmrk
}

export const getAction = (rmrkString: string): RmrkEvent | null => {
  if (RmrkEventRegex.MINT.test(rmrkString)) {
    return RmrkEvent.MINT
  }

  if (RmrkEventRegex.MINTNFT.test(rmrkString)) {
    return RmrkEvent.MINTNFT
  }

  return null
}

export const getView = (rmrkString: string): RmrkMint | RmrkView | null => {
  const value: RmrkMint | RmrkView | null = unwrap(rmrkString)
  return value
}

export const unwrap = (rmrkString: string): any | null => {
  const rr = /{.*}/
  const match = rmrkString.match(rr)

  if (!match) {
    return null
  }

  return JSON.parse(match[0])
}

class RmrkEventRegex {
  static MINTNFT = /^rmrk::MINTNFT::/
  static MINT = /^rmrk::MINT::/
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

  if (/^application\/octet-stream/.test(mimeType)) {
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

export const decode = (value: string): string  => decodeURIComponent(value)
export const sortByTimeStamp = (a: Interaction, b: Interaction) : number => b.timestamp < a.timestamp ? 1 : -1
export const sortByModification = (a: any, b: any) => b._mod - a._mod
export const nftSort = (a: any, b: any) => b.blockNumber - a.blockNumber
export const sortBy = (arr: any[], cb = nftSort) => arr.slice().sort(cb)
export const defaultSortBy = (arr: any[]) => sortBy(arr)

export const onlyEvents = (nft: NFT) : Interaction[] => nft.events
export const eventTimestamp = (e: { timestamp : string }) : string => e.timestamp
export const onlyPriceEvents = (e: { interaction: string }) : boolean => e.interaction !== 'MINTNFT'
export const eventsBeforeTime = (time: string) => (evts: Interaction[]) : Interaction[] => {
  const res = evts.filter(before(new Date(time)))
  return res.length && res[res.length - 1].interaction === 'LIST' ? [res[res.length - 1]] : []
}
export const collectionFloorPriceList = (priceEvents : Interaction[][], decimals: number) => (time : string) : PriceDataType => {
  const listEventsBeforeTime = priceEvents.map(eventsBeforeTime(time)).flat()
  const priceEvent = listEventsBeforeTime.map((e: Interaction) => Number(e.meta) / 10 ** decimals).filter((price: number) => price > 0)

  const floorPrice = priceEvent.length ? Math.min(...priceEvent) : 0
  return [new Date(time), floorPrice]
}
export const onlyBuyEvents = (nftEvents:Interaction[]) : Interaction[] => {
  const buyEvents : Interaction[] = []
  nftEvents?.forEach((e: Interaction, index: number) => {
    if (e.interaction === 'BUY' && index >= 1 && nftEvents[index - 1].interaction === 'LIST') {
      buyEvents.push({...e, meta: nftEvents[index - 1].meta})
    }
  })
  return buyEvents
}
export const soldNFTPrice = (decimals : number) => (e : Interaction) : PriceDataType => [new Date(e.timestamp), Number(e.meta) / 10 ** decimals]


export const isJsonGltf = (value: any): boolean => {
  try {
    if (!(value['asset'] && /^2\.[0-9]$/.test(value['asset']['version']))) {
      return false
    }

    if (!(value['buffers'] && /^data:application\/octet/.test(value['buffers'][0]['uri']))) {
      return false
    }

    return true
  } catch (e) {
    console.warn(`Unable to decide on isJsonGltf ${e}`)
    return false
  }
}

export const getRandomIntInRange = (min: number, max: number): number => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}