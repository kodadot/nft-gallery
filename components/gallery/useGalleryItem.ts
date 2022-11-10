import { $fetch } from 'ohmyfetch'
import { sanitizeIpfsUrl } from '@/components/rmrk/utils'
import type { NFT, NFTMetadata } from '@/components/rmrk/service/scheme'

export const useGalleryItem = () => {
  const { $consola } = useNuxtApp()
  const nft = ref<NFT>()
  const nftImage = ref()
  const nftAnimation = ref()
  const nftMimeType = ref()
  const nftMetadata = ref<NFT['meta']>()

  const { params } = useRoute()
  // const { id: collectionID, item: id } = tokenIdToRoute(params.id)

  const { urlPrefix } = usePrefix()
  const { data } = useGraphql({
    queryName: urlPrefix.value === 'rmrk' ? 'nftByIdWithoutRoyalty' : 'nftById',
    variables: {
      id: params.id,
    },
  })

  interface NFTData {
    nftEntity?: NFT
  }

  const fetchNFTMetadata = async (nftMeta) => {
    const nftMetaID = sanitizeIpfsUrl(nftMeta?.id)
    const data: NFTMetadata = await $fetch(nftMetaID)

    nftMetadata.value = data
    nftMimeType.value = data?.type

    if (data?.animation_url) {
      nftAnimation.value = sanitizeIpfsUrl(data.animation_url)
    }

    if (data?.image) {
      nftImage.value = sanitizeIpfsUrl(data.image)
    }
  }

  watch(data as unknown as NFTData, async (newData) => {
    const nftEntity = newData?.nftEntity
    const nftMeta = nftEntity?.meta

    if (nftEntity) {
      nft.value = nftEntity
    } else {
      $consola.log(`NFT with id ${params.id} not found. Fallback to RPC Node`)
    }

    if (nftMeta?.id) {
      await fetchNFTMetadata(nftMeta)
    }
  })

  return {
    nft,
    nftImage,
    nftAnimation,
    nftMimeType,
    nftMetadata,
  }
}
