import type { Ref } from 'vue'
import { tokenIdToRoute } from '../unique/utils'
import type { NFTOffer, NFTWithMetadata } from '@/composables/useNft'
import useSubscriptionGraphql from '@/composables/useSubscriptionGraphql'
import { getDrops } from '@/services/fxart'
import { getCloudflareMp4 } from '@/services/imageWorker'
import type { NFTMetadata } from '@/services/oda'
import { fetchMimeType, fetchOdaToken } from '@/services/oda'
import { useHistoryStore } from '@/stores/history'
import { sanitizeIpfsUrl } from '@/utils/ipfs'

interface NFTData {
  nftEntity?: NftEntity
}

type NftEntity = NFTWithMetadata & { dropCreator?: string }

export interface GalleryItem {
  nft: Ref<NftEntity | undefined>
  nftMimeType: Ref<string>
  nftMetadata: Ref<NFTMetadata | undefined>
  nftAnimation: Ref<string>
  nftAnimationMimeType: Ref<string>
  nftImage: Ref<string>
  nftHighestOffer: Ref<NFTOffer | undefined>
}

export const useGalleryItem = (nftId?: string): GalleryItem => {
  const { $consola } = useNuxtApp()
  const historyStore = useHistoryStore()
  const nft = ref<NftEntity>()
  const nftImage = ref('')
  const nftAnimation = ref('')
  const nftAnimationMimeType = ref('')
  const nftMimeType = ref('')
  const nftMetadata = ref<NFTMetadata>()

  const nftHighestOffer = ref<NFTOffer>()
  const isOfferIndexerDisabled = computed(() => urlPrefix.value !== 'ahp')

  const { params } = useRoute()
  const id = nftId || params.id
  const { id: collectionId, item: tokenId } = tokenIdToRoute(id.toString())

  const queryPath = {
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

  const { data: nftOfferData, refetch: refetchHighestOffer } = useGraphql({
    queryName: 'highestOfferByNftId',
    disabled: isOfferIndexerDisabled,
    variables: {
      id,
    },
  })

  const getIndexerToken = () => {
    refetch({ id })
  }

  const refreshToken = async () => {
    getIndexerToken()
    getOdaToken()
  }

  const getOdaToken = async () => {
    const getMetadata = await fetchOdaToken(urlPrefix.value, collectionId, tokenId)
    const metadata = getMetadata.metadata

    if (!metadata) {
      return
    }

    nftMetadata.value = metadata
    nftAnimation.value = sanitizeIpfsUrl(metadata.animation_url)
    nftImage.value = sanitizeIpfsUrl(metadata.image)

    const mimeTypeAnimation = metadata.animation_url ? await fetchMimeType(metadata.animation_url) : null
    nftAnimationMimeType.value = mimeTypeAnimation?.mime_type || ''

    const mimeType = metadata.image ? await fetchMimeType(metadata.image) : null
    nftMimeType.value = mimeType?.mime_type || ''

    // use cf-video & replace the video thumbnail
    if (
      nftAnimationMimeType.value.includes('video')
      || nftMimeType.value.includes('video')
    ) {
      // serve video from cloudflare stream
      const streams = await getCloudflareMp4(
        metadata.animation_url || metadata.image,
      )

      if (streams.uid && streams.video?.default?.percentComplete === 100) {
        nftAnimation.value = streams.video.default.url
        nftImage.value = streams.detail?.thumbnail || ''
      }
    }
  }

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
    onChange: getIndexerToken,
    immediate: false,
  })

  useSubscriptionGraphql({
    query: `nftEntityById(id: "${id}") {
      metadata
    }`,
    onChange: refreshToken,
    immediate: false,
  })

  useSubscriptionGraphql({
    query: `offers(where: {status_eq: ACTIVE, desired: {id_eq: "${id}"}}, orderBy: price_DESC, limit: 1) {
      id
    }`,
    disabled: isOfferIndexerDisabled,
    onChange: refetchHighestOffer,
  })

  watch(data as unknown as NFTData, async (newData) => {
    const nftEntity = newData?.nftEntity
    if (!nftEntity) {
      $consola.log(`NFT with id ${id} not found. Fallback to RPC Node`)
      return
    }

    if (nftEntity.collection.id) {
      await getDrops({
        collection: nftEntity.collection.id,
        chain: [urlPrefix.value],
      }).then((drops) => {
        if (drops && drops[0]?.creator) {
          nftEntity.dropCreator = drops[0].creator
        }
      })
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

  watch(nftOfferData as unknown as { offers: NFTOffer[] }, (newData) => {
    if (newData && newData.offers && newData.offers[0]) {
      nftHighestOffer.value = newData.offers[0]
    }
  })

  onBeforeMount(getOdaToken)

  return {
    nft,
    nftImage,
    nftAnimation,
    nftAnimationMimeType,
    nftMimeType,
    nftMetadata,
    nftHighestOffer,
  }
}
