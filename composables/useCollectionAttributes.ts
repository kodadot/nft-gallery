import { useQuery } from '@tanstack/vue-query'
import type { Attribute } from '@/types'
import type { NFT } from '@/components/massmint/types'

type NftWithAttributes = { meta?: { attributes?: Attribute[] } }

export const useCollectionAttributes = ({ collectionId, extraNfts }: { collectionId: ComputedRef<string | undefined>, extraNfts?: ComputedRef<NFT[]> }) => {
  const { data: nftsListData } = useQuery<NftWithAttributes[]>({
    queryKey: ['nft-attributes-by-collection', collectionId],
    queryFn: async () =>
      (collectionId.value
        ? (await useAsyncGraphql<{ nfts: NftWithAttributes[] } >({
            query: 'nftAttributesListByCollection',
            variables: { id: collectionId.value },
          })).data.value.nfts
        : []),
  })

  const nftsList = computed(() => (nftsListData.value || []).concat(
    extraNfts?.value
      .map(nft => ({ meta: {
        attributes: nft.attributes?.filter(attr => String(attr.trait_type) && String(attr.value)).map(attr => ({ trait: attr.trait_type, value: String(attr.value) })) } })) || []))

  const attributesList = computed<Attribute[]>(() => {
    return (nftsList.value || []).reduce((acc, nft) => {
      if (nft.meta?.attributes?.length) {
        acc.push(...nft.meta.attributes)
      }
      return acc
    }, [] as Attribute[])
  })

  const attributesRarityMaps = computed<Record<string, Record<string, number>>>(() => {
    const attributeCounts: Record<string, Record<string, number>> = {}

    attributesList.value.forEach((attr) => {
      if (!attr.trait) return
      if (!attributeCounts[attr.trait]) {
        attributeCounts[attr.trait] = {}
      }

      attributeCounts[attr.trait][attr.value]
        = (attributeCounts[attr.trait][attr.value] || 0) + 1
    })

    const totalNfts = nftsList.value.length

    return Object.fromEntries(
      Object.entries(attributeCounts).map(([traitType, valueCounts]) => [
        traitType,
        Object.fromEntries(
          Object.entries(valueCounts).map(([value, count]) => [
            value,
            parseFloat(((count / totalNfts) * 100).toFixed(1)),
          ]),
        ),
      ]),
    )
  })

  const getAttributeRarity = (trait: string, value: string | number) => {
    return attributesRarityMaps.value[trait]?.[value] || 0
  }

  return {
    getAttributeRarity,
  }
}
