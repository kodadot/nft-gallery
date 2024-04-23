import type { Metadata } from '@/components/rmrk/service/scheme'

export const getCollectionImage = (metadata: Metadata) =>
  metadata.image || metadata.thumbnailUri || metadata.mediaUri
