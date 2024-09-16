import type { Prefix } from '@kodadot1/static'
import type { DropStatus } from '@/components/drops/useDrops'
import type { Abi } from '@/composables/transaction/types'

export interface Unit {
  name: string
  value: number
}

type DropType = 'paid' | 'free' | 'holder'

export type DropItem = {
  // offchain (database)
  id: string
  chain: Prefix
  alias: string
  collection: string // collection id
  type: DropType
  disabled: number
  start_at?: string
  holder_of?: string
  price?: string
  creator?: string

  // onchain
  max?: number
  minted: number
  name: string
  collectionName: string
  collectionDescription: string
  image: string
  banner: string
  content: string
  abi?: Abi | null

  // additional data
  dropStartTime?: Date
  isMintedOut: boolean
  isFree: boolean
  status: DropStatus
}
