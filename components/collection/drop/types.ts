export type HolderOfCollectionProp = {
  id: string
  isHolder: boolean
  hasAvailable: boolean
  amount: {
    total: number
    available: number
  }
}

export type MinimumFundsProp = {
  amount: number
  description: string
  hasAmount: boolean
}

export type MintButtonProp = {
  label: string
  disabled: boolean
}

export enum PhaseType {
  HOLDER_OF = 'holder_of',
  FREE = 'free',
  PAID = 'paid',
}

export type DropPhaseConfig = {
  type: PhaseType
  amount: number
  name?: string
}

export type MintPhase = {
  name: string
  type: PhaseType
  disabled: boolean
  mintCountAvailable: boolean
  mintedOut: boolean
  count: {
    minted: number
    max: number
  }
}

export enum MintPhaseState {
  OPEN = 'open',
  CLOSED = 'closed',
  WAITING = 'waiting',
}

export type ToMintNft = {
  name: string
  collectionName: string
  image: string
  price: string
  priceUSD: string
}
