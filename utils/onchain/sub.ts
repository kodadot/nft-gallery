export const subCollection = async (id: string) => {
  const api = await useApi().apiInstance.value
  const [queryCollectionConfig, queryCollection, queryCollectionMetadata] = await Promise.all([
    api.query.nfts.collectionConfigOf(id),
    api.query.nfts.collection(id),
    api.query.nfts.collectionMetadataOf(id),
  ])
  const collectionConfig = queryCollectionConfig.toJSON() as unknown as { maxSupply?: number }
  const collection = queryCollection.toJSON() as unknown as { items?: number }

  const collectionMetadata = queryCollectionMetadata.toHuman() as unknown as { data?: string }
  let metadata = { description: '', name: '', image: '', generative_uri: '', banner: '' }
  if (collectionMetadata.data) {
    metadata = await $fetch(sanitizeIpfsUrl(collectionMetadata.data))
  }

  return {
    maxSupply: collectionConfig.maxSupply ?? 0,
    minted: collection.items ?? 0,
    metadata,
  }
}
