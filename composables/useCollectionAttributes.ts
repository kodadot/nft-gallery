import type { NFT, Attribute } from '@/types'

export const useCollectionAttributes = (collectionId: ComputedRef<string | undefined>) => {
  const { data: nftAttributesData, refetch } = useGraphql({
    queryName: 'nftAttributesListByCollection',
    variables: {
      id: collectionId.value,
    },
    disabled: computed(() => !collectionId.value),
  })

  watch(collectionId, () => {
    refetch({
      id: collectionId.value,
    })
  })

  const nftsList = computed<NFT[]>(() => {
    return (nftAttributesData.value as unknown as { nfts: NFT[] })?.nfts || []
  })

  const attributesList = computed<Attribute[]>(() => {
    return nftsList.value.reduce((acc, nft) => {
      if (nft.meta?.attributes?.length) {
        acc.push(...nft.meta.attributes)
      }
      return acc
    }, [] as Attribute[])
  })

  const attributesRarityMaps = computed(() => {
    const attributeCounts: Record<string, Record<string, number>> = {}

    attributesList.value.forEach((attr) => {
      if (!attr.trait) return
      if (!attributeCounts[attr.trait]) {
        attributeCounts[attr.trait] = {}
      }

      attributeCounts[attr.trait][attr.value]
        = (attributeCounts[attr.trait][attr.value] || 0) + 1
    })
    const rarityMaps: Record<string, Record<string, number>> = {}
    const totalNfts = nftsList.value?.length || 0

    Object.entries(attributeCounts).forEach(([traitType, valueCounts]) => {
      rarityMaps[traitType] = {}

      Object.entries(valueCounts).forEach(([value, count]) => {
        rarityMaps[traitType][value] = parseFloat((count / totalNfts * 100).toFixed(1))
      })
    })

    return rarityMaps
  })

  const getAttributeRarity = (trait: string, value: string) => {
    return attributesRarityMaps.value[trait]?.[value] || 0
  }

  return {
    getAttributeRarity,
  }
}
