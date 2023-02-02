const DEFAULT_IPFS_PROVIDER = 'https://ipfs.io/'
export const CF_IMAGE_URL = 'https://imagedelivery.net/jk5b6spi_m_-9qC4VTnjpg/'

export type ProviderKeyType = IPFSProviders
export type ArweaveProviders = 'permafrost' | 'arweave'
export type IPFSProviders =
  | 'pinata'
  | 'cloudflare'
  | 'ipfs'
  | 'dweb'
  | 'kodadot'
  | 'image'

const kodaImage =
  window.location.host === 'kodadot.xyz'
    ? 'https://image.w.kodadot.xyz/'
    : 'https://image-beta.w.kodadot.xyz/'

const ipfsProviders: Partial<Record<IPFSProviders, string>> = {
  pinata: 'https://kodadot.mypinata.cloud/',
  cloudflare: 'https://cloudflare-ipfs.com/',
  ipfs: DEFAULT_IPFS_PROVIDER,
  dweb: 'https://dweb.link/',
  image: kodaImage,
}
export const getIPFSProvider = (providerName: IPFSProviders): string => {
  return ipfsProviders[providerName] || (ipfsProviders['image'] as string)
}

export const arweaveProviders: Record<ArweaveProviders, string> = {
  permafrost: `${process.env.VUE_APP_PERMAFROST_URL}/meta/`,
  arweave: process.env.VUE_APP_AR_URL
    ? `${process.env.VUE_APP_AR_URL}/`
    : 'https://arweave.net/',
}
