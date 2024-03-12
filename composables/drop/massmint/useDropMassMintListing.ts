import isEqual from 'lodash/isEqual'
import nftEntitiesByIDs from '@/queries/subsquid/general/nftEntitiesByIDs.graphql'

export default () => {
  const { listNftByNftWithMetadata, openListingCartModal } =
    useListingCartModal(true)

  const { client } = usePrefix()

  const mintedNFTsWithMetadata = ref<NFTWithMetadata[]>([])

  const subscribeForNftsWithMetadata = (nftIds: string[]) => {
    subscribeToNfts(nftIds, async (data) => {
      const ids = data.map((item) => item.id)
      const readyToFetch = isEqual(ids.sort(), nftIds.sort())

      if (readyToFetch) {
        const { data } = await useAsyncQuery<{
          nftEntities: NFTWithMetadata[]
        }>({
          query: nftEntitiesByIDs,
          variables: {
            ids: nftIds,
          },
          clientId: client.value,
        })

        mintedNFTsWithMetadata.value = data.value.nftEntities
      }
    })
  }

  const canListMintedNfts = computed(() =>
    Boolean(mintedNFTsWithMetadata.value.length),
  )

  const listMintedNFts = () => {
    mintedNFTsWithMetadata.value.forEach(listNftByNftWithMetadata)
    openListingCartModal()
  }

  return {
    listMintedNFts,
    canListMintedNfts,
    mintedNFTsWithMetadata,
    subscribeForNftsWithMetadata,
  }
}
