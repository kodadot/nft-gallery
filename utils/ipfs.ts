import { emptyObject } from '@/utils/empty'
import { CollectionMetadata } from '@/components/rmrk/types'
import api from '@/utils/fetch'
import { Collection, NFT, NFTMetadata } from '@/components/rmrk/service/scheme'
import consola from 'consola'
import {
  ArweaveProviders,
  CF_IMAGE_URL,
  ProviderKeyType,
  arweaveProviders,
  getIPFSProvider,
} from './config/ipfs'
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

export const isArweaveUrl = (url: string): boolean => {
  return ar.test(url)
}

export const sanitizeIpfsCid = (
  url: string,
  provider?: ProviderKeyType
): string => {
  return `${resolveProvider(provider)}ipfs/${url}`
}

export const isIpfsUrl = (url: string): boolean => {
  return /^ipfs:\/\//.test(url)
}

export const isIpfsCid = (url: string): boolean => {
  return /^[0-9a-zA-Z]{44,}$/.test(url)
}

export type SanitizerFunc = (url: string) => string

const resolveProvider = (key: ProviderKeyType = 'image'): string =>
  getIPFSProvider(key)
const resolveArProvider = (key: ArweaveProviders = 'arweave'): string =>
  arweaveProviders[key]

export type SomethingWithMeta = {
  metadata: string
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

  const ipfsRegexp = /^ipfs:\/\//
  if (ipfsRegexp.test(ipfsUrl)) {
    return ipfsUrl.replace('ipfs://', `${resolveProvider(provider)}ipfs/`)
  }

  return sanitizeArweaveUrl(ipfsUrl, provider as ArweaveProviders)
}
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

export const fetchNFTMetadata = (
  rmrk: NFT | SomethingWithMeta,
  sanitizer: SanitizerFunc = sanitizeIpfsUrl
): Promise<NFTMetadata> => fetchMetadata<NFTMetadata>(rmrk, sanitizer)

export const fetchCollectionMetadata = (
  rmrk: Collection | SomethingWithMeta
): Promise<CollectionMetadata> => fetchMetadata<CollectionMetadata>(rmrk)

export const preheatFileFromIPFS = (ipfsUrl: string) => {
  const url = sanitizeIpfsUrl(ipfsUrl, 'image')
  const hash = fastExtract(url)
  api
    .get(url)
    .then(() => consola.log(`[PREHEAT] ${hash}`))
    .catch((err) => consola.warn(`[PREHEAT] ${hash} ${err.message}`))
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

export const ipfsToCf = (ipfsUrl: string): string => {
  const cid = extractCid(ipfsUrl)
  return `${CF_IMAGE_URL}${cid}/public`
}
