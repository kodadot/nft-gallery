import { $fetch } from 'ohmyfetch'
import { sanitizeIpfsUrl } from '@/components/rmrk/utils'
import { getMimeType } from '@/utils/gallery/media'
import type { NFT, NFTMetadata } from '@/components/rmrk/service/scheme'

const whichMimeType = async (data) => {
  if (data?.type) {
    return data?.type
  } else if (data?.animation_url) {
    return await getMimeType(sanitizeIpfsUrl(data.animation_url))
  } else if (data?.image) {
    return await getMimeType(sanitizeIpfsUrl(data.image))
  }

  return ''
}

const whichAsset = (data) => {
  return {
    animation_url: sanitizeIpfsUrl(data.animation_url || ''),
    image: sanitizeIpfsUrl(data.image || ''),
  }
}

export const useGalleryItem = () => {
  const { $consola } = useNuxtApp()
  const nft = ref<NFT>()
  const nftImage = ref('')
  const nftAnimation = ref('')
  const nftMimeType = ref('')
  const nftMetadata = ref<NFTMetadata>()

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

  watch(data as unknown as NFTData, async (newData) => {
    const nftEntity = newData?.nftEntity

    if (!nftEntity) {
      $consola.log(`NFT with id ${params.id} not found. Fallback to RPC Node`)
      return
    }

    nft.value = nftEntity

    if (!nftEntity?.metadata) {
      $consola.log(`NFT with id ${params.id} has no metadata`)
      return
    }

    nftMetadata.value = await $fetch(sanitizeIpfsUrl(nftEntity?.metadata))
    nftMimeType.value = await whichMimeType(nftMetadata.value)

    const asset = whichAsset(nftMetadata.value)
    nftImage.value = asset.image
    nftAnimation.value = asset.animation_url
  })

  return {
    nft,
    nftImage,
    nftAnimation,
    nftMimeType,
    nftMetadata,
  }
}
