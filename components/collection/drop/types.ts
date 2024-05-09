export type MinimumFundsProp = {
  amount: number
  description: string
  hasAmount: boolean
  isLoading: boolean
}

export type MintButtonProp = {
  label: string
  disabled: boolean
}

export type HolderOfCollection = {
  id: string
  isHolder: boolean
  isLoading: boolean
  hasAvailable: boolean
  amount: {
    total: number
    available: number
  }
}

export type ToMintNft = {
  name: string
  collectionName: string
  image: string
  price: string
  priceUSD: string
}

export type MintedNFT = {
  id: string
  chain: string
  name: string
  image: string
  index: number
  collection: { id: string; name: string; max: number }
  mimeType?: string
}

export type MintingSession = {
  txHash?: string
  items: MintedNFT[]
}
