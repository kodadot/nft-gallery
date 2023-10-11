import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { getMimeType } from '@/utils/gallery/media'
import { useHistoryStore } from '@/stores/history'
import { NftResources, getNftMetadata } from '@/composables/useNft'
import useSubscriptionGraphql from '@/composables/useSubscriptionGraphql'
import type { NFT } from '@/components/rmrk/service/scheme'
import type { NFTWithMetadata } from '@/composables/useNft'
import type { Ref } from 'vue'

interface NFTData {
  nftEntity?: NFTWithMetadata
}

export interface GalleryItem {
  nft: Ref<NFT | undefined>
  nftMimeType: Ref<string>
  nftMetadata: Ref<NFTWithMetadata | undefined>
  nftAnimation: Ref<string>
  nftImage: Ref<string>
  nftResources: Ref<NftResources[] | undefined>
}

const whichMimeType = async (data) => {
  if (data?.type) {
    return data?.type
  }
  if (data?.animationUrl) {
    return await getMimeType(sanitizeIpfsUrl(data.animationUrl))
  }
  if (data?.image || data?.mediaUri) {
    return await getMimeType(sanitizeIpfsUrl(data?.image || data?.mediaUri))
  }

  return ''
}

const whichAsset = (data) => {
  return {
    animation_url: sanitizeIpfsUrl(data.animationUrl || ''),
    image: sanitizeIpfsUrl(data.image || data.mediaUri || '', 'image'),
  }
}

export const useGalleryItem = (nftId?: string): GalleryItem => {
  const { $consola } = useNuxtApp()
  const historyStore = useHistoryStore()
  const nft = ref<NFT>()
  const nftImage = ref('')
  const nftAnimation = ref('')
  const nftMimeType = ref('')
  const nftMetadata = ref<NFTWithMetadata>()
  const nftResources = ref<NftResources[]>()

  const { params } = useRoute()
  const id = nftId || params.id
  // const { id: collectionID, item: id } = tokenIdToRoute(params.id)

  const queryPath = {
    rmrk: 'chain-rmrk',
    ksm: 'chain-ksm',
    ahk: 'chain-ahk',
  }

  const { urlPrefix } = usePrefix()
  const { data, refetch } = useGraphql({
    queryName: 'nftById',
    queryPrefix: queryPath[urlPrefix.value],
    variables: {
      id,
    },
  })

  useSubscriptionGraphql({
    query: `   nft: nftEntityById(id: "${id}") {
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
      $consola.log(`NFT with id ${id} not found. Fallback to RPC Node`)
      return
    }

    nft.value = nftEntity

    const resources = nftEntity.resources?.map((resource, index) => {
      const imageSrc =
        resource.meta?.animationUrl ||
        resource.src ||
        resource.meta?.image ||
        resource.thumb

      let animationUrl = resource.meta?.animationUrl

      if (index === 0 && !animationUrl) {
        animationUrl = nftEntity.meta.animation_url
      }

      return {
        ...resource,
        src: sanitizeIpfsUrl(imageSrc),
        thumb: sanitizeIpfsUrl(resource.thumb || resource.meta?.image),
        animation: sanitizeIpfsUrl(animationUrl),
      }
    })

    nftMetadata.value = await getNftMetadata(nftEntity, urlPrefix.value)
    nftMimeType.value = await whichMimeType(nftMetadata.value)
    nftResources.value = resources

    const asset = whichAsset(nftMetadata.value)
    nftImage.value = asset.image
    nftAnimation.value = asset.animation_url

    historyStore.addHistoryItem({
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
    nftResources,
  }
}
