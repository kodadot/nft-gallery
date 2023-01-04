import { emptyObject } from '@/utils/empty'
import { CollectionMetadata } from '@/components/rmrk/types'
import api from '@/utils/fetch'
import { Collection, NFT, NFTMetadata } from '@/components/rmrk/service/scheme'
import consola from 'consola'

export const ipfsUrlPrefix = 'ipfs://ipfs/'

export const fastExtract = (ipfsLink?: string): string => {
  if (!ipfsLink) {
    return ''
  }

  return ipfsLink.replace(ipfsUrlPrefix, '')
}

const cidRegex = /ipfs\/([a-zA-Z0-9]+)/
export const extractCid = (ipfsLink?: string): string => {
  if (!ipfsLink) {
    return ''
  }

  const match = cidRegex.exec(ipfsLink)
  if (!match) {
    const fastCid = fastExtract(ipfsLink)
    return fastCid
  }

  return match[1]
}

export const dummyIpfsCid = (): string => {
  return ipfsUrlPrefix + 'QmaCWgK91teVsQuwLDt56m2xaUfBCCJLeCsPeJyHEenoES'
}

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
