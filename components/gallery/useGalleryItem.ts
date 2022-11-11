import { $fetch } from 'ohmyfetch'
import { sanitizeIpfsUrl } from '@/components/rmrk/utils'
import type { NFT, NFTMetadata } from '@/components/rmrk/service/scheme'
import { getMimeType } from '@/utils/gallery/media'

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
    console.log('metadata', data)

    nftMetadata.value = data

    if (data?.type) {
      nftMimeType.value = data?.type
    } else if (data?.animation_url) {
      nftMimeType.value = await getMimeType(sanitizeIpfsUrl(data.animation_url))
    } else if (data?.image) {
      nftMimeType.value = await getMimeType(sanitizeIpfsUrl(data.image))
    }

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

    console.log(nftEntity)

    if (nftMeta?.id) {
      await fetchNFTMetadata(nftMeta)
    } else if (nftMeta === null && nftEntity?.metadata) {
      const meta = await $fetch(sanitizeIpfsUrl(nftEntity?.metadata))
      await fetchNFTMetadata({
        ...meta,
        id: nftEntity?.metadata,
      })
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
