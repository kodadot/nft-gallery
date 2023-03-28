import { CollectionMetadata } from '@/components/rmrk/service/scheme'

export type Stats = {
  listedCount?: number
  collectionLength?: number
  collectionFloorPrice?: number
  bestOffer?: number
  uniqueOwners?: number
  uniqueOwnersPercent?: string
  collectionTradedVolumeNumber?: bigint
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
