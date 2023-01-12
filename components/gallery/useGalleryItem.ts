import { $fetch } from 'ohmyfetch'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { getMimeType } from '@/utils/gallery/media'
import type { NFT, NFTMetadata } from '@/components/rmrk/service/scheme'
interface NFTData {
  nftEntity?: NFT
}

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
    image: sanitizeIpfsUrl(data.image || '', 'image'),
  }
}

export const useGalleryItem = () => {
  const { $consola, $store } = useNuxtApp()
  const nft = ref<NFT>()
  const nftImage = ref('')
  const nftAnimation = ref('')
  const nftMimeType = ref('')
  const nftMetadata = ref<NFTMetadata>()

  const { params } = useRoute()
  // const { id: collectionID, item: id } = tokenIdToRoute(params.id)

  const { urlPrefix } = usePrefix()
  const { data, refetch } = useGraphql({
    queryName: urlPrefix.value === 'rmrk' ? 'nftByIdWithoutRoyalty' : 'nftById',
    variables: {
      id: params.id,
    },
    options: {
      fetchPolicy: 'network-only',
    },
  })
  useSubscriptionGraphql({
    query: `   nft: nftEntityById(id: "${params.id}") {
      id
      currentOwner
      price
      burned
      events {
        id
      }
    }`,
    onChange: refetch,
  })
  watch(data as unknown as NFTData, async (newData) => {
    const nftEntity = newData?.nftEntity

    if (!nftEntity) {
      $consola.log(`NFT with id ${params.id} not found. Fallback to RPC Node`)
      return
    }

    nft.value = nftEntity
    nftMetadata.value = await $fetch(sanitizeIpfsUrl(nftEntity.metadata))
    nftMimeType.value = await whichMimeType(nftMetadata.value)

    const asset = whichAsset(nftMetadata.value)
    nftImage.value = asset.image
    nftAnimation.value = asset.animation_url

    $store.dispatch('history/addHistoryItem', {
      id: nft.value.id,
      name: nft.value.name,
      image: nftImage.value,
      collection: nft.value.collection.name,
      date: new Date(),
      description: nftMetadata.value?.description,
      author: nft.value.currentOwner,
      price: nft.value.price,
      mimeType: nftMimeType.value,
      prefix: urlPrefix,
    })
  })

  return {
    nft,
    nftImage,
    nftAnimation,
    nftMimeType,
    nftMetadata,
  }
}
