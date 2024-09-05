import type { Ref } from 'vue'
import { tokenIdToRoute } from '../unique/utils'
import type { NFT } from '@/components/rmrk/service/scheme'
import type { NFTWithMetadata } from '@/composables/useNft'
import useSubscriptionGraphql from '@/composables/useSubscriptionGraphql'
import { getCloudflareMp4 } from '@/services/imageWorker'
import { useHistoryStore } from '@/stores/history'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import type { NFTMetadata } from '@/services/oda'
import { fetchMimeType, fetchOdaToken } from '@/services/oda'

interface NFTData {
  nftEntity?: NFTWithMetadata
}

export interface GalleryItem {
  nft: Ref<NFT | undefined>
  nftMimeType: Ref<string>
  nftMetadata: Ref<NFTMetadata | undefined>
  nftAnimation: Ref<string>
  nftAnimationMimeType: Ref<string>
  nftImage: Ref<string>
}

export const useGalleryItem = (nftId?: string): GalleryItem => {
  const { $consola } = useNuxtApp()
  const historyStore = useHistoryStore()
  const nft = ref<NFT>()
  const nftImage = ref('')
  const nftAnimation = ref('')
  const nftAnimationMimeType = ref('')
  const nftMimeType = ref('')
  const nftMetadata = ref<NFTMetadata>()

  const { params } = useRoute()
  const id = nftId || params.id
  const { id: collectionId, item: tokenId } = tokenIdToRoute(id.toString())

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

  onBeforeMount(async () => {
    const getMetadata = await fetchOdaToken(urlPrefix.value, collectionId, tokenId)
    const metadata = getMetadata.metadata
    nftMetadata.value = metadata

    const mimeType = metadata.image ? await fetchMimeType(metadata.image) : null
    const mimeTypeAnimation = metadata.animation_url ? await fetchMimeType(metadata.animation_url) : null

    nftAnimation.value = sanitizeIpfsUrl(metadata.animation_url)
    nftAnimationMimeType.value = mimeTypeAnimation?.mime_type || ''
    nftImage.value = sanitizeIpfsUrl(metadata.image)
    nftMimeType.value = mimeType?.mime_type || ''

    // use cf-video & replace the video thumbnail
    if (
      nftAnimationMimeType.value.includes('video')
      || nftMimeType.value.includes('video')
    ) {
      // fallback to cloudflare-ipfs for ios & safari while video is still processing to cf-stream
      if (isIos || isSafari) {
        nftImage.value = sanitizeIpfsUrl(metadata.image, 'cloudflare')
        nftAnimation.value = sanitizeIpfsUrl(metadata.animation_url, 'cloudflare')
      }

      // serve video from cloudflare stream
      const streams = await getCloudflareMp4(
        metadata.animation_url || metadata.image,
      )

      if (streams.uid && streams.video?.default?.percentComplete === 100) {
        nftAnimation.value = streams.video.default.url
        nftImage.value = streams.detail?.thumbnail || ''
      }
    }
  })

  return {
    nft,
    nftImage,
    nftAnimation,
    nftAnimationMimeType,
    nftMimeType,
    nftMetadata,
  }
}
