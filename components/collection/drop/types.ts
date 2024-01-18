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

export enum DropType {
  HOLDER_OF = 'holder_of',
  PAID = 'paid',
}

export type MintPhase = {
  name: string
  type: DropType
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
