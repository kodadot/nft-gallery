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

export const ksmHubDenyList = [
  'EZwaNLfEwAMYcEdbp7uKYFCjnsn43S85pm6BumT5UwvZQvB', // SubstraTee minter, broken IPFS
  'Eipd9P7j9XC7voYxYgAoyE6wwt8BmpLDNC89RAU2cf6Qtrk', // No metadata
]

export const dotHubDenyList = [
  '128qRiVjxU3TuT37tg7AX99zwqfPtj2t4nDKUv9Dvi5wzxuF', // RMRK test
  '155HWw3J9jyYphMm5is4vp9Bzj7ZRRd6HEzCPdWd8cq97KfT', // Very old unreacheable IPFS
  '16aWyT5Xa2wogTARQxk8LnQqi5nquy3Xrc4YcgJrmjEWrduq', // Market Manipulation
  '1HzwKkNGv4gdWq4ds1C5k63u8hvmjC6ULneAaZbwUBZEauF', // Dead collection
]

export const IPFS_KODADOT_IMAGE_PLACEHOLDER =
  'bafkreidchqftqyioy6q776xmtwj62wk3qdgrqlsdsl7gv27qkecgzfbe2i'

export const MIN_CAROUSEL_NFT = 3

export const PER_PAGE = 20

export const SHOW_SCROLL_TOP_BUTTON_HEIGHT = 350

export const DETAIL_TIMEOUT = 5000

export const MAX_UPLOADED_FILE_SIZE = 30

export const INFINITE_SCROLL_CONTAINER_ID = 'infinite-scroll-container'

export const INFINITE_SCROLL_ITEM_CLASS_NAME = 'infinite-scroll-item'

export const URLS = {
  koda: {
    pinata: 'https://kodadot.mypinata.cloud/ipfs/',
    directUpload: 'https://direct-upload.kodadot.workers.dev/',
    estuary: 'https://pinning.kodadot.workers.dev/',
    nftStorage: 'https://nft-storage.kodadot.workers.dev/',
    keywise: 'https://keywise.kodadot.workers.dev/',
    netlify: 'https://beta.kodadot.xyz/.netlify/functions/',
    seoCard: 'https://og-image-green-seven.vercel.app/',
    rubick: 'https://squid.subsquid.io/rubick/graphql',
    marck: 'https://squid.subsquid.io/marck/graphql',
    stick: 'https://ahk.gql.api.kodadot.xyz/',
    speck: 'https://ahp.gql.api.kodadot.xyz/',
    polkassembly: 'https://squid.subsquid.io/polkadot-polkassembly/graphql',
    gsPolkdot: 'https://squid.subsquid.io/gs-main-polkadot/graphql',
    gsKusama: 'https://squid.subsquid.io/gs-main-kusama/graphql',
    replicate: 'https://replicate.kodadot.workers.dev/',
    search: 'https://polysearch.w.kodadot.xyz',
    baseUrl: 'https://kodadot.xyz',
    newsletter: 'https://newsletter.w.kodadot.xyz',
    counter: 'https://counter.kodadot.workers.dev',
  },
  providers: {
    coingecko: 'https://api.coingecko.com/api/v3',
    kodaprice: 'https://price.kodadot.workers.dev/',
    ramp: 'https://ramp.network/buy/',
    cloudflare: 'https://cloudflare-ipfs.com/ipfs/',
    pinata: 'https://api.pinata.cloud/',
  },
}

export const apolloClientConfig = {
  ...defineApolloConfig(),
  subsquid: toApolloEndpoint(process.env.SUBSQUID_ENDPOINT || URLS.koda.rubick),
  rmrk2: toApolloEndpoint(URLS.koda.marck),
  ahk: toApolloEndpoint(URLS.koda.stick),
  ahp: toApolloEndpoint(URLS.koda.speck),
  polkassembly: toApolloEndpoint(URLS.koda.polkassembly),
  pid: toApolloEndpoint(URLS.koda.gsPolkdot),
  kid: toApolloEndpoint(URLS.koda.gsKusama),
}

export const NFT_SQUID_SORT_CONDITION_LIST: string[] = [
  'blockNumber_DESC',
  'blockNumber_ASC',
  'updatedAt_DESC',
  'updatedAt_ASC',
  'price_ASC',
  'price_DESC',
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
]

export const MIN_OFFER_PRICE = 0.01

export const EXTERNAL_LINK_WHITELIST = ['*.kodadot.xyz']
