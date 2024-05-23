import isEqual from 'lodash/isEqual'
import nftEntitiesByIDs from '@/queries/subsquid/general/nftEntitiesByIDs.graphql'

export default () => {
  const { client } = usePrefix()
  const { listNftByNftWithMetadata } = useListingCartModal()

  const { mintedNFTs, mintingSession } = storeToRefs(useDropStore())

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

  const listMintedNFTs = () => {
    mintedNFTs.value.forEach((withMetadataNFT: NFTWithMetadata) => {
      const mintingSessionNFT = mintingSession.value.items.find(
        (nft) => nft.id === withMetadataNFT.id,
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
  }

  return {
    listMintedNFTs,
    subscribeForNftsWithMetadata,
  }
}
