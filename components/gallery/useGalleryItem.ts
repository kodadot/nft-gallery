import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { useHistoryStore } from '@/stores/history'
import { NftResources, getNftMetadata } from '@/composables/useNft'
import useSubscriptionGraphql from '@/composables/useSubscriptionGraphql'
import { getCloudflareMp4 } from '@/services/imageWorker'
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
  nftAnimationMimeType: Ref<string>
  nftImage: Ref<string>
  nftResources: Ref<NftResources[] | undefined>
}

export const useGalleryItem = (nftId?: string): GalleryItem => {
  const { $consola } = useNuxtApp()
  const historyStore = useHistoryStore()
  const nft = ref<NFT>()
  const nftImage = ref('')
  const nftAnimation = ref('')
  const nftAnimationMimeType = ref('')
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

  const { isIos, isSafari } = useDevice()
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

    const metadata = await getNftMetadata(nftEntity, urlPrefix.value, true)
    nftMetadata.value = metadata
    nftResources.value = resources

    nftImage.value = metadata.image || ''
    nftMimeType.value = metadata.imageMimeType || ''
    nftAnimation.value = metadata.animationUrl || ''
    nftAnimationMimeType.value = metadata.animationUrlMimeType || ''

    // use cf-video & replace the video thumbnail
    if (
      nftAnimationMimeType.value.includes('video') ||
      nftMimeType.value.includes('video')
    ) {
      // fallback to cloudflare-ipfs for ios & safari while video is still processing to cf-stream
      if (isIos || isSafari) {
        nftImage.value = sanitizeIpfsUrl(nft.value.meta?.image, 'cloudflare')
        nftAnimation.value = sanitizeIpfsUrl(
          nft.value.meta?.animation_url,
          'cloudflare',
        )
      }

      // serve video from cloudflare stream
      const streams = await getCloudflareMp4(
        metadata.animationUrl || metadata.image,
      )

      if (streams.uid && streams.video?.default?.percentComplete === 100) {
        nftAnimation.value = streams.video.default.url
        nftImage.value = streams.detail?.thumbnail || ''
      }
    }

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
    nftAnimationMimeType,
    nftMimeType,
    nftMetadata,
    nftResources,
  }
}
