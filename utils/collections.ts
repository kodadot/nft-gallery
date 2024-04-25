import type { TokenMetadata } from '@kodadot1/hyperdata'

export const getCollectionImage = (metadata: TokenMetadata) =>
  metadata.image || metadata.thumbnailUri || metadata.mediaUri
