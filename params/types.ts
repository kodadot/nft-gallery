import type { Prefix } from '@kodadot1/static'

export interface Unit {
  name: string
  value: number
}

type DropType = 'paid' | 'free' | 'holder'

export type DropItem = {
  id: string
  chain: Prefix
  collection: string // collection id
  collectionName: string
  collectionDescription: string
  image: string
  banner: string
  name: string
  content: string
  alias: string
  type: DropType
  disabled: number
  minted: number
  max?: number
  price?: string
  holder_of?: string
  start_at?: string
  creator?: string
}
