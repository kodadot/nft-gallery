import defineApolloConfig, {
  toApolloEndpoint,
} from './config/defineApolloConfig'

export const ksmHubDenyList = [
  'EZwaNLfEwAMYcEdbp7uKYFCjnsn43S85pm6BumT5UwvZQvB', // SubstraTee minter, broken IPFS
  'Eipd9P7j9XC7voYxYgAoyE6wwt8BmpLDNC89RAU2cf6Qtrk', // No metadata
]

export const dotHubDenyList = [
  '128qRiVjxU3TuT37tg7AX99zwqfPtj2t4nDKUv9Dvi5wzxuF', // RMRK test
  '155HWw3J9jyYphMm5is4vp9Bzj7ZRRd6HEzCPdWd8cq97KfT', // Very old unreacheable IPFS
  '16aWyT5Xa2wogTARQxk8LnQqi5nquy3Xrc4YcgJrmjEWrduq', // Market Manipulation
  '138vZ8cNLpiToq1seQvpxkgNyqbus3uRGSUArE8YgQNpVqeS', // Art breaker, misuse of edit fn
]

export const IPFS_KODADOT_IMAGE_PLACEHOLDER
  = 'bafkreidchqftqyioy6q776xmtwj62wk3qdgrqlsdsl7gv27qkecgzfbe2i'

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
    nftStorage: 'https://ipos.kodadot.workers.dev/',
    keywise: 'https://keywise.kodadot.workers.dev/',
    netlify: 'https://beta.kodadot.xyz/.netlify/functions/',
    seoCard: 'https://og-image-green-seven.vercel.app/',
    rubick: 'https://squid.subsquid.io/rubick/graphql',
    marck: 'https://ksm.gql.api.kodadot.xyz/',
    stick: 'https://ahk.gql.api.kodadot.xyz/',
    speck: 'https://ahp.gql.api.kodadot.xyz/',
    polkassembly: 'https://squid.subsquid.io/polkadot-polkassembly/graphql',
    replicate: 'https://replicate.kodadot.workers.dev/',
    search: 'https://polysearch.w.kodadot.xyz',
    baseUrl: 'https://kodadot.xyz',
    newsletter: 'https://newsletter.w.kodadot.xyz',
    counter: 'https://counter.kodadot.workers.dev',
    frame: 'https://frame.kodadot.workers.dev/gallery',
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
