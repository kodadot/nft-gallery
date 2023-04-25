import defineApolloConfig, {
  toApolloEndpoint,
} from './config/defineApolloConfig'

export const denyList = [
  'DQcegDuBQG6V99hgRd87UJ8anZxTcumJEVBAnAGomXCJ3dc', // RMRK Minter -> Kanaria
  'Gskn3eRyr3tDiKxhzU1MPG4ha8RFTBG9ft3C6Rrn3kGJMXn', // No One, art thief
  'Go6QNymw2HicMi64uiQSPyiXy68wM7dvujwR8bDJ13exPTM', // 18+ manga porn
  'DinoPQrFS2u4NgEk18v6W5QH1SBmHKYUPJGjZUV4JLPj2rd', // Guardians DINO
  'EfPxwVvLpSV4VG5sNZUacTE3UJgcgBHtuWuHxuJkPmmkwTe', // Malicious activity
  'H1scXqBBis6xobc9tSWjqAiHAe8X71xcgkbau8xgWm2xc2a', // AI NSFW
]

export const statemineDenyList = [
  'EZwaNLfEwAMYcEdbp7uKYFCjnsn43S85pm6BumT5UwvZQvB', // SubstraTee minter, broken IPFS
  'Eipd9P7j9XC7voYxYgAoyE6wwt8BmpLDNC89RAU2cf6Qtrk', // No metadata
]

export const bsxDenyList = [
  'bXjMVEdCzhjYbPc5rJk7NvPSDRiiNuCT3GdqohFp3wdpzJL6Z', // Beeple, copycat
]

export const IPFS_KODADOT_IMAGE_PLACEHOLDER =
  'bafkreifahjdjerrz65puqznmsu2acoktrxjbo3vvp2f2j4eb7h5tc345fi'

export const MIN_CAROUSEL_NFT = 3

export const PER_PAGE = 20

export const SHOW_SCROLL_TOP_BUTTON_HEIGHT = 350

export const DETAIL_TIMEOUT = 3000

export const MAX_UPLOADED_FILE_SIZE = 30

export const URLS = {
  koda: {
    pinata: 'https://kodadot.mypinata.cloud/ipfs/',
    directUpload: 'https://direct-upload.kodadot.workers.dev/',
    estuary: 'https://pinning.kodadot.workers.dev/',
    nftStorage: 'https://nft-storage.kodadot.workers.dev/',
    netlify: 'https://beta.kodadot.xyz/.netlify/functions/',
    seoCard: 'https://og-image-green-seven.vercel.app/',
    rubick: 'https://squid.subsquid.io/rubick/graphql',
    snek: 'https://squid.subsquid.io/snekk/v/005/graphql',
    snekRococo: 'https://squid.subsquid.io/snekk/v/004/graphql',
    click: 'https://squid.subsquid.io/click/v/002/graphql',
    antick: 'https://squid.subsquid.io/antick/v/001-rc0/graphql',
    rmrk: 'https://squid.subsquid.io/marck/graphql',
    replicate: 'https://replicate.kodadot.workers.dev/',
  },
  providers: {
    coingecko: 'https://api.coingecko.com/api/v3',
    ramp: 'https://ramp.network/buy/',
    cloudflare: 'https://cloudflare-ipfs.com/ipfs/',
    pinata: 'https://api.pinata.cloud/',
  },
}

export const apolloClientConfig = {
  ...defineApolloConfig(),
  subsquid: toApolloEndpoint(process.env.SUBSQUID_ENDPOINT || URLS.koda.rubick),
  bsx: toApolloEndpoint(URLS.koda.snek),
  movr: toApolloEndpoint(URLS.koda.click),
  snek: toApolloEndpoint(URLS.koda.snekRococo),
  glmr: toApolloEndpoint(URLS.koda.antick),
}

export const NFT_SQUID_SORT_CONDITION_LIST: string[] = [
  'blockNumber_DESC',
  'blockNumber_ASC',
  'updatedAt_DESC',
  'updatedAt_ASC',
  'price_ASC',
  'price_DESC',
  // 'sn_ASC',
]

export const NFT_SQUID_SORT_CONDITION_LIST_FOR_MOONRIVER: string[] = [
  'blockNumber_DESC',
  'blockNumber_ASC',
  'updatedAt_DESC',
  'updatedAt_ASC',
  'sn_ASC',
]

export const NFT_SQUID_SORT_COLLECTIONS: string[] = [
  'blockNumber_DESC',
  'blockNumber_ASC',
  'updatedAt_DESC',
  'updatedAt_ASC',
  'supply_DESC',
  'supply_ASC',
  'volume_DESC',
  'volume_ASC',
]

export const MIN_OFFER_PRICE = 0.01

export const EXTERNAL_LINK_WHITELIST = ['*.kodadot.xyz']
