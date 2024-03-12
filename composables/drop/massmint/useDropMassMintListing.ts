import isEqual from 'lodash/isEqual'
import nftEntitiesByIDs from '@/queries/subsquid/general/nftEntitiesByIDs.graphql'

export default () => {
  const { listNftByNftWithMetadata, openListingCartModal } =
    useListingCartModal({ clearItemsOnModalClose: true })

  const { client } = usePrefix()

  const { mintedNFTs } = storeToRefs(useDropStore())

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

        mintedNFTs.value = data.value.nftEntities
      }
    })
  }

  const listMintedNFts = () => {
    mintedNFTs.value.forEach(listNftByNftWithMetadata)
    openListingCartModal()
  }

  return {
    listMintedNFts,
    subscribeForNftsWithMetadata,
  }
}
