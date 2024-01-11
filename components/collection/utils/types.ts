import { CollectionMetadata } from '@/components/rmrk/service/scheme'

export type Stats = {
  listedCount?: number
  collectionLength?: number
  collectionFloorPrice?: number
  uniqueOwners?: number
  uniqueOwnersPercent?: string
  collectionTradedVolumeNumber?: string | number
  maxSupply?: number
}

export type CollectionEntityMinimal = {
  id: string
  issuer: string
  meta: CollectionMetadata
  metadata: string
  name: string
  currentOwner: string
  type: string
}
