import consola from 'consola'
import { IPFS_REGEX, isCID, isHTTP } from '@kodadot1/minipfs'
import type {
  ArweaveProviders,
  ProviderKeyType } from './config/ipfs'
import {
  CF_IMAGE_URL,
  arweaveProviders,
  getIPFSProvider,
  kodaImage,
} from './config/ipfs'
import { emptyObject } from '@/utils/empty'
import api from '@/utils/fetch'
import type { NFT, NFTMetadata } from '@/types'

export const ipfsUrlPrefix = 'ipfs://ipfs/'

export const fastExtract = (ipfsLink?: string): string => {
  if (!ipfsLink) {
    return ''
  }

  if (ipfsLink.includes(ipfsUrlPrefix)) {
    return ipfsLink.replace(ipfsUrlPrefix, '')
  }

  return ipfsLink.replace('ipfs://', '')
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
  provider?: ArweaveProviders,
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
  provider?: ProviderKeyType,
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

export const replaceIpfsGateway = (
  url: string,
  provider?: ProviderKeyType,
): string => {
  const gateway = resolveProvider(provider)
  const replaceGateway = new URL(gateway)
  const currentGateway = new URL(url)
  currentGateway.hostname = replaceGateway.hostname

  return currentGateway.toString()
}

export const assetExternalUrl = (url: string) => {
  const kodaUrl = new URL(`/type/endpoint/${url}`, kodaImage)

  return kodaUrl.href.toString()
}

export const sanitizeIpfsUrl = (
  ipfsUrl = '',
  provider?: ProviderKeyType,
): string => {
  if (!ipfsUrl) {
    return ''
  }

  if (ipfsUrl.includes(kodaImage) || ipfsUrl.includes('waveno.deno.dev')) {
    return ipfsUrl
  }

  const extract = fastExtract(ipfsUrl)

  if (isHTTP(extract) && extract.includes('/ipfs/')) {
    return replaceIpfsGateway(extract, provider)
  }

  if (isCID(extract) || IPFS_REGEX.test(ipfsUrl) || !isHTTP(extract)) {
    return sanitizeIpfsCid(extract, provider)
  }

  return assetExternalUrl(extract)
}

export const fetchMetadata = async <T>(
  rmrk: SomethingWithMeta,
  sanitizer: SanitizerFunc = sanitizeIpfsUrl,
): Promise<T> => {
  try {
    if (!rmrk.metadata) {
      return emptyObject<T>()
    }

    const { status, _data } = await api.raw(sanitizer(rmrk.metadata), {
      responseType: 'json',
    })
    if (status < 400) {
      return _data as T
    }
  }
  catch (e) {
    console.warn('IPFS Err', e)
    return emptyObject<T>()
  }

  return emptyObject<T>()
}

export const fetchNFTMetadata = (
  rmrk: NFT | SomethingWithMeta,
  sanitizer: SanitizerFunc = sanitizeIpfsUrl,
): Promise<NFTMetadata> => fetchMetadata<NFTMetadata>(rmrk, sanitizer)

export const preheatFileFromIPFS = (ipfsUrl: string) => {
  const url = sanitizeIpfsUrl(`${ipfsUrlPrefix}${ipfsUrl}`)

  // preheat to r2/cfi
  api(url, {
    redirect: 'manual', // no need to hit cf-images if the file exists
  })
    .then(async () => consola.log(`[PREHEAT] ${url}`))
    .catch(err => consola.error(`[PREHEAT] ${url} ${err.message}`))
}

export const getSanitizer = (
  url: string,
  ipfsProvider?: ProviderKeyType,
  arProvider?: ArweaveProviders,
): SanitizerFunc => {
  if (url && (isIpfsUrl(url) || url.includes('https://gateway.pinata.cloud'))) {
    return link => sanitizeIpfsUrl(link, ipfsProvider)
  }

  if (isArweaveUrl(url)) {
    return link => sanitizeArweaveUrl(link, arProvider)
  }

  if (isIpfsCid(url)) {
    return link => sanitizeIpfsCid(link, ipfsProvider)
  }

  return link => link
}

export const ipfsToCf = (ipfsUrl: string): string => {
  const cid = extractCid(ipfsUrl)
  return `${CF_IMAGE_URL}${cid}/public`
}

export const getHigherResolutionCloudflareImage = (url: string): string => {
  return url.replace(/\/public$/, '/detail')
}

export type EntityWithMeta = {
  metadata: string
  meta?: NFTMetadata
}

export function toCloudflareIpfsUrl(baseurl) {
  const url = new URL(baseurl)
  return `https://cloudflare-ipfs.com/${url.pathname}`
}

export function toOriginalContentUrl(baseurl: string) {
  const url = new URL(baseurl)
  url.searchParams.append('original', 'true')
  return url.toString()
}
