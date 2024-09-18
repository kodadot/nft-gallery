import isEqual from 'lodash/isEqual'
import nftEntitiesByIDs from '@/queries/subsquid/general/nftEntitiesByIDs.graphql'

export default () => {
  const { client } = usePrefix()
  const preferencesStore = usePreferencesStore()
  const { listNftByNftWithMetadata, clearItemsInChain } = useListingCartModal()

  const { cartMiniDisabled } = storeToRefs(useListingCartStore())
  const { mintedNFTs, toMintNFTs } = storeToRefs(useDropStore())

  const subscribeForNftsWithMetadata = (nftIds: string[]) => {
    subscribeToNfts(nftIds, async (data) => {
      const ids = data.map(item => item.id)
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

        mintedNFTs.value = data.value.nftEntities
      }
    })
  }

  const listMintedNFTs = () => {
    clearItemsInChain()
    cartMiniDisabled.value = true

    mintedNFTs.value.forEach(async (withMetadataNFT: NFTWithMetadata) => {
      const mintingSessionNFT = toMintNFTs.value.find(
        nft => nft.nft.toString() === withMetadataNFT.sn,
      )

      listNftByNftWithMetadata(
        {
          ...withMetadataNFT,
          name: mintingSessionNFT?.name || withMetadataNFT.name,
        },
        {
          image: mintingSessionNFT?.image as string,
        },
      )
    })

    const watcherStop = useModalIsOpenTracker({
      isOpen: computed(() => preferencesStore.listingCartModalOpen),
      onChange: () => {
        cartMiniDisabled.value = false
        watcherStop()
      },
    })
  }

  return {
    listMintedNFTs,
    subscribeForNftsWithMetadata,
  }
}
